/**
 * Home-v2 polaroid fan — Osmo radial-marquee sizes, then a scroll morph
 * into a ring of the unique polaroids around the About work CTA.
 * The hero duplicates the set for a dense marquee; those copies fade out
 * as the uniques spread to even spacing.
 *
 * Card is 18.125em on their fluid em scale; hero orbit radius is 4.5× card
 * height (`--y: 500%` with origin at the card center). On desktop the fan
 * is hoisted to a viewport overlay so it can follow the CTA while shrinking.
 */
const CARD_SELECTOR = '[data-hero-fan-card]';

const TWO_PI = Math.PI * 2;
/** Matches Osmo `--y: 500%` minus the 50% center → 450% of height. */
const RADIUS_FROM_HEIGHT = 4.5;
/** Same gate as the rest of the site: native layout below `lg`. */
const DESKTOP_MOTION_QUERY =
	'(min-width: 1024px) and (prefers-reduced-motion: no-preference)';
const HIDDEN_DEPTH = -0.05;
const SPIN_CLASS = 'is-spinning';
const OVERLAY_CLASS = 'is-overlay';
const SLOT_ACTIVE_CLASS = 'is-active';
/** Polaroid scale once the fan has settled around the work button. */
const RING_SCALE = 0.32;
/** Extra pixels beyond the CTA radius so ticks stay clear. */
const RING_GAP_PX = 28;
/** `about.top / viewportHeight` where the morph begins. */
const MORPH_START = 0.9;
/** `about.top / viewportHeight` where the ring is fully formed. */
const MORPH_END = 0.06;
const HERO_SPIN = 0.1;
const RING_SPIN = 0.075;

/**
 * Clamp `value` to `[0, 1]`.
 */
const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

/**
 * Linear interpolate from `from` to `to` by `t`.
 */
const lerp = (from: number, to: number, t: number): number =>
	from + (to - from) * t;

/**
 * Smoothstep ease in `[0, 1]`.
 */
const smoothstep = (t: number): number => t * t * (3 - 2 * t);

/**
 * Drive the circular fan on `[data-hero-fan]`.
 */
