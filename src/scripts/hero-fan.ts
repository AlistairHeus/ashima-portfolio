/**
 * Home-v2 polaroid fan — Osmo radial-marquee sizes.
 * Card is 18.125em on their fluid em scale; orbit radius is 4.5× card height
 * (`--y: 500%` with origin at the card center).
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

	const count = cardList.length;
	const step = TWO_PI / count;
	const motionQuery = window.matchMedia(DESKTOP_MOTION_QUERY);
	const lastHidden = new Uint8Array(count);
	const lastZ = new Int16Array(count);
	lastHidden.fill(255);
	lastZ.fill(-1);

	let angleOffset = 0;
	let frame = 0;
	let last = performance.now();
	let looping = false;
	let inView = false;
	let originX = 0;
	let originY = 0;
	let radius = 1;

	const canAnimate = (): boolean =>
		inView && motionQuery.matches && document.visibilityState === 'visible';

	/**
	 * Cache orbit geometry. Call on init and resize only — not per frame.
	 */
	const measure = (): void => {
		const cardHeight = Math.max(cardList[0]?.offsetHeight ?? 0, 1);
		radius = cardHeight * RADIUS_FROM_HEIGHT;
		originX = root.clientWidth / 2;
		originY = cardHeight + 12 + radius;
	};

	/**
	 * Place cards with compositor-only transforms.
	 */
	const layout = (offset: number): void => {
		for (let index = 0; index < count; index++) {
			const card = cardList[index];
			if (!card) continue;

			const angle = offset + index * step;
			const x = originX + Math.sin(angle) * radius;
			const y = originY - Math.cos(angle) * radius;
			const tilt = (angle * 180) / Math.PI;
			const depth = Math.cos(angle);
			const hidden = depth < HIDDEN_DEPTH;
			const z = Math.round(40 + depth * 40);

			card.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -100%) rotate(${tilt}deg)`;

			if (z !== lastZ[index]) {
				lastZ[index] = z;
				card.style.zIndex = String(z);
			}

			if (lastHidden[index] !== (hidden ? 1 : 0)) {
				lastHidden[index] = hidden ? 1 : 0;
				card.style.visibility = hidden ? 'hidden' : 'visible';
				card.style.opacity = hidden ? '0' : '1';
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
		angleOffset += dt * 0.1;
		layout(angleOffset);
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
		if (canAnimate()) startLoop();
		else stopLoop();
	};

	const onResize = (): void => {
		measure();
		layout(angleOffset);
	};

	measure();
	layout(0);

	window.addEventListener('resize', onResize, { passive: true });
	document.addEventListener('visibilitychange', syncLoop);
	motionQuery.addEventListener('change', syncLoop);

	const io = new IntersectionObserver(
		(entries) => {
			inView = entries.some((entry) => entry.isIntersecting);
			syncLoop();
		},
		{ threshold: 0.05 },
	);
	io.observe(root);

	root.addEventListener(
		'hero-fan-dispose',
		() => {
			stopLoop();
			window.removeEventListener('resize', onResize);
			document.removeEventListener('visibilitychange', syncLoop);
			motionQuery.removeEventListener('change', syncLoop);
			io.disconnect();
		},
		{ once: true },
	);
};
