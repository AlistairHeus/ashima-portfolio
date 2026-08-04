/**
 * Hero entry animation — name cascade, subtitle settle, polaroid scatter-in.
 * Hands off to scroll polaroids + magnetic name once complete.
 */
import gsap from 'gsap';

export type HeroIntroComplete = () => void;

/** Matches the magnetic name interaction weight range. */
const WEIGHT_MIN = 100;
const WEIGHT_MAX = 700;

/**
 * Freeze each glyph's advance at bold width (same as magnetic hover).
 * Keeps intro letter-spacing identical to the post-intro resting layout.
 */
const lockCharWidths = (
	root: HTMLElement,
	chars: readonly HTMLElement[],
): void => {
	for (const el of chars) {
		el.style.fontWeight = String(WEIGHT_MAX);
		el.style.fontVariationSettings = `'wght' ${WEIGHT_MAX}`;
	}
	void root.offsetWidth;
	for (const el of chars) {
		el.style.width = `${el.getBoundingClientRect().width}px`;
	}
	for (const el of chars) {
		el.style.fontWeight = String(WEIGHT_MIN);
		el.style.fontVariationSettings = `'wght' ${WEIGHT_MIN}`;
	}
};

/**
 * Play the home-hero intro, then invoke `onComplete`.
 * Honors prefers-reduced-motion (skips to the resting state).
 */
export const initHeroIntro = (onComplete?: HeroIntroComplete): void => {
	const hero = document.querySelector<HTMLElement>('[data-hero]');
	if (!hero || hero.dataset.heroIntroInit === 'true') {
		onComplete?.();
		return;
	}
	hero.dataset.heroIntroInit = 'true';

	const finish = (): void => {
		hero.dataset.heroIntro = 'done';
		hero.dispatchEvent(new CustomEvent('herointrodone', { bubbles: true }));
		onComplete?.();
	};

	const prefersReduced = window.matchMedia(
		'(prefers-reduced-motion: reduce)',
	).matches;

	const nameRoot = hero.querySelector<HTMLElement>('#hero-heading');
	const chars = Array.from(
		hero.querySelectorAll<HTMLElement>('[data-hero-char]'),
	);
	const subtitles = Array.from(
		hero.querySelectorAll<HTMLElement>(
			'.hero-subtitle-text, .hero-mobile-subtitle',
		),
	);
	const polaroids = Array.from(
		hero.querySelectorAll<HTMLElement>('[data-hero-polaroid]'),
	).filter((el) => {
		if (window.matchMedia('(min-width: 768px)').matches) return true;
		return el.dataset.mobileShow === 'true';
	});

	// Match magnetic layout before any motion so spacing never jumps at handoff.
	if (nameRoot && chars.length > 0) {
		lockCharWidths(nameRoot, chars);
	}

	if (prefersReduced) {
		gsap.set(chars, { opacity: 1, y: 0, clearProps: 'transform' });
		gsap.set(subtitles, { opacity: 1, x: 0, y: 0 });
		gsap.set(polaroids, { opacity: 1, scale: 1, y: 0 });
		finish();
		return;
	}

	hero.dataset.heroIntro = 'running';

	const desktopSubtitles = Array.from(
		hero.querySelectorAll<HTMLElement>('.hero-subtitle-text'),
	);
	const mobileSubtitles = Array.from(
		hero.querySelectorAll<HTMLElement>('.hero-mobile-subtitle'),
	);

	gsap.set(chars, { opacity: 0, y: '0.4em' });
	gsap.set(desktopSubtitles, {
		opacity: 0,
		x: (i) => (i === 0 ? -28 : 28),
	});
	gsap.set(mobileSubtitles, { opacity: 0, y: 12 });

	polaroids.forEach((el) => {
		const rotate = Number(el.dataset.rotate ?? 0);
		gsap.set(el, {
			opacity: 0,
			scale: 0.82,
			y: 36,
			rotation: rotate * 1.55,
			transformOrigin: '50% 50%',
		});
	});

	const tl = gsap.timeline({
		defaults: { ease: 'power3.out' },
		onComplete: finish,
	});

	// Name first — brand is the hero signal.
	tl.to(chars, {
		opacity: 1,
		y: 0,
		duration: 0.72,
		stagger: { each: 0.028, from: 'start' },
		ease: 'power3.out',
	});

	if (desktopSubtitles.length > 0) {
		tl.to(
			desktopSubtitles,
			{
				opacity: 1,
				x: 0,
				duration: 0.65,
				stagger: 0.08,
				ease: 'power2.out',
			},
			0.32,
		);
	}

	if (mobileSubtitles.length > 0) {
		tl.to(
			mobileSubtitles,
			{
				opacity: 1,
				y: 0,
				duration: 0.55,
				stagger: 0.06,
				ease: 'power2.out',
			},
			0.28,
		);
	}

	if (polaroids.length > 0) {
		tl.to(
			polaroids,
			{
				opacity: 1,
				scale: 1,
				y: 0,
				rotation: (_i, el) => Number((el as HTMLElement).dataset.rotate ?? 0),
				duration: 0.85,
				stagger: { each: 0.055, from: 'random' },
				ease: 'power3.out',
			},
			0.42,
		);
	}
};
