/**
 * Magnetic variable-type hover — soft exponential proximity weight + horizontal push.
 * Char advances stay locked at bold width so wght changes never reflow the line.
 */

/** Inclusive index span for one word (or line) within the flat char list. */
export interface WordRange {
	readonly startIdx: number;
	readonly endIdx: number;
}

/** Options for {@link initMagneticType}. */
export interface InitMagneticTypeOptions {
	readonly root: HTMLElement;
	/** Per-word/line ranges for horizontal push smoothing. Auto-detected when omitted. */
	readonly wordRanges?: readonly WordRange[];
	readonly weightMin?: number;
	readonly weightMax?: number;
	readonly minDesktopWidth?: number;
	readonly charSelector?: string;
}

interface CharRect {
	readonly left: number;
	readonly top: number;
	readonly width: number;
	readonly height: number;
	readonly cx: number;
	readonly cy: number;
}

const DEFAULT_WEIGHT_MIN = 100;
const DEFAULT_WEIGHT_MAX = 700;
const DEFAULT_MIN_DESKTOP = 1000;
const DEFAULT_CHAR_SELECTOR = '[data-magnetic-char]';

/**
 * Build word ranges from a flat string (spaces separate words; spaces themselves
 * are still counted in the index space when mirrored as char spans).
 */
export const buildWordRanges = (text: string): WordRange[] => {
	const ranges: WordRange[] = [];
	let i = 0;
	while (i < text.length) {
		while (i < text.length && /\s/u.test(text.charAt(i))) {
			i += 1;
		}
		if (i >= text.length) break;
		const startIdx = i;
		while (i < text.length && !/\s/u.test(text.charAt(i))) {
			i += 1;
		}
		ranges.push({ startIdx, endIdx: i - 1 });
	}
	return ranges;
};

/**
 * Build ranges for stacked lines with no interstitial space in the flat char list
 * (e.g. hero "ASHIMA" / "KAUSHIK").
 */
export const buildLineRanges = (lines: readonly string[]): WordRange[] => {
	const ranges: WordRange[] = [];
	let offset = 0;
	for (const line of lines) {
		if (line.length === 0) continue;
		ranges.push({ startIdx: offset, endIdx: offset + line.length - 1 });
		offset += line.length;
	}
	return ranges;
};

/**
 * Derive word ranges from `.magnetic-type__word` / `[data-magnetic-word]` wrappers.
 * Falls back to scanning concatenated char text when no wrappers exist.
 */
export const buildWordRangesFromDom = (
	root: HTMLElement,
	charSelector = DEFAULT_CHAR_SELECTOR,
): WordRange[] => {
	const chars = Array.from(
		root.querySelectorAll<HTMLElement>(charSelector),
	);
	const wrappers = root.querySelectorAll<HTMLElement>(
		'.magnetic-type__word, [data-magnetic-word]',
	);

	if (wrappers.length === 0) {
		return buildWordRanges(chars.map((el) => el.textContent ?? '').join(''));
	}

	const ranges: WordRange[] = [];
	wrappers.forEach((wrapper) => {
		const wordChars = Array.from(
			wrapper.querySelectorAll<HTMLElement>(charSelector),
		);
		const first = wordChars[0];
		const last = wordChars[wordChars.length - 1];
		if (!first || !last) return;
		const startIdx = chars.indexOf(first);
		const endIdx = chars.indexOf(last);
		if (startIdx < 0 || endIdx < 0) return;
		ranges.push({ startIdx, endIdx });
	});
	return ranges;
};

/**
 * Freeze each glyph's advance at the widest weight so wght changes never reflow.
 * Resting weight is always `weightMin` (proximity 0); peak hover is `weightMax`.
 * Pass inverted values (e.g. 700 → 100) for bold-to-thin headings.
 */
export const lockMagneticCharWidths = (
	root: HTMLElement,
	chars: readonly HTMLElement[],
	weightMin = DEFAULT_WEIGHT_MIN,
	weightMax = DEFAULT_WEIGHT_MAX,
): void => {
	const wideWeight = Math.max(weightMin, weightMax);
	for (const el of chars) {
		el.style.fontWeight = String(wideWeight);
		el.style.fontVariationSettings = `'wght' ${wideWeight}`;
	}
	void root.offsetWidth;
	for (const el of chars) {
		el.style.width = `${el.getBoundingClientRect().width}px`;
	}
	for (const el of chars) {
		el.style.fontWeight = String(weightMin);
		el.style.fontVariationSettings = `'wght' ${weightMin}`;
	}
};

/**
 * Soften abrupt horizontal push falloff within a word.
 */
