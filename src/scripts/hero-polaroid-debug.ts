/**
 * Hero polaroid layout debugger.
 *
 * Enable with `?heroDebug=1` on the home page. Drag cards to reposition,
 * add new images (wrapped as classic polaroids), tweak size / rotation,
 * then Export to copy the updated `heroPolaroids` array for Hero.astro.
 */
interface PolaroidExport {
	readonly src: string;
	readonly alt: string;
	readonly top: string;
	readonly left: string;
	readonly width: string;
	readonly aspectRatio: string;
	readonly rotate: number;
	readonly z: number;
	readonly mobileShow?: boolean;
}

interface ClampWidth {
	readonly minRem: number;
	readonly midVw: number;
	readonly maxRem: number;
}

interface DebugState {
	el: HTMLElement;
	src: string;
	alt: string;
	aspectRatio: string;
	mobileShow: boolean;
	baseClamp: ClampWidth | null;
	baseWidthPx: number;
	scale: number;
	rotate: number;
	topPct: number;
	leftPct: number;
	/** Stacking order — higher draws above. Updated when bringing to front. */
	zIndex: number;
}

const QUERY_FLAG = 'heroDebug';

/** Default responsive width for newly added polaroids. */
const DEFAULT_CLAMP: ClampWidth = {
	minRem: 7.7,
	midVw: 15.5,
	maxRem: 11.8,
};

const MIN_SCALE = 0.35;
const MAX_SCALE = 2.5;

type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

const RESIZE_HANDLES: readonly ResizeHandle[] = [
	'nw',
	'n',
	'ne',
	'e',
	'se',
	's',
	'sw',
	'w',
];

/** Handle direction in degrees (0 = east), before element rotation. */
const HANDLE_ANGLE: Record<ResizeHandle, number> = {
	e: 0,
	se: 45,
	s: 90,
	sw: 135,
	w: 180,
	nw: 225,
	n: 270,
	ne: 315,
};

const CURSOR_BY_OCTANT = [
	'ew-resize',
	'nwse-resize',
	'ns-resize',
	'nesw-resize',
	'ew-resize',
	'nwse-resize',
	'ns-resize',
	'nesw-resize',
] as const;

/**
 * Whether hero polaroid debug mode is active for this page load.
 */
export const isHeroPolaroidDebug = (): boolean => {
	try {
		return new URLSearchParams(window.location.search).has(QUERY_FLAG);
	} catch {
		return false;
	}
};

const parseClamp = (raw: string): ClampWidth | null => {
	const match = raw.match(
		/clamp\(\s*([\d.]+)rem\s*,\s*([\d.]+)vw\s*,\s*([\d.]+)rem\s*\)/i,
	);
	if (!match) return null;
	return {
		minRem: Number(match[1]),
		midVw: Number(match[2]),
		maxRem: Number(match[3]),
	};
};

const formatClamp = (clamp: ClampWidth, scale: number): string => {
	const round1 = (n: number) => Math.round(n * 10) / 10;
	return `clamp(${round1(clamp.minRem * scale)}rem, ${round1(clamp.midVw * scale)}vw, ${round1(clamp.maxRem * scale)}rem)`;
};

const roundPct = (n: number): string => `${Math.round(n * 10) / 10}%`;

const roundRotate = (n: number): number => Math.round(n);

const readPct = (value: string, fallback: number): number => {
	const match = value.trim().match(/^([\d.]+)%$/);
	if (!match) return fallback;
	return Number(match[1]);
};

const gcd = (a: number, b: number): number => {
	let x = Math.abs(a);
	let y = Math.abs(b);
	while (y) {
		const t = y;
		y = x % y;
		x = t;
	}
	return x || 1;
};

/**
 * Reduce natural pixel size to a compact aspect-ratio string.
 */
const formatAspectRatio = (width: number, height: number): string => {
	if (!width || !height) return '5 / 4';
	const divisor = gcd(Math.round(width), Math.round(height));
	const w = Math.round(width / divisor);
	const h = Math.round(height / divisor);
	// Keep ratios readable — fall back to one-decimal floats if huge.
	if (w > 40 || h > 40) {
		const ratio = width / height;
		return `${Math.round(ratio * 10) / 10} / 1`;
	}
	return `${w} / ${h}`;
};

const parseAspectParts = (
	raw: string,
): { readonly w: number; readonly h: number } => {
	const match = raw.match(/([\d.]+)\s*\/\s*([\d.]+)/);
	if (!match) return { w: 5, h: 4 };
	return { w: Number(match[1]) || 5, h: Number(match[2]) || 4 };
};

/**
 * Pick a resize cursor that accounts for the element's rotation.
 */
