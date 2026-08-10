/**
 * Hero polaroid → folder scroll choreography (GSAP + ScrollTrigger).
 *
 * Polaroids are DOM children between folder back and front flap (ProjectFolder
 * layering). They use position:fixed for viewport scatter; the folder wrapper
 * must not use CSS transform so fixed positioning stays viewport-relative.
 *
 * Every card gathers above the folder mouth, then drops into the pocket —
 * no side-entry paths through the folder silhouette.
 *
 * Mid-swallow, absolute "stuff" cards pop up from inside the pocket so the
 * folder reads as populated (peeking under the flap) before chrome fades out.
 *
 * Spacer is 200svh: first half = swallow, second half = Featured covers.
 *
 * Perf: desktop flies at most 6 cards (markup-capped). Spent flyers use
 * autoAlpha so opacity 0 also sets visibility:hidden (drops compositor layers).
 * Scrub reverse restores visibility automatically.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Scale as cards settle into the pocket under the flap. */
const FLY_SCALE = 0.2;

/**
 * Per-card deltas so every polaroid enters the pocket from above the mouth
 * (never through the left/right edges of the folder).
 */
interface CardTarget {
	readonly el: HTMLElement;
	/** Rise / clear altitude — mostly vertical, slight inward pull. */
	readonly liftX: number;
	readonly liftY: number;
	/** Centered just above the folder opening. */
	readonly gatherX: number;
	readonly gatherY: number;
	/** Final pocket rest. */
	readonly x: number;
	readonly y: number;
	/** True when the card starts above the mouth (skip the rise beat). */
	readonly startsAbove: boolean;
	readonly rotate: number;
}

type NavigatorWithHints = Navigator & {
	readonly deviceMemory?: number;
	readonly connection?: { readonly saveData?: boolean };
};

/**
 * Heuristic for devices that struggle with many scrubbed layers + filters.
 * Kept conservative so mid-range laptops keep the full desktop choreography.
 */
const prefersLiteMotion = (): boolean => {
	const nav = navigator as NavigatorWithHints;
	if (nav.connection?.saveData) return true;
	if (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 2) {
		return true;
	}
	if (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 2) {
		return true;
	}
	return false;
};

/**
 * Initialize polaroid scatter → pocket animation.
 */
