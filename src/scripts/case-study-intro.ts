/**
 * Case study landing entry — number → meta → title cascade → media → overview.
 * Hands off to magnetic title once the letter cascade can rest.
 */
import gsap from 'gsap';
import { lockMagneticCharWidths } from './magnetic-type';

export type CaseStudyIntroComplete = () => void;

/** Regular-rest magnetic range used on case study titles (400 → 100). */
const WEIGHT_REST = 400;
const WEIGHT_PEAK = 100;

/**
 * Play the case-study landing intro, then invoke `onComplete`.
 * Honors prefers-reduced-motion (skips to the resting state).
 */
export const initCaseStudyIntro = (
	onComplete?: CaseStudyIntroComplete,
): void => {
	const root = document.querySelector<HTMLElement>('[data-case-study-landing]');
	if (!root || root.dataset.caseStudyIntroInit === 'true') {
		onComplete?.();
		return;
	}
	root.dataset.caseStudyIntroInit = 'true';

	const finish = (): void => {
		root.dataset.caseStudyIntro = 'done';
		root.dispatchEvent(
			new CustomEvent('casestudyintrodone', { bubbles: true }),
		);
		onComplete?.();
	};

	const prefersReduced = window.matchMedia(
		'(prefers-reduced-motion: reduce)',
	).matches;

	const number = root.querySelector<HTMLElement>('[data-cs-intro="number"]');
	const category = root.querySelector<HTMLElement>(
		'[data-cs-intro="category"]',
	);
	const client = root.querySelector<HTMLElement>('[data-cs-intro="client"]');
	const titleRoot = root.querySelector<HTMLElement>('#case-study-title');
	const chars = Array.from(
		root.querySelectorAll<HTMLElement>(
			'#case-study-title [data-magnetic-char]',
		),
	);
	const media = root.querySelector<HTMLElement>('[data-cs-intro="media"]');
	const overview = root.querySelector<HTMLElement>(
		'[data-cs-intro="overview"]',
	);

	if (titleRoot && chars.length > 0) {
		lockMagneticCharWidths(titleRoot, chars, WEIGHT_REST, WEIGHT_PEAK);
	}

	const meta = [number, category, client].filter(
		(el): el is HTMLElement => el instanceof HTMLElement,
	);
	const blocks = [media, overview].filter(
		(el): el is HTMLElement => el instanceof HTMLElement,
	);

	if (prefersReduced) {
		gsap.set(chars, { opacity: 1, y: 0, clearProps: 'transform' });
		gsap.set(meta, { opacity: 1, y: 0 });
		gsap.set(blocks, { opacity: 1, y: 0, scale: 1 });
		finish();
		return;
	}

	root.dataset.caseStudyIntro = 'running';

	if (number) gsap.set(number, { opacity: 0, y: 16 });
	if (category) gsap.set(category, { opacity: 0, y: 12 });
	if (client) gsap.set(client, { opacity: 0, y: 10 });
	if (chars.length > 0) gsap.set(chars, { opacity: 0, y: '0.35em' });
	if (media) gsap.set(media, { opacity: 0, y: 36, scale: 0.985 });
	if (overview) gsap.set(overview, { opacity: 0, y: 24 });

	const tl = gsap.timeline({
		defaults: { ease: 'power3.out' },
		onComplete: finish,
	});

	if (number) {
		tl.to(number, { opacity: 1, y: 0, duration: 0.55 }, 0);
	}

	if (category) {
		tl.to(category, { opacity: 1, y: 0, duration: 0.55 }, 0.12);
	}

	if (chars.length > 0) {
		tl.to(
			chars,
			{
				opacity: 1,
				y: 0,
				duration: 0.7,
				stagger: { each: 0.018, from: 'start' },
				ease: 'power3.out',
			},
			0.22,
		);
	}

	if (client) {
		tl.to(client, { opacity: 1, y: 0, duration: 0.5 }, 0.45);
	}

	if (media) {
		tl.to(
			media,
			{
				opacity: 1,
				y: 0,
				scale: 1,
				duration: 0.85,
				ease: 'power3.out',
			},
			0.38,
		);
	}

	if (overview) {
		tl.to(
			overview,
			{ opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' },
			0.7,
		);
	}
};