const cursorForHandle = (handle: ResizeHandle, rotateDeg: number): string => {
	const angle = (((HANDLE_ANGLE[handle] + rotateDeg) % 360) + 360) % 360;
	const octant = Math.round(angle / 45) % 8;
	return CURSOR_BY_OCTANT[octant]!;
};

/**
 * Map viewport delta into the element's local (unrotated) axes.
 */
const toLocalDelta = (
	dx: number,
	dy: number,
	rotateDeg: number,
): { readonly x: number; readonly y: number } => {
	const rad = (rotateDeg * Math.PI) / 180;
	const cos = Math.cos(rad);
	const sin = Math.sin(rad);
	return {
		x: dx * cos + dy * sin,
		y: -dx * sin + dy * cos,
	};
};

/**
 * Serialize current layout as a Hero.astro-ready TypeScript array.
 */
const buildExportSource = (states: readonly DebugState[]): string => {
	const lines = states.map((state) => {
		const width =
			state.baseClamp != null
				? formatClamp(state.baseClamp, state.scale)
				: `${Math.round(((state.baseWidthPx * state.scale) / 16) * 10) / 10}rem`;

		const entry: PolaroidExport = {
			src: state.src,
			alt: state.alt,
			top: roundPct(state.topPct),
			left: roundPct(state.leftPct),
			width,
			aspectRatio: state.aspectRatio,
			rotate: roundRotate(state.rotate),
			z: state.zIndex,
			...(state.mobileShow ? { mobileShow: true } : {}),
		};

		const mobileLine = entry.mobileShow
			? `\n\t\tmobileShow: true,`
			: '';

		return `\t{
\t\tsrc: '${entry.src}',
\t\talt: '${entry.alt.replace(/'/g, "\\'")}',
\t\ttop: '${entry.top}',
\t\tleft: '${entry.left}',
\t\twidth: '${entry.width}',
\t\taspectRatio: '${entry.aspectRatio}',
\t\trotate: ${entry.rotate},
\t\tz: ${entry.z},${mobileLine}
\t}`;
	});

	return `const heroPolaroids: readonly HeroPolaroid[] = [\n${lines.join(',\n')}\n];`;
};

/**
 * Boot the hero polaroid debugger. Call instead of intro / scroll choreography.
 */
