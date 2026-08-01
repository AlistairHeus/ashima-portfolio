/**
 * Scroll-driven featured folder stack.
 * Folders rise from below the viewport with their tab labels.
 * A tab becomes clickable only after its folder has landed — and stays clickable.
 */

/** Offset below the viewport used as the enter position for stacking folders. */
const ENTER_VH = 100;

/** Local progress at which a folder counts as landed (tab unlocks). */
const LAND_THRESHOLD = 0.92;

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
	const count = cards.length;
	if (!track || count === 0) return;

	/** Once a folder has landed, its tab stays unlocked for the session. */
	const unlocked = new Array<boolean>(count).fill(false);
	unlocked[0] = true;

	/** Enable/disable a tab hit-target. */
	const setTabEnabled = (index: number, enabled: boolean): void => {
		const tab = tabs[index];
		if (!tab) return;
		tab.disabled = !enabled;
		tab.style.pointerEvents = enabled ? 'auto' : 'none';
		tab.setAttribute('aria-disabled', enabled ? 'false' : 'true');
		tab.tabIndex = enabled ? 0 : -1;
	};

	/** Sync tab aria-selected and card aria-hidden to the active index. */
	const setActive = (activeIndex: number): void => {
		tabs.forEach((tab, index) => {
			tab.setAttribute(
				'aria-selected',
				index === activeIndex ? 'true' : 'false',
			);
		});
		cards.forEach((card, index) => {
			card.setAttribute(
				'aria-hidden',
				index <= activeIndex ? 'false' : 'true',
			);
		});
	};

	/**
	 * Map 0–1 track progress → folder transforms.
	 * Folder 1 stays put; folders 2–4 each rise from below the viewport.
	 */
	const applyProgress = (progress: number): void => {
		const stackCount = Math.max(1, count - 1);

		cards.forEach((card, index) => {
			if (index === 0) {
				card.style.transform = 'translate3d(0, 0, 0)';
				return;
			}

			const start = (index - 1) / stackCount;
			const end = index / stackCount;
			const local = Math.min(
				1,
				Math.max(0, (progress - start) / (end - start || 1)),
			);
			const yVh = ENTER_VH * (1 - local);
			card.style.transform = `translate3d(0, ${yVh}vh, 0)`;

			if (local >= LAND_THRESHOLD && !unlocked[index]) {
				unlocked[index] = true;
				setTabEnabled(index, true);
			}
		});

		// Keep already-landed tabs enabled (including after scrolling back up).
		unlocked.forEach((isUnlocked, index) => {
			if (isUnlocked) setTabEnabled(index, true);
		});

		let activeIndex = 0;
		for (let i = 1; i < count; i += 1) {
			const start = (i - 1) / stackCount;
			const end = i / stackCount;
			const local = (progress - start) / (end - start || 1);
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

	const onScroll = (): void => {
		applyProgress(getProgress());
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
			progress = index / stackCount;
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