const smoothPush = (values: readonly number[]): number[] => {
	const out = [...values];
	const n = out.length;
	if (n === 0) return out;
	for (let i = 1; i < n; i++) {
		const prev = out[i - 1]!;
		const curr = out[i]!;
		if (prev > 0 && curr < prev) out[i] = prev;
	}
	for (let i = n - 2; i >= 0; i--) {
		const next = out[i + 1]!;
		const curr = out[i]!;
		if (next < 0 && curr > next) out[i] = next;
	}
	return out;
};

/**
 * Attach magnetic hover to a heading (or any root that contains magnetic chars).
 * No-ops when reduced motion is preferred or when no chars are found.
 * Returns a disposer that removes listeners and cancels the animation frame.
 */
export const initMagneticType = (
	options: InitMagneticTypeOptions,
): (() => void) => {
	const {
		root,
		weightMin = DEFAULT_WEIGHT_MIN,
		weightMax = DEFAULT_WEIGHT_MAX,
		minDesktopWidth = DEFAULT_MIN_DESKTOP,
		charSelector = DEFAULT_CHAR_SELECTOR,
	} = options;

	const prefersReduced = window.matchMedia(
		'(prefers-reduced-motion: reduce)',
	).matches;
	if (prefersReduced) return () => undefined;

	const chars = Array.from(
		root.querySelectorAll<HTMLElement>(charSelector),
	);
	const count = chars.length;
	if (count === 0) return () => undefined;

	const wordRanges =
		options.wordRanges ?? buildWordRangesFromDom(root, charSelector);
	if (wordRanges.length === 0) return () => undefined;

	/** Softer than a hard follow — keeps motion creamy. */
	const LERP_ACTIVE = 0.07;
	const LERP_SETTLE = 0.045;
	const MOUSE_LERP = 0.1;
	const EPSILON = 0.02;

	const targetProx = new Float32Array(count);
	const targetPush = new Float32Array(count);
	const currentProx = new Float32Array(count);
	const currentPush = new Float32Array(count);

	let rects: CharRect[] | null = null;
	let rafId = 0;
	let pointerInside = false;
	let rawX = 0;
	let rawY = 0;
	let smoothX = 0;
	let smoothY = 0;
	let mouseInitialized = false;
	let disposed = false;

	const lockCharWidths = (): void => {
		const needsLock = chars.some((el) => !el.style.width);
		if (!needsLock) return;
		lockMagneticCharWidths(root, chars, weightMin, weightMax);
	};

	const captureRects = (): void => {
		rects = chars.map((el) => {
			const r = el.getBoundingClientRect();
			return {
				left: r.left,
				top: r.top,
				width: r.width,
				height: r.height,
				cx: r.left + r.width / 2,
				cy: r.top + r.height / 2,
			};
		});
	};

	const invalidateRects = (): void => {
		rects = null;
	};

	const ensureRects = (): CharRect[] => {
		if (!rects) captureRects();
		return rects!;
	};

	const computeTargets = (clientX: number, clientY: number): void => {
		targetProx.fill(0);
		targetPush.fill(0);
		const bounds = ensureRects();

		for (const range of wordRanges) {
			const pushes: number[] = [];
			const proxes: number[] = [];
			const len = range.endIdx - range.startIdx + 1;

			for (let i = range.startIdx; i <= range.endIdx; i++) {
				const rect = bounds[i];
				if (!rect) {
					pushes.push(0);
					proxes.push(0);
					continue;
				}
				const dx = rect.cx - clientX;
				const dy = rect.cy - clientY;
				const dist = Math.sqrt(dx * dx + dy * dy);
				const radius = 3 * rect.width;

				if (dist < radius && dist > 0) {
					const proximity = Math.max(0, 1 - dist / radius);
					const force = proximity * proximity * 3;
					pushes.push((dx / dist) * force);
					proxes.push(proximity);
				} else {
					pushes.push(0);
					proxes.push(0);
				}
			}

			const smoothed = smoothPush(pushes);
			for (let e = 0; e < len; e++) {
				const idx = range.startIdx + e;
				targetProx[idx] = proxes[e]!;
				targetPush[idx] = smoothed[e]!;
			}
		}
	};

	const applyStyles = (): void => {
		for (let i = 0; i < count; i++) {
			const el = chars[i];
			if (!el) continue;
			const prox = currentProx[i]!;
			const push = currentPush[i]!;
			const weight = weightMin + (weightMax - weightMin) * prox;
			el.style.transform = `translate3d(${push.toFixed(2)}px, 0, 0)`;
			el.style.fontWeight = String(weight);
			el.style.fontVariationSettings = `'wght' ${weight.toFixed(1)}`;
		}
	};

	const stillMoving = (): boolean => {
		if (pointerInside) return true;
		for (let i = 0; i < count; i++) {
			if (
				Math.abs(currentProx[i]!) > EPSILON ||
				Math.abs(currentPush[i]!) > EPSILON ||
				Math.abs(targetProx[i]! - currentProx[i]!) > EPSILON ||
				Math.abs(targetPush[i]! - currentPush[i]!) > EPSILON
			) {
				return true;
			}
		}
		return false;
	};

	const tick = (): void => {
		if (disposed) return;

		if (pointerInside) {
			// Sticky / transformed parents move under the pointer — refresh bounds.
			invalidateRects();
			if (!mouseInitialized) {
				smoothX = rawX;
				smoothY = rawY;
				mouseInitialized = true;
			} else {
				smoothX += (rawX - smoothX) * MOUSE_LERP;
				smoothY += (rawY - smoothY) * MOUSE_LERP;
			}
			computeTargets(smoothX, smoothY);
		} else {
			targetProx.fill(0);
			targetPush.fill(0);
		}

		const settling = !pointerInside;
		const lerp = settling ? LERP_SETTLE : LERP_ACTIVE;

		for (let i = 0; i < count; i++) {
			currentProx[i]! += (targetProx[i]! - currentProx[i]!) * lerp;
			currentPush[i]! += (targetPush[i]! - currentPush[i]!) * lerp;
		}

		applyStyles();

		if (stillMoving()) {
			rafId = requestAnimationFrame(tick);
		} else {
			rafId = 0;
			currentProx.fill(0);
			currentPush.fill(0);
			applyStyles();
		}
	};

	const startLoop = (): void => {
		if (rafId || prefersReduced || disposed) return;
		rafId = requestAnimationFrame(tick);
	};

	const onMove = (event: MouseEvent): void => {
		if (window.innerWidth < minDesktopWidth) return;
		rawX = event.clientX;
		rawY = event.clientY;
		pointerInside = true;
		startLoop();
	};

	const onLeave = (): void => {
		pointerInside = false;
		mouseInitialized = false;
		startLoop();
	};

	const onResize = (): void => {
		for (const el of chars) {
			el.style.width = '';
			el.style.transform = '';
		}
		lockMagneticCharWidths(root, chars, weightMin, weightMax);
		invalidateRects();
		captureRects();
	};

	const onScroll = (): void => {
		invalidateRects();
	};

	const boot = (): void => {
		if (disposed) return;
		lockCharWidths();
		captureRects();
	};

	if (document.fonts?.ready) {
		void document.fonts.ready.then(boot);
	} else {
		boot();
	}

	root.addEventListener('mousemove', onMove);
	root.addEventListener('mouseleave', onLeave);
	window.addEventListener('resize', onResize);
	window.addEventListener('scroll', onScroll, { passive: true, capture: true });

	return () => {
		disposed = true;
		if (rafId) cancelAnimationFrame(rafId);
		rafId = 0;
		root.removeEventListener('mousemove', onMove);
		root.removeEventListener('mouseleave', onLeave);
		window.removeEventListener('resize', onResize);
		window.removeEventListener('scroll', onScroll, {
			capture: true,
		} as EventListenerOptions);
	};
};