export const initHeroPolaroidDebug = (): void => {
	const hero = document.querySelector<HTMLElement>('[data-hero]');
	if (!hero || hero.dataset.polaroidDebugInit === 'true') return;
	hero.dataset.polaroidDebugInit = 'true';
	hero.dataset.heroIntro = 'done';
	hero.dataset.heroDebug = 'true';

	const mount =
		hero.querySelector<HTMLElement>('[data-hero-folder-mid]') ?? hero;

	const previousOverflow = document.documentElement.style.overflow;
	document.documentElement.style.overflow = 'hidden';
	window.scrollTo(0, 0);

	const states: DebugState[] = [];
	let selected: DebugState | null = null;
	let templateEl: HTMLElement | null = null;

	const panel = document.createElement('aside');
	panel.className = 'hero-debug-panel';
	panel.innerHTML = `
		<header class="hero-debug-panel__head" data-debug-drag-handle>
			<strong>Hero polaroid debug</strong>
			<span>Drag to move</span>
		</header>
		<p class="hero-debug-panel__hint">
			Upload saves into <code>public/images/work</code>. Drag to move;
			N/S handles change aspect; E/W change size; Shift+corner frees
			ratio; Alt scales from center. Or set W/H below.
		</p>
		<div class="hero-debug-panel__add">
			<label class="hero-debug-panel__file">
				<span>Upload image</span>
				<input data-debug-file type="file" accept="image/*" multiple />
			</label>
		</div>
		<label class="hero-debug-panel__field">
			<span>Selected</span>
			<select data-debug-select></select>
		</label>
		<label class="hero-debug-panel__field">
			<span>Saved src</span>
			<input data-debug-src type="text" readonly spellcheck="false" />
		</label>
		<label class="hero-debug-panel__field">
			<span>Alt text</span>
			<input data-debug-alt type="text" />
		</label>
		<label class="hero-debug-panel__field">
			<span>Aspect ratio</span>
			<select data-debug-aspect-preset>
				<option value="custom">Custom</option>
				<option value="1 / 1">1 / 1</option>
				<option value="3 / 4">3 / 4</option>
				<option value="4 / 5">4 / 5</option>
				<option value="5 / 4">5 / 4</option>
				<option value="5 / 6">5 / 6</option>
				<option value="16 / 9">16 / 9</option>
				<option value="9 / 16">9 / 16</option>
			</select>
		</label>
		<div class="hero-debug-panel__aspect">
			<label>
				<span>W</span>
				<input data-debug-aspect-w type="number" min="0.1" step="0.1" />
			</label>
			<span class="hero-debug-panel__aspect-sep">/</span>
			<label>
				<span>H</span>
				<input data-debug-aspect-h type="number" min="0.1" step="0.1" />
			</label>
		</div>
		<label class="hero-debug-panel__field">
			<span>Scale <em data-debug-scale-label>100%</em></span>
			<input data-debug-scale type="range" min="35" max="250" step="1" value="100" />
		</label>
		<label class="hero-debug-panel__field">
			<span>Rotate <em data-debug-rotate-label>0°</em></span>
			<input data-debug-rotate type="range" min="-30" max="30" step="1" value="0" />
		</label>
		<label class="hero-debug-panel__check">
			<input data-debug-mobile type="checkbox" />
			<span>Show on mobile</span>
		</label>
		<div class="hero-debug-panel__actions">
			<button type="button" data-debug-remove>Remove selected</button>
		</div>
		<div class="hero-debug-panel__actions">
			<button type="button" data-debug-copy>Copy export</button>
			<button type="button" data-debug-download>Download .ts snippet</button>
		</div>
		<textarea data-debug-out class="hero-debug-panel__out" readonly rows="10"></textarea>
		<p class="hero-debug-panel__status" data-debug-status></p>
	`;
	document.body.append(panel);

	// Drag the panel by its header.
	{
		const handle = panel.querySelector<HTMLElement>('[data-debug-drag-handle]');
		if (handle) {
			let dragging = false;
			let offsetX = 0;
			let offsetY = 0;

			const clampPanel = (left: number, top: number): { left: number; top: number } => {
				const rect = panel.getBoundingClientRect();
				const maxLeft = Math.max(0, window.innerWidth - rect.width);
				const maxTop = Math.max(0, window.innerHeight - rect.height);
				return {
					left: Math.min(maxLeft, Math.max(0, left)),
					top: Math.min(maxTop, Math.max(0, top)),
				};
			};

			handle.addEventListener('pointerdown', (event) => {
				if (event.button !== 0) return;
				event.preventDefault();
				const rect = panel.getBoundingClientRect();
				// Switch from right-anchored CSS to explicit left/top.
				panel.style.right = 'auto';
				panel.style.left = `${rect.left}px`;
				panel.style.top = `${rect.top}px`;
				dragging = true;
				offsetX = event.clientX - rect.left;
				offsetY = event.clientY - rect.top;
				handle.setPointerCapture(event.pointerId);
				panel.dataset.dragging = 'true';
			});

			handle.addEventListener('pointermove', (event) => {
				if (!dragging) return;
				const next = clampPanel(
					event.clientX - offsetX,
					event.clientY - offsetY,
				);
				panel.style.left = `${next.left}px`;
				panel.style.top = `${next.top}px`;
			});

			const endDrag = (event: PointerEvent): void => {
				if (!dragging) return;
				dragging = false;
				delete panel.dataset.dragging;
				try {
					handle.releasePointerCapture(event.pointerId);
				} catch {
					// Already released.
				}
			};

			handle.addEventListener('pointerup', endDrag);
			handle.addEventListener('pointercancel', endDrag);
		}
	}

	const selectEl = panel.querySelector<HTMLSelectElement>('[data-debug-select]')!;
	const srcEl = panel.querySelector<HTMLInputElement>('[data-debug-src]')!;
	const altEl = panel.querySelector<HTMLInputElement>('[data-debug-alt]')!;
	const aspectPresetEl = panel.querySelector<HTMLSelectElement>(
		'[data-debug-aspect-preset]',
	)!;
	const aspectWEl = panel.querySelector<HTMLInputElement>('[data-debug-aspect-w]')!;
	const aspectHEl = panel.querySelector<HTMLInputElement>('[data-debug-aspect-h]')!;
	const scaleEl = panel.querySelector<HTMLInputElement>('[data-debug-scale]')!;
	const rotateEl = panel.querySelector<HTMLInputElement>('[data-debug-rotate]')!;
	const mobileEl = panel.querySelector<HTMLInputElement>('[data-debug-mobile]')!;
	const fileEl = panel.querySelector<HTMLInputElement>('[data-debug-file]')!;
	const scaleLabel = panel.querySelector<HTMLElement>('[data-debug-scale-label]')!;
	const rotateLabel = panel.querySelector<HTMLElement>('[data-debug-rotate-label]')!;
	const outEl = panel.querySelector<HTMLTextAreaElement>('[data-debug-out]')!;
	const statusEl = panel.querySelector<HTMLElement>('[data-debug-status]')!;
	const copyBtn = panel.querySelector<HTMLButtonElement>('[data-debug-copy]')!;
	const downloadBtn = panel.querySelector<HTMLButtonElement>('[data-debug-download]')!;
	const removeBtn = panel.querySelector<HTMLButtonElement>('[data-debug-remove]')!;

	const ASPECT_PRESETS = new Set([
		'1 / 1',
		'3 / 4',
		'4 / 5',
		'5 / 4',
		'5 / 6',
		'16 / 9',
		'9 / 16',
	]);

	/**
	 * Sync aspect preset + W/H fields from the selected card.
	 */
	const syncAspectFields = (state: DebugState | null): void => {
		if (!state) {
			aspectWEl.value = '';
			aspectHEl.value = '';
			aspectPresetEl.value = 'custom';
			return;
		}
		const parts = parseAspectParts(state.aspectRatio);
		aspectWEl.value = String(parts.w);
		aspectHEl.value = String(parts.h);
		const normalized = `${parts.w} / ${parts.h}`;
		aspectPresetEl.value = ASPECT_PRESETS.has(normalized)
			? normalized
			: ASPECT_PRESETS.has(state.aspectRatio)
				? state.aspectRatio
				: 'custom';
	};

	/**
	 * Apply a W/H aspect ratio to the selected polaroid.
	 */
	const commitAspect = (w: number, h: number): void => {
		if (!selected || !(w > 0) || !(h > 0)) return;
		const roundNice = (n: number) =>
			Math.round(n * 100) / 100 === Math.round(n)
				? String(Math.round(n))
				: String(Math.round(n * 100) / 100);
		selected.aspectRatio = `${roundNice(w)} / ${roundNice(h)}`;
		applyState(selected);
		syncAspectFields(selected);
		refreshExport();
	};

	const setStatus = (message: string): void => {
		statusEl.textContent = message;
	};

	const refreshExport = (): void => {
		outEl.value = buildExportSource(states);
	};

	const rebuildSelect = (): void => {
		selectEl.replaceChildren();
		states.forEach((state, index) => {
			const option = document.createElement('option');
			option.value = String(index);
			option.textContent = `${index + 1}. ${state.alt || state.src || 'Untitled'}`;
			selectEl.append(option);
		});
		if (selected) {
			selectEl.value = String(states.indexOf(selected));
		}
	};

	const applyState = (state: DebugState): void => {
		const width =
			state.baseClamp != null
				? formatClamp(state.baseClamp, state.scale)
				: `${(state.baseWidthPx * state.scale) / 16}rem`;

		state.el.style.top = `${state.topPct}%`;
		state.el.style.left = `${state.leftPct}%`;
		state.el.style.width = width;
		state.el.style.zIndex = String(state.zIndex);
		state.el.style.transform = `rotate(${state.rotate}deg)`;
		state.el.dataset.rotate = String(state.rotate);
		state.el.dataset.src = state.src;
		state.el.dataset.alt = state.alt;
		state.el.dataset.aspectRatio = state.aspectRatio;
		state.el.dataset.z = String(state.zIndex);
		state.el.dataset.selected = selected === state ? 'true' : 'false';
		if (state.mobileShow) {
			state.el.dataset.mobileShow = 'true';
		} else {
			delete state.el.dataset.mobileShow;
		}

		const media = state.el.querySelector<HTMLElement>('.polaroid__media');
		if (media) {
			media.style.aspectRatio = state.aspectRatio;
		}
		const img = state.el.querySelector('img');
		if (img) {
			if (img.getAttribute('src') !== state.src) {
				img.src = state.src;
			}
			img.alt = state.alt;
		}

		syncFrame(state);
	};

	/**
	 * Ensure each card has a transform frame; show handles only when selected.
	 */
	const syncFrame = (state: DebugState): void => {
		let frame = state.el.querySelector<HTMLElement>('.hero-debug-frame');
		if (!frame) {
			frame = document.createElement('div');
			frame.className = 'hero-debug-frame';
			frame.setAttribute('aria-hidden', 'true');
			for (const handle of RESIZE_HANDLES) {
				const knob = document.createElement('button');
				knob.type = 'button';
				knob.className = 'hero-debug-handle';
				knob.dataset.handle = handle;
				knob.tabIndex = -1;
				knob.setAttribute('aria-label', `Resize ${handle}`);
				frame.append(knob);
			}
			state.el.append(frame);
			bindResizeHandles(state, frame);
		}

		const active = selected === state;
		frame.hidden = !active;
		frame.dataset.active = active ? 'true' : 'false';

		for (const knob of frame.querySelectorAll<HTMLElement>('[data-handle]')) {
			const handle = knob.dataset.handle as ResizeHandle;
			knob.style.cursor = cursorForHandle(handle, state.rotate);
		}
	};

	const syncPanelFromSelected = (): void => {
		states.forEach(applyState);
		rebuildSelect();
		if (!selected) {
			srcEl.value = '';
			altEl.value = '';
			syncAspectFields(null);
			refreshExport();
			return;
		}
		selectEl.value = String(states.indexOf(selected));
		srcEl.value = selected.src;
		altEl.value = selected.alt;
		syncAspectFields(selected);
		scaleEl.value = String(Math.round(selected.scale * 100));
		rotateEl.value = String(roundRotate(selected.rotate));
		mobileEl.checked = selected.mobileShow;
		scaleLabel.textContent = `${Math.round(selected.scale * 100)}%`;
		rotateLabel.textContent = `${roundRotate(selected.rotate)}°`;
		refreshExport();
	};

	const selectState = (state: DebugState): void => {
		bringToFront(state);
		selected = state;
		syncPanelFromSelected();
	};

	/**
	 * Raise a card above every other polaroid and keep that order for export.
	 */
	const bringToFront = (state: DebugState): void => {
		const maxZ = states.reduce(
			(max, item) => Math.max(max, item.zIndex),
			0,
		);
		if (state.zIndex >= maxZ && states.filter((s) => s.zIndex === maxZ).length === 1) {
			// Already uniquely on top.
			return;
		}
		state.zIndex = maxZ + 1;
		applyState(state);
	};

	/**
	 * Bind move + selection (handles stop propagation for their own gestures).
	 */
	const bindDrag = (state: DebugState): void => {
		let dragging = false;
		let startX = 0;
		let startY = 0;
		let originLeft = 0;
		let originTop = 0;

		state.el.addEventListener('pointerdown', (event) => {
			if (event.button !== 0) return;
			if ((event.target as HTMLElement | null)?.closest?.('[data-handle]')) {
				return;
			}
			event.preventDefault();
			selectState(state);
			dragging = true;
			startX = event.clientX;
			startY = event.clientY;
			originLeft = state.leftPct;
			originTop = state.topPct;
			state.el.style.cursor = 'grabbing';
			state.el.setPointerCapture(event.pointerId);
		});

		state.el.addEventListener('pointermove', (event) => {
			if (!dragging) return;
			const dxPct = ((event.clientX - startX) / window.innerWidth) * 100;
			const dyPct = ((event.clientY - startY) / window.innerHeight) * 100;
			state.leftPct = Math.min(95, Math.max(-5, originLeft + dxPct));
			state.topPct = Math.min(95, Math.max(-5, originTop + dyPct));
			applyState(state);
			refreshExport();
		});

		const endDrag = (event: PointerEvent): void => {
			if (!dragging) return;
			dragging = false;
			state.el.style.cursor = 'grab';
			try {
				state.el.releasePointerCapture(event.pointerId);
			} catch {
				// Already released.
			}
		};

		state.el.addEventListener('pointerup', endDrag);
		state.el.addEventListener('pointercancel', endDrag);
	};

	/**
	 * Corner / edge resize with Figma-like modifiers:
	 * - Corners lock aspect (Shift unlocks → free media ratio)
	 * - Top/bottom edges change media aspect ratio
	 * - Left/right edges change width
	 * - Alt scales from center instead of opposite edge
	 */
	const bindResizeHandles = (state: DebugState, frame: HTMLElement): void => {
		if (frame.dataset.bound === 'true') return;
		frame.dataset.bound = 'true';

		type ResizeSession = {
			handle: ResizeHandle;
			startX: number;
			startY: number;
			startScale: number;
			startLeft: number;
			startTop: number;
			startWidthPx: number;
			startHeightPx: number;
			startMediaW: number;
			startMediaH: number;
			pointerId: number;
		};

		let session: ResizeSession | null = null;

		frame.addEventListener('pointerdown', (event) => {
			const target = event.target as HTMLElement | null;
			const handle = target?.dataset.handle as ResizeHandle | undefined;
			if (!handle || event.button !== 0) return;

			event.preventDefault();
			event.stopPropagation();
			selectState(state);

			const rect = state.el.getBoundingClientRect();
			const media = state.el.querySelector<HTMLElement>('.polaroid__media');
			const mediaRect = media?.getBoundingClientRect();
			session = {
				handle,
				startX: event.clientX,
				startY: event.clientY,
				startScale: state.scale,
				startLeft: state.leftPct,
				startTop: state.topPct,
				startWidthPx: rect.width || 1,
				startHeightPx: rect.height || 1,
				startMediaW: mediaRect?.width || rect.width || 1,
				startMediaH: mediaRect?.height || rect.height || 1,
				pointerId: event.pointerId,
			};
			target.setPointerCapture(event.pointerId);
		});

		frame.addEventListener('pointermove', (event) => {
			if (!session || event.pointerId !== session.pointerId) return;

			const dx = event.clientX - session.startX;
			const dy = event.clientY - session.startY;
			const local = toLocalDelta(dx, dy, state.rotate);
			const handle = session.handle;
			const fromCenter = event.altKey;
			const freeAspect = event.shiftKey;

			const signX = handle.includes('e') ? 1 : handle.includes('w') ? -1 : 0;
			const signY = handle.includes('s') ? 1 : handle.includes('n') ? -1 : 0;
			const isCorner = signX !== 0 && signY !== 0;
			const isHorizontal = signX !== 0 && signY === 0;
			const isVertical = signY !== 0 && signX === 0;

			let nextWidthPx = session.startWidthPx;
			let changedAspect = false;

			if (isCorner && freeAspect) {
				const nextMediaW = Math.max(
					24,
					session.startMediaW + local.x * signX * (fromCenter ? 2 : 1),
				);
				const nextMediaH = Math.max(
					24,
					session.startMediaH + local.y * signY * (fromCenter ? 2 : 1),
				);
				state.aspectRatio = formatAspectRatio(nextMediaW, nextMediaH);
				nextWidthPx =
					session.startWidthPx * (nextMediaW / session.startMediaW);
				changedAspect = true;
			} else if (isCorner) {
				const projected = local.x * signX;
				nextWidthPx =
					session.startWidthPx + projected * (fromCenter ? 2 : 1);
			} else if (isHorizontal) {
				nextWidthPx =
					session.startWidthPx + local.x * signX * (fromCenter ? 2 : 1);
			} else if (isVertical) {
				const nextMediaH = Math.max(
					24,
					session.startMediaH + local.y * signY * (fromCenter ? 2 : 1),
				);
				state.aspectRatio = formatAspectRatio(
					session.startMediaW,
					nextMediaH,
				);
				changedAspect = true;
			}

			nextWidthPx = Math.max(64, nextWidthPx);
			let nextScale =
				session.startScale * (nextWidthPx / session.startWidthPx);
			nextScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, nextScale));
			state.scale = nextScale;

			// Temporarily place at start origin to measure size delta, then anchor.
			state.leftPct = session.startLeft;
			state.topPct = session.startTop;
			applyState(state);

			const newRect = state.el.getBoundingClientRect();
			const widthDeltaPct =
				((newRect.width - session.startWidthPx) / window.innerWidth) * 100;
			const heightDeltaPct =
				((newRect.height - session.startHeightPx) / window.innerHeight) *
				100;

			if (fromCenter) {
				state.leftPct = session.startLeft - widthDeltaPct / 2;
				state.topPct = session.startTop - heightDeltaPct / 2;
			} else {
				state.leftPct =
					signX < 0
						? session.startLeft - widthDeltaPct
						: session.startLeft;
				state.topPct =
					signY < 0 ? session.startTop - heightDeltaPct : session.startTop;
			}

			applyState(state);
			scaleEl.value = String(Math.round(state.scale * 100));
			scaleLabel.textContent = `${Math.round(state.scale * 100)}%`;
			if (changedAspect) {
				syncAspectFields(state);
			}
			refreshExport();
		});

		const endResize = (event: PointerEvent): void => {
			if (!session || event.pointerId !== session.pointerId) return;
			const target = event.target as HTMLElement | null;
			try {
				target?.releasePointerCapture(event.pointerId);
			} catch {
				// Already released.
			}
			session = null;
			syncPanelFromSelected();
		};

		frame.addEventListener('pointerup', endResize);
		frame.addEventListener('pointercancel', endResize);
	};

	/**
	 * Prepare a polaroid root for debug interaction.
	 */
	const prepElement = (el: HTMLElement): void => {
		el.classList.remove('hidden');
		el.classList.add('block', 'hero-polaroid');
		el.style.position = 'fixed';
		el.style.opacity = '1';
		el.style.visibility = 'visible';
		el.style.pointerEvents = 'auto';
		el.style.cursor = 'grab';
		el.style.willChange = 'transform, top, left, width, z-index';
		el.dataset.heroPolaroid = '';
	};

	/**
	 * Build a classic polaroid shell (fallback when no template exists).
	 */
	const buildPolaroidShell = (
		previewSrc: string,
		alt: string,
		aspectRatio: string,
	): HTMLElement => {
		const root = document.createElement('div');
		root.className = 'hero-polaroid block';
		root.innerHTML = `
			<div class="polaroid-wrap inline-block w-full !max-w-none">
				<div class="polaroid relative block w-full bg-white polaroid--classic" style="transform: rotate(0deg); border-radius: 0px;">
					<div class="polaroid__media relative w-full overflow-hidden" style="aspect-ratio: ${aspectRatio}">
						<img src="${previewSrc}" alt="${alt.replace(/"/g, '&quot;')}" class="block size-full object-cover" draggable="false" />
						<div class="pointer-events-none absolute inset-0 shadow-[inset_-1px_-1px_3.5px_0_rgba(0,0,0,0.25)]" aria-hidden="true"></div>
					</div>
					<div class="polaroid__chin" aria-hidden="true"></div>
				</div>
			</div>
		`;
		return root;
	};

	/**
	 * Create a polaroid element by cloning an existing Astro-rendered card
	 * (keeps scoped Polaroid styles) or building a fallback shell.
	 */
	const createPolaroidElement = (
		previewSrc: string,
		alt: string,
		aspectRatio: string,
	): HTMLElement => {
		if (templateEl) {
			const clone = templateEl.cloneNode(true) as HTMLElement;
			clone.querySelector('.hero-debug-frame')?.remove();
			const img = clone.querySelector('img');
			if (img) {
				img.src = previewSrc;
				img.alt = alt;
				img.loading = 'eager';
				img.draggable = false;
			}
			const media = clone.querySelector<HTMLElement>('.polaroid__media');
			if (media) media.style.aspectRatio = aspectRatio;
			return clone;
		}
		return buildPolaroidShell(previewSrc, alt, aspectRatio);
	};

	const registerState = (state: DebugState): void => {
		prepElement(state.el);
		states.push(state);
		bindDrag(state);
		applyState(state);
	};

	const addPolaroid = (options: {
		readonly src: string;
		readonly alt: string;
		readonly aspectRatio: string;
		readonly topPct?: number;
		readonly leftPct?: number;
		readonly rotate?: number;
	}): DebugState => {
		const el = createPolaroidElement(
			options.src,
			options.alt,
			options.aspectRatio,
		);
		mount.append(el);

		const state: DebugState = {
			el,
			src: options.src,
			alt: options.alt,
			aspectRatio: options.aspectRatio,
			mobileShow: false,
			baseClamp: { ...DEFAULT_CLAMP },
			baseWidthPx: 1,
			scale: 1,
			rotate: options.rotate ?? (Math.random() > 0.5 ? 6 : -6),
			topPct: options.topPct ?? 35 + Math.random() * 20,
			leftPct: options.leftPct ?? 30 + Math.random() * 30,
			zIndex:
				states.reduce((max, item) => Math.max(max, item.zIndex), 0) + 1,
		};

		registerState(state);

		// Measure after layout so scale 100% matches DEFAULT_CLAMP on screen.
		requestAnimationFrame(() => {
			const width = formatClamp(DEFAULT_CLAMP, 1);
			el.style.width = width;
			state.baseWidthPx = el.getBoundingClientRect().width || 160;
			applyState(state);
			refreshExport();
		});

		return state;
	};

	// Seed from existing hero polaroids.
	const existing = Array.from(
		hero.querySelectorAll<HTMLElement>('[data-hero-polaroid]'),
	);
	templateEl = existing[0] ?? null;

	for (const el of existing) {
		const style = el.style;
		const widthRaw = style.width || getComputedStyle(el).width;
		const baseClamp = parseClamp(widthRaw);
		const rect = el.getBoundingClientRect();

		registerState({
			el,
			src: el.dataset.src ?? '',
			alt: el.dataset.alt ?? '',
			aspectRatio: el.dataset.aspectRatio ?? '1 / 1',
			mobileShow: el.dataset.mobileShow === 'true',
			baseClamp,
			baseWidthPx: rect.width || 1,
			scale: 1,
			rotate: Number(el.dataset.rotate ?? 0),
			topPct: readPct(style.top, (rect.top / window.innerHeight) * 100),
			leftPct: readPct(style.left, (rect.left / window.innerWidth) * 100),
			zIndex: Number(el.dataset.z ?? states.length + 1),
		});
	}

	selected = states[0] ?? null;
	syncPanelFromSelected();

	selectEl.addEventListener('change', () => {
		const next = states[Number(selectEl.value)];
		if (next) selectState(next);
	});

	altEl.addEventListener('change', () => {
		if (!selected) return;
		selected.alt = altEl.value;
		applyState(selected);
		rebuildSelect();
		refreshExport();
	});

	altEl.addEventListener('keydown', (event) => {
		if (event.key === 'Enter') {
			altEl.blur();
		}
	});

	aspectPresetEl.addEventListener('change', () => {
		if (!selected || aspectPresetEl.value === 'custom') return;
		const parts = parseAspectParts(aspectPresetEl.value);
		commitAspect(parts.w, parts.h);
	});

	const onAspectInput = (): void => {
		commitAspect(Number(aspectWEl.value), Number(aspectHEl.value));
	};

	aspectWEl.addEventListener('change', onAspectInput);
	aspectHEl.addEventListener('change', onAspectInput);
	aspectWEl.addEventListener('keydown', (event) => {
		if (event.key === 'Enter') aspectWEl.blur();
	});
	aspectHEl.addEventListener('keydown', (event) => {
		if (event.key === 'Enter') aspectHEl.blur();
	});

	scaleEl.addEventListener('input', () => {
		if (!selected) return;
		selected.scale = Number(scaleEl.value) / 100;
		scaleLabel.textContent = `${Math.round(selected.scale * 100)}%`;
		applyState(selected);
		refreshExport();
	});

	rotateEl.addEventListener('input', () => {
		if (!selected) return;
		selected.rotate = Number(rotateEl.value);
		rotateLabel.textContent = `${roundRotate(selected.rotate)}°`;
		applyState(selected);
		refreshExport();
	});

	mobileEl.addEventListener('change', () => {
		if (!selected) return;
		selected.mobileShow = mobileEl.checked;
		applyState(selected);
		refreshExport();
	});

	removeBtn.addEventListener('click', () => {
		if (!selected) return;
		const index = states.indexOf(selected);
		if (index < 0) return;
		selected.el.remove();
		states.splice(index, 1);
		selected = states[Math.min(index, states.length - 1)] ?? null;
		syncPanelFromSelected();
		setStatus(selected ? 'Removed polaroid' : 'All polaroids removed');
	});

	/**
	 * Upload a local file into `public/images/work` via the dev API.
	 */
	const uploadToWorkDir = async (
		file: File,
	): Promise<{ src: string; alt: string }> => {
		const body = new FormData();
		body.append('file', file);
		const response = await fetch('/api/hero-debug-upload', {
			method: 'POST',
			body,
		});
		const payload = (await response.json()) as {
			src?: string;
			alt?: string;
			error?: string;
		};
		if (!response.ok || !payload.src) {
			throw new Error(payload.error ?? `Upload failed (${response.status})`);
		}
		return {
			src: payload.src,
			alt: payload.alt ?? file.name,
		};
	};

	fileEl.addEventListener('change', async () => {
		const files = Array.from(fileEl.files ?? []).filter((file) =>
			file.type.startsWith('image/'),
		);
		fileEl.value = '';
		if (files.length === 0) return;

		fileEl.disabled = true;
		setStatus(`Uploading ${files.length} image${files.length > 1 ? 's' : ''}…`);

		let last: DebugState | null = null;
		let saved = 0;

		for (const file of files) {
			try {
				const uploaded = await uploadToWorkDir(file);

				const dims = await new Promise<{ w: number; h: number }>((resolve) => {
					const probe = new Image();
					probe.onload = () =>
						resolve({ w: probe.naturalWidth, h: probe.naturalHeight });
					probe.onerror = () => resolve({ w: 5, h: 4 });
					probe.src = uploaded.src;
				});

				last = addPolaroid({
					src: uploaded.src,
					alt: uploaded.alt,
					aspectRatio: formatAspectRatio(dims.w, dims.h),
				});

				if (!templateEl) {
					templateEl = last.el;
				}
				saved += 1;
			} catch (error) {
				const message =
					error instanceof Error ? error.message : 'Upload failed';
				setStatus(message);
			}
		}

		fileEl.disabled = false;

		if (last) {
			selectState(last);
			setStatus(
				`Saved ${saved} image${saved > 1 ? 's' : ''} to public/images/work — drag to place`,
			);
		}
	});

	copyBtn.addEventListener('click', async () => {
		refreshExport();
		try {
			await navigator.clipboard.writeText(outEl.value);
			setStatus('Copied to clipboard — paste into Hero.astro');
		} catch {
			outEl.select();
			setStatus('Clipboard blocked — select the textarea and copy manually');
		}
	});

	downloadBtn.addEventListener('click', () => {
		refreshExport();
		const blob = new Blob([outEl.value], { type: 'text/plain;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'hero-polaroids-export.ts';
		link.click();
		URL.revokeObjectURL(url);
		setStatus('Downloaded hero-polaroids-export.ts');
	});

	window.addEventListener(
		'beforeunload',
		() => {
			document.documentElement.style.overflow = previousOverflow;
		},
		{ once: true },
	);
};
