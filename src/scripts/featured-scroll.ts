/**
 * Scroll-driven featured folder stack.
 * Folders rise from below the viewport with their tab labels.
 * A tab becomes clickable only after its folder has landed — and stays clickable.
 * Covered folders switch to neutral beige once the next reaches ~2/3 of the page.
 */

/** Offset below the viewport used as the enter position for stacking folders. */
const ENTER_VH = 100;

/** Local progress at which a folder counts as landed (tab unlocks). */
const LAND_THRESHOLD = 0.92;

/** Local progress at which covered folders fade to neutral beige (~2/3 up the page). */
const INACTIVE_THRESHOLD = 2 / 3;

/**
 * Fraction of the sticky track used for folder stacking.
 * Remainder is a short dwell so the last folder can rest before unpinning
 * (without a long empty scroll).
 */
const STACK_END = 0.88;

/**
 * Initialize the featured case-studies scroll stack on the page.
 */
export const initFeaturedScroll = (): void => {
	const root = document.querySelector<HTMLElement>('[data-featured]');
	if (!root || root.dataset.featuredInit === 'true') return;
	root.dataset.featuredInit = 'true';

	const track = root.querySelector<HTMLElement>('[data-featured-track]');
	const cards = Array.from(
		root.querySelectorAll<HTMLElement>('[data-featured-card]'),
	);
	const tabs = Array.from(
		root.querySelectorAll<HTMLButtonElement>('[data-featured-tab]'),
	);
	const links = Array.from(
		root.querySelectorAll<HTMLAnchorElement>('[data-featured-link]'),
	);
	const scrollHint = root.querySelector<HTMLElement>(
		'[data-featured-scroll-hint]',
	);
	const otherProjects = document.querySelector<HTMLElement>(
		'[data-other-projects]',
	);
	const count = cards.length;
	if (!track || count === 0) return;

	/** Once a folder has landed, its tab stays unlocked for the session. */
	const unlocked = new Array<boolean>(count).fill(false);
	unlocked[0] = true;

	/** Cache last applied transform / inactive / active to skip redundant writes. */
	const lastY = new Array<number>(count).fill(Number.NaN);
	const lastInactive = new Array<boolean>(count).fill(false);
	let lastActive = -1;
	let lastHintHidden: boolean | null = null;
	let rafId = 0;
	let needsUpdate = false;

	/** Enable/disable a tab hit-target. */
	const setTabEnabled = (index: number, enabled: boolean): void => {
		const tab = tabs[index];
		if (!tab) return;
		tab.disabled = !enabled;
		tab.style.pointerEvents = enabled ? 'auto' : 'none';
		tab.setAttribute('aria-disabled', enabled ? 'false' : 'true');
		tab.tabIndex = enabled ? 0 : -1;
	};

	/** Sync tab aria-selected, card aria-hidden, and case-study link focus. */
	const setActive = (activeIndex: number): void => {
		if (activeIndex === lastActive) return;
		lastActive = activeIndex;

		tabs.forEach((tab, index) => {
			tab.setAttribute(
				'aria-selected',
				index === activeIndex ? 'true' : 'false',
			);
		});
		cards.forEach((card, index) => {
			card.setAttribute(
				'aria-hidden',
				index === activeIndex ? 'false' : 'true',
			);
		});
		links.forEach((link, index) => {
			const isActive = index === activeIndex;
			link.tabIndex = isActive ? 0 : -1;
			link.setAttribute('aria-hidden', isActive ? 'false' : 'true');
			link.style.pointerEvents = isActive ? 'auto' : 'none';
		});
	};

	/**
	 * Local 0–1 progress for folder `index` (folder 0 is always settled).
	 * Stacking is compressed into 0..STACK_END of the track so the last
	 * folder lands before the sticky section releases.
	 */
	const localProgress = (
		progress: number,
		index: number,
		stackCount: number,
	): number => {
		if (index === 0) return 1;
		const stacked = Math.min(1, progress / STACK_END);
		const start = (index - 1) / stackCount;
		const end = index / stackCount;
		return Math.min(1, Math.max(0, (stacked - start) / (end - start || 1)));
	};

	/**
	 * Map 0–1 track progress → folder transforms + inactive chrome.
	 * Folder 1 stays put; folders 2–4 each rise from below the viewport.
	 * Covered folders fade to beige once the next one reaches ~2/3 of the page.
	 */
	const applyProgress = (progress: number): void => {
		const stackCount = Math.max(1, count - 1);

		/** Highest folder past the inactive threshold — keeps brand; below it go neutral. */
		let topIndex = 0;

		cards.forEach((card, index) => {
			const local = localProgress(progress, index, stackCount);

			if (index === 0) {
				if (lastY[index] !== 0) {
					card.style.transform = 'translate3d(0, 0, 0)';
					lastY[index] = 0;
				}
			} else {
				const yVh = ENTER_VH * (1 - local);
				// Quantize to 0.1vh so we skip tiny floating-point churn.
				const quantized = Math.round(yVh * 10) / 10;
				if (lastY[index] !== quantized) {
					card.style.transform = `translate3d(0, ${quantized}vh, 0)`;
					lastY[index] = quantized;
				}

				if (local >= LAND_THRESHOLD && !unlocked[index]) {
					unlocked[index] = true;
					setTabEnabled(index, true);
				}
			}

			if (local >= INACTIVE_THRESHOLD) topIndex = index;
		});

		// Covered folders → neutral ProjectFolder beige; rising/top keep band gradient.
		cards.forEach((card, index) => {
			const inactive = index < topIndex;
			if (lastInactive[index] === inactive) return;
			lastInactive[index] = inactive;
			card.dataset.inactive = inactive ? 'true' : 'false';
		});

		// Keep already-landed tabs enabled (including after scrolling back up).
		unlocked.forEach((isUnlocked, index) => {
			if (isUnlocked) setTabEnabled(index, true);
		});

		let activeIndex = 0;
		for (let i = 1; i < count; i += 1) {
			const local = localProgress(progress, i, stackCount);
			if (local >= 0.5) activeIndex = i;
		}
		setActive(activeIndex);
	};

	/** Progress through the sticky track (0 at pin start, 1 at pin end). */
	const getProgress = (): number => {
		const rect = track.getBoundingClientRect();
		const scrollable = track.offsetHeight - window.innerHeight;
		if (scrollable <= 0) return 0;
		return Math.min(1, Math.max(0, -rect.top / scrollable));
	};

	/**
	 * Fade the scroll cue once Other Projects enters the viewport
	 * (or the featured track has fully played out). Restores on scroll back.
	 */
	const updateScrollHint = (): void => {
		if (!scrollHint) return;
		const pastTrack = getProgress() >= 0.98;
		const otherEntering = otherProjects
			? otherProjects.getBoundingClientRect().top < window.innerHeight * 0.92
			: pastTrack;
		const shouldHide = pastTrack || otherEntering;
		if (lastHintHidden === shouldHide) return;
		lastHintHidden = shouldHide;
		scrollHint.dataset.hidden = shouldHide ? 'true' : 'false';
	};

	const flush = (): void => {
		rafId = 0;
		if (!needsUpdate) return;
		needsUpdate = false;
		applyProgress(getProgress());
		updateScrollHint();
	};

	const onScroll = (): void => {
		needsUpdate = true;
		if (rafId !== 0) return;
		rafId = window.requestAnimationFrame(flush);
	};

	/** Jump scroll so folder `index` is fully stacked. */
	const scrollToIndex = (index: number): void => {
		if (!unlocked[index]) return;

		const rect = track.getBoundingClientRect();
		const trackTop = window.scrollY + rect.top;
		const scrollable = Math.max(0, track.offsetHeight - window.innerHeight);

		let progress = 0;
		if (index > 0) {
			const stackCount = Math.max(1, count - 1);
			// Land inside the stacking window, not at the absolute track end.
			progress = STACK_END * (index / stackCount);
		}

		window.scrollTo({
			top: trackTop + scrollable * Math.min(1, Math.max(0, progress)),
			behavior: 'smooth',
		});
	};

	window.addEventListener('scroll', onScroll, { passive: true });
	window.addEventListener('resize', onScroll, { passive: true });

	tabs.forEach((tab) => {
		tab.addEventListener('click', (event) => {
			event.preventDefault();
			const index = Number(tab.dataset.featuredTabIndex);
			if (Number.isNaN(index) || !unlocked[index]) return;
			scrollToIndex(index);
		});
	});

	// Folder 1 starts unlocked; others wait until they land.
	tabs.forEach((_, index) => setTabEnabled(index, unlocked[index]));
	onScroll();
};