/**
 * Initialize every `[data-magnetic-root]` on the page that is not already live.
 * Roots with `data-magnetic-invert` rest heavier and thin toward the cursor.
 * Optional `data-magnetic-rest` sets the resting weight (default 700).
 */
export const initMagneticTypeAll = (
	overrides: Omit<InitMagneticTypeOptions, 'root'> = {},
): void => {
	const roots = document.querySelectorAll<HTMLElement>('[data-magnetic-root]');
	roots.forEach((root) => {
		if (root.dataset.magneticInit === 'true') return;
		root.dataset.magneticInit = 'true';
		const inverted = root.hasAttribute('data-magnetic-invert');
		const restAttr = root.dataset.magneticRest;
		const restWeight = restAttr
			? Number.parseInt(restAttr, 10)
			: DEFAULT_WEIGHT_MAX;
		const peakWeight = DEFAULT_WEIGHT_MIN;
		initMagneticType({
			...overrides,
			root,
			weightMin: inverted
				? (Number.isFinite(restWeight) ? restWeight : DEFAULT_WEIGHT_MAX)
				: (overrides.weightMin ?? DEFAULT_WEIGHT_MIN),
			weightMax: inverted
				? peakWeight
				: (overrides.weightMax ?? DEFAULT_WEIGHT_MAX),
		});
	});
};