export const initHeroPolaroids = (): void => {
	const hero = document.querySelector<HTMLElement>('[data-hero]');
	const spacer = document.querySelector<HTMLElement>('[data-hero-spacer]');
	const folder = hero?.querySelector<HTMLElement>('[data-hero-folder]');
	const folderBack = hero?.querySelector<HTMLElement>('[data-hero-folder-back]');
	const folderFlap = hero?.querySelector<HTMLElement>('[data-hero-folder-flap]');
	const pocket = hero?.querySelector<HTMLElement>('[data-hero-folder-pocket]');

	if (!hero || !spacer || !folder || !folderBack || !folderFlap || !pocket) {
		return;
	}
	if (hero.dataset.polaroidsInit === 'true') return;
	hero.dataset.polaroidsInit = 'true';

	const prefersReduced = window.matchMedia(
		'(prefers-reduced-motion: reduce)',
	).matches;
	const lite = prefersLiteMotion();

	const allPolaroids = Array.from(
		hero.querySelectorAll<HTMLElement>('[data-hero-polaroid]'),
	);
	const stuffCards = Array.from(
		hero.querySelectorAll<HTMLElement>('[data-hero-stuff]'),
	);

	const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;

	const visiblePolaroids = () =>
		allPolaroids.filter((el) => {
			// Lite / mobile: keep the curated mobile set so fewer layers scrub.
			if (lite || !isDesktop()) return el.dataset.mobileShow === 'true';
			return true;
		});

	const folderChrome = [folderBack, folderFlap];

	if (prefersReduced) {
		gsap.set(folderChrome, { autoAlpha: 0 });
		gsap.set(stuffCards, { autoAlpha: 0 });
		return;
	}

	let timeline: gsap.core.Timeline | null = null;
	let resizeTimer = 0;

	const measureTargets = (cards: HTMLElement[]): CardTarget[] => {
		for (const el of cards) {
			const rotate = Number(el.dataset.rotate ?? 0);
			gsap.set(el, {
				x: 0,
				y: 0,
				scale: 1,
				rotation: rotate,
				autoAlpha: 1,
			});
		}

		// Measure against the risen folder — cards swallow once it has settled.
		gsap.set(folder, { bottom: '5%' });

		const pocketRect = pocket.getBoundingClientRect();
		const flapRect = folderFlap.getBoundingClientRect();
		const folderRect = folder.getBoundingClientRect();

		const targetX = pocketRect.left + pocketRect.width * 0.5;
		const targetY = pocketRect.top + pocketRect.height * 0.5;
		const mouthX = folderRect.left + folderRect.width * 0.5;
		// Clear the opening lip so paths stay above the silhouette, then drop in.
		const aboveY = flapRect.top - Math.min(36, folderRect.height * 0.1);

		gsap.set(folder, { bottom: '-18%' });

		return cards.map((el, i) => {
			const rect = el.getBoundingClientRect();
			const cx = rect.left + rect.width * 0.5;
			const cy = rect.top + rect.height * 0.5;
			const spread = ((i % 5) - 2) * (folderRect.width * 0.055);
			const gatherX = mouthX + spread - cx;
			const gatherY = aboveY - cy;
			const sinkX = targetX + spread * 0.25 - cx;
			const sinkY = targetY - cy;

			return {
				el,
				liftX: gatherX * 0.18,
				liftY: gatherY,
				gatherX,
				gatherY,
				x: sinkX,
				y: sinkY,
				startsAbove: cy < aboveY,
				rotate: Number(el.dataset.rotate ?? 0),
			};
		});
	};

	const build = () => {
		timeline?.scrollTrigger?.kill();
		timeline?.kill();

		const cards = visiblePolaroids();
		const hide = allPolaroids.filter((el) => !cards.includes(el));

		// autoAlpha:0 → opacity 0 + visibility:hidden (out of compositor).
		gsap.set(hide, { autoAlpha: 0 });
		gsap.set(cards, { autoAlpha: 1 });
		gsap.set(folderChrome, { autoAlpha: 0 });
		// Rise via `bottom` (not transform) so fixed polaroids stay viewport-pinned.
		gsap.set(folder, { bottom: '-18%' });

		// Stuff starts tucked under the flap — pops up mid-swallow.
		for (const el of stuffCards) {
			const rotate = Number(el.dataset.rotate ?? 0);
			gsap.set(el, {
				autoAlpha: 0,
				yPercent: 55,
				scale: 0.92,
				rotation: rotate * 0.35,
				transformOrigin: '50% 100%',
			});
		}

		if (cards.length === 0) return;

		const targets = measureTargets(cards);

		timeline = gsap.timeline({
			scrollTrigger: {
				trigger: spacer,
				start: 'top top',
				end: '50% top',
				// Short scrub = less trailing lag on slower devices.
				scrub: lite ? true : 0.25,
				onToggle: (self) => {
					hero.classList.toggle('is-animating', self.isActive);
				},
			},
		});

		timeline.to(
			folder,
			{
				bottom: '5%',
				duration: 0.14,
				ease: 'power2.out',
			},
			0,
		);

		timeline.to(
			folderChrome,
			{
				autoAlpha: 1,
				duration: 0.14,
				ease: 'power2.out',
			},
			0,
		);

		targets.forEach((target, i) => {
			const stagger = 0.14 + i * 0.05;
			const tip = (i % 2 === 0 ? -8 : 8) * 0.45;
			const settle = (i % 2 === 0 ? -6 : 6) * 0.4;

			// Ensure layer is live before flight (handles scrub reverse from hidden).
			timeline!.set(target.el, { autoAlpha: 1 }, stagger);

			// Path: clear above the mouth → center over the opening → drop in.
			// Never skim the left/right edges of the folder silhouette.
			if (target.startsAbove) {
				// Stay high while centering, then settle over the mouth.
				timeline!.to(
					target.el,
					{
						x: target.gatherX,
						y: target.gatherY * 0.2,
						scale: FLY_SCALE * 1.5,
						rotation: tip,
						autoAlpha: 1,
						duration: 0.22,
						ease: 'power2.in',
					},
					stagger,
				);
				timeline!.to(
					target.el,
					{
						x: target.gatherX,
						y: target.gatherY,
						scale: FLY_SCALE * 1.35,
						rotation: tip * 0.7,
						duration: 0.12,
						ease: 'power1.in',
					},
					stagger + 0.2,
				);
			} else {
				// Rise first (mostly vertical), then slide over the mouth.
				timeline!.to(
					target.el,
					{
						x: target.liftX,
						y: target.liftY,
						scale: FLY_SCALE * 1.6,
						rotation: tip,
						autoAlpha: 1,
						duration: 0.22,
						ease: 'power2.in',
					},
					stagger,
				);
				timeline!.to(
					target.el,
					{
						x: target.gatherX,
						y: target.gatherY,
						scale: FLY_SCALE * 1.35,
						rotation: tip * 0.7,
						duration: 0.14,
						ease: 'power1.inOut',
					},
					stagger + 0.2,
				);
			}

			const dropAt = stagger + 0.34;
			timeline!.to(
				target.el,
				{
					x: target.x,
					y: target.y,
					scale: FLY_SCALE,
					rotation: settle,
					duration: 0.18,
					ease: 'power2.in',
				},
				dropAt,
			);
			// Finish under the flap — autoAlpha hides the layer once spent.
			timeline!.to(
				target.el,
				{
					scale: FLY_SCALE * 0.5,
					y: target.y + 12,
					autoAlpha: 0,
					duration: 0.14,
					ease: 'power1.in',
				},
				dropAt + 0.16,
			);
		});

		// Populate: cards rise from inside the pocket while flyers are mid-drop.
		// Lite devices skip pocket stuff to cut animated layer count.
		if (!lite) {
			stuffCards.forEach((el, i) => {
				const rotate = Number(el.dataset.rotate ?? 0);
				const popAt = 0.32 + i * 0.055;
				timeline!.to(
					el,
					{
						autoAlpha: 1,
						yPercent: 0,
						scale: 1,
						rotation: rotate,
						duration: 0.28,
						ease: 'power2.out',
					},
					popAt,
				);
			});
		} else {
			gsap.set(stuffCards, { autoAlpha: 0 });
		}

		// Keep folder + stuffed cards fully opaque; Featured covers them on scroll.
		timeline.to(
			folder,
			{
				bottom: '2%',
				duration: 0.2,
				ease: 'power1.in',
			},
			0.95,
		);
	};

	const boot = () => {
		build();
		ScrollTrigger.refresh();
	};

	const images = Array.from(hero.querySelectorAll('img'));
	const imageReady = Promise.all(
		images.map((img) =>
			img.complete
				? Promise.resolve()
				: new Promise<void>((resolve) => {
						img.addEventListener('load', () => resolve(), { once: true });
						img.addEventListener('error', () => resolve(), { once: true });
					}),
		),
	);

	void Promise.all([
		document.fonts?.ready ?? Promise.resolve(),
		imageReady,
	]).then(boot);

	window.addEventListener(
		'resize',
		() => {
			window.clearTimeout(resizeTimer);
			resizeTimer = window.setTimeout(() => {
				build();
				ScrollTrigger.refresh();
			}, 150);
		},
		{ passive: true },
	);
};
