/**
 * Work page entry — section headings settle, then project cards cascade in.
 */
import gsap from 'gsap';

/**
 * Play the /work page intro. Honors prefers-reduced-motion.
 */
export const initWorkIntro = (): void => {
	const root = document.querySelector<HTMLElement>('[data-work-page]');
	if (!root || root.dataset.workIntroInit === 'true') return;
	root.dataset.workIntroInit = 'true';

	const finish = (): void => {
		root.dataset.workIntro = 'done';
	};

	const prefersReduced = window.matchMedia(
		'(prefers-reduced-motion: reduce)',
	).matches;

	const headings = Array.from(
		root.querySelectorAll<HTMLElement>('[data-work-intro="heading"]'),
	);
	const cards = Array.from(
		root.querySelectorAll<HTMLElement>('[data-work-intro="card"]'),
	);

	if (prefersReduced) {
		gsap.set([...headings, ...cards], {
			opacity: 1,
			y: 0,
			clearProps: 'transform',
		});
		finish();
		return;
	}

	root.dataset.workIntro = 'running';

	gsap.set(headings, { opacity: 0, y: 18 });
	gsap.set(cards, { opacity: 0, y: 28 });

	const tl = gsap.timeline({
		defaults: { ease: 'power3.out' },
		onComplete: finish,
	});

	if (headings[0]) {
		tl.to(headings[0], { opacity: 1, y: 0, duration: 0.65 }, 0);
	}

	const firstSectionCards = cards.filter((card) => {
		const section = card.closest('section');
		return section === root.querySelector('section');
	});
	const restCards = cards.filter((card) => !firstSectionCards.includes(card));

	if (firstSectionCards.length > 0) {
		tl.to(
			firstSectionCards,
			{
				opacity: 1,
				y: 0,
				duration: 0.7,
				stagger: { each: 0.08, from: 'start' },
				ease: 'power3.out',
			},
			0.18,
		);
	}

	if (headings[1]) {
		tl.to(headings[1], { opacity: 1, y: 0, duration: 0.6 }, '-=0.35');
	}

	if (restCards.length > 0) {
		tl.to(
			restCards,
			{
				opacity: 1,
				y: 0,
				duration: 0.65,
				stagger: { each: 0.07, from: 'start' },
				ease: 'power3.out',
			},
			'-=0.4',
		);
	}
};