export const initHeroFan = (): void => {
	const root = document.querySelector<HTMLElement>('[data-hero-fan]');
	if (!root || root.dataset.heroFanInit === 'true') return;
	root.dataset.heroFanInit = 'true';

	const cardList = Array.from(
		root.querySelectorAll<HTMLElement>(CARD_SELECTOR),
	);
	if (cardList.length === 0) return;

	const slot = document.querySelector<HTMLElement>('[data-hero-fan-slot]');
	const about = document.querySelector<HTMLElement>('[data-about-v2]');
	const cta = document.querySelector<HTMLElement>('[data-about-cta]');
	const page = document.querySelector<HTMLElement>('.home-v2-page');
	const hero = document.querySelector<HTMLElement>('[data-hero]');

	const count = cardList.length;
	const uniqueAttr = Number(root.dataset.heroFanUnique);
	const uniqueCount =
		Number.isFinite(uniqueAttr) && uniqueAttr > 0 && uniqueAttr <= count
			? Math.floor(uniqueAttr)
			: count;
	const heroStep = TWO_PI / count;
	const ringStep = TWO_PI / uniqueCount;
	const motionQuery = window.matchMedia(DESKTOP_MOTION_QUERY);
	const lastHidden = new Uint8Array(count);
	const lastZ = new Int16Array(count);
	const lastOpacity = new Float32Array(count);
	lastHidden.fill(255);
	lastZ.fill(-1);
	lastOpacity.fill(-1);

	let angleOffset = 0;
	let frame = 0;
	let last = performance.now();
	let looping = false;
	let heroInView = true;
	let aboutInView = false;
	let overlay = false;
	let cardHeight = 1;
	let originX = 0;
	let originY = 0;
	let radius = 1;

	const sectionInView = (): boolean => heroInView || aboutInView;

	const canAnimate = (): boolean =>
		sectionInView() &&
		motionQuery.matches &&
		document.visibilityState === 'visible';

	/**
	 * Hoist the fan to a viewport overlay, or restore it to the hero.
	 */
	const applyOverlay = (enabled: boolean): void => {
		if (enabled === overlay) return;
		overlay = enabled;
		if (enabled) {
			page?.appendChild(root);
			root.classList.add(OVERLAY_CLASS);
			slot?.classList.add(SLOT_ACTIVE_CLASS);
			return;
		}

		if (slot) slot.after(root);
		root.classList.remove(OVERLAY_CLASS);
		slot?.classList.remove(SLOT_ACTIVE_CLASS);
		root.style.visibility = '';
	};

	/**
	 * Overlay only when the desktop motion gate matches and the About CTA exists.
	 */
	const syncOverlay = (): void => {
		applyOverlay(Boolean(motionQuery.matches && page && slot && cta));
	};

	/**
	 * Cache card size and the in-flow hero orbit. Call on init and resize.
	 */
	const measure = (): void => {
		cardHeight = Math.max(cardList[0]?.offsetHeight ?? 0, 1);
		radius = cardHeight * RADIUS_FROM_HEIGHT;
		originX = root.clientWidth / 2;
		originY = cardHeight + 12 + radius;
	};

	/**
	 * Scroll progress from the hero arc (0) to the CTA ring (1).
	 */
	const readProgress = (): number => {
		if (!overlay || !about) return 0;
		const viewportHeight = window.innerHeight || 1;
		const aboutTop = about.getBoundingClientRect().top / viewportHeight;
		const span = MORPH_START - MORPH_END;
		return smoothstep(clamp01((MORPH_START - aboutTop) / Math.max(span, 0.001)));
	};

	/**
	 * Place cards with compositor-only transforms.
	 */
	const layout = (offset: number, progress: number): void => {
		let layoutOriginX = originX;
		let layoutOriginY = originY;
		let layoutRadius = radius;
		let scale = 1;
		let hideCutoff = HIDDEN_DEPTH;

		if (overlay && slot && cta) {
			const slotRect = slot.getBoundingClientRect();
			const heroRadius = cardHeight * RADIUS_FROM_HEIGHT;
			const heroOriginX = slotRect.left + slotRect.width / 2;
			const heroOriginY = slotRect.top + cardHeight + 12 + heroRadius;

			const ctaRect = cta.getBoundingClientRect();
			const ringRadius = ctaRect.width / 2 + RING_GAP_PX;
			const ringOriginX = ctaRect.left + ctaRect.width / 2;
			const ringOriginY = ctaRect.top + ctaRect.height / 2;

			layoutOriginX = lerp(heroOriginX, ringOriginX, progress);
			layoutOriginY = lerp(heroOriginY, ringOriginY, progress);
			layoutRadius = lerp(heroRadius, ringRadius, progress);
			scale = lerp(1, RING_SCALE, progress);
			hideCutoff = lerp(HIDDEN_DEPTH, -1.05, progress);
		}

		for (let index = 0; index < count; index++) {
			const card = cardList[index];
			if (!card) continue;

			const uniqueIndex = index % uniqueCount;
			const isDuplicate = index >= uniqueCount;
			const heroAngle = offset + index * heroStep;
			const ringAngle = offset + uniqueIndex * ringStep;
			const angle = isDuplicate
				? heroAngle
				: lerp(heroAngle, ringAngle, progress);
			const x = layoutOriginX + Math.sin(angle) * layoutRadius;
			const y = layoutOriginY - Math.cos(angle) * layoutRadius;
			const tilt = (angle * 180) / Math.PI;
			const depth = Math.cos(angle);
			const z = Math.round(40 + depth * 40);
			const depthFade = clamp01((depth - hideCutoff) / 0.16);
			const fade = isDuplicate ? depthFade * (1 - progress) : depthFade;
			const opacity = Math.round(fade * 100) / 100;
			const hidden = opacity < 0.02;

			card.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -100%) rotate(${tilt}deg) scale(${scale})`;

			if (z !== lastZ[index]) {
				lastZ[index] = z;
				card.style.zIndex = String(z);
			}

			if (opacity !== lastOpacity[index]) {
				lastOpacity[index] = opacity;
				card.style.opacity = String(opacity);
			}

			if (lastHidden[index] !== (hidden ? 1 : 0)) {
				lastHidden[index] = hidden ? 1 : 0;
				card.style.visibility = hidden ? 'hidden' : 'visible';
			}
		}
	};

	const stopLoop = (): void => {
		looping = false;
		root.classList.remove(SPIN_CLASS);
		if (frame !== 0) {
			window.cancelAnimationFrame(frame);
			frame = 0;
		}
	};

	const tick = (now: number): void => {
		if (!looping) return;
		if (!canAnimate()) {
			stopLoop();
			return;
		}

		const dt = Math.min(0.05, (now - last) / 1000);
		last = now;
		const progress = readProgress();
		angleOffset += dt * lerp(HERO_SPIN, RING_SPIN, progress);
		layout(angleOffset, progress);
		frame = window.requestAnimationFrame(tick);
	};

	const startLoop = (): void => {
		if (looping || !canAnimate()) return;
		looping = true;
		last = performance.now();
		root.classList.add(SPIN_CLASS);
		frame = window.requestAnimationFrame(tick);
	};

	const syncLoop = (): void => {
		if (overlay) {
			root.style.visibility = sectionInView() ? 'visible' : 'hidden';
		}
		if (canAnimate()) startLoop();
		else stopLoop();
	};

	const onResize = (): void => {
		syncOverlay();
		measure();
		layout(angleOffset, readProgress());
		syncLoop();
	};

	syncOverlay();
	measure();
	layout(0, readProgress());

	window.addEventListener('resize', onResize, { passive: true });
	document.addEventListener('visibilitychange', syncLoop);
	motionQuery.addEventListener('change', onResize);

	const io = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.target === hero || entry.target === slot) {
					heroInView = entry.isIntersecting;
				}
				if (entry.target === about) {
					aboutInView = entry.isIntersecting;
				}
			}
			syncLoop();
		},
		{ threshold: 0.05 },
	);
	if (hero) io.observe(hero);
	else io.observe(root);
	if (about) io.observe(about);
	syncLoop();

	const firstCard = cardList[0];
	const resizeObserver =
		firstCard !== undefined
			? new ResizeObserver(() => {
					measure();
					layout(angleOffset, readProgress());
				})
			: null;
	if (firstCard) resizeObserver?.observe(firstCard);

	root.addEventListener(
		'hero-fan-dispose',
		() => {
			stopLoop();
			applyOverlay(false);
			window.removeEventListener('resize', onResize);
			document.removeEventListener('visibilitychange', syncLoop);
			motionQuery.removeEventListener('change', onResize);
			io.disconnect();
			resizeObserver?.disconnect();
		},
		{ once: true },
	);
};
