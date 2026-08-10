/**
 * Hero entry animation — name cascade, subtitle settle, polaroid scatter-in.
 * Hands off to scroll polaroids + magnetic name once complete.
 */
import gsap from 'gsap';
import { lockMagneticCharWidths } from './magnetic-type';

export type HeroIntroComplete = () => void;

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
		hero.classList.remove('is-animating');
		hero.dataset.heroIntro = 'done';
		hero.dispatchEvent(new CustomEvent('herointrodone', { bubbles: true }));
		onComplete?.();
	};

	const prefersReduced = window.matchMedia(
		'(prefers-reduced-motion: reduce)',
	).matches;

	const nameRoot = hero.querySelector<HTMLElement>('#hero-heading');
	const chars = Array.from(
		hero.querySelectorAll<HTMLElement>('[data-magnetic-char]'),
	);
	const subtitle = hero.querySelector<HTMLElement>('.hero-subtitle');
	const polaroids = Array.from(
		hero.querySelectorAll<HTMLElement>('[data-hero-polaroid]'),
	).filter((el) => {
		if (window.matchMedia('(min-width: 768px)').matches) return true;
		return el.dataset.mobileShow === 'true';
	});

	// Match magnetic layout before any motion so spacing never jumps at handoff.
	if (nameRoot && chars.length > 0) {
		lockMagneticCharWidths(nameRoot, chars);
	}

	if (prefersReduced) {
		gsap.set(chars, { opacity: 1, y: 0, clearProps: 'transform' });
		if (subtitle) gsap.set(subtitle, { opacity: 1, y: 0 });
		gsap.set(polaroids, { autoAlpha: 1, scale: 1, y: 0 });
		finish();
		return;
	}

	hero.dataset.heroIntro = 'running';
	hero.classList.add('is-animating');

	gsap.set(chars, { opacity: 0, y: '0.4em' });
	if (subtitle) gsap.set(subtitle, { opacity: 0, y: 12 });

	polaroids.forEach((el) => {
		const rotate = Number(el.dataset.rotate ?? 0);
		gsap.set(el, {
			autoAlpha: 0,
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
	tl.to(
		chars,
		{
			opacity: 1,
			y: 0,
			duration: 0.78,
			stagger: { each: 0.022, from: 'start' },
			ease: 'power2.out',
		},
		0,
	);

	if (subtitle) {
		tl.to(
			subtitle,
			{
				opacity: 1,
				y: 0,
				duration: 0.55,
				ease: 'power2.out',
			},
			0.28,
		);
	}

	if (polaroids.length > 0) {
		tl.to(
			polaroids,
			{
				autoAlpha: 1,
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
