/**
 * Case study footer carousel — two visible projects; arrows rotate circularly.
 * Folder links navigate; arrow buttons only advance the window.
 * Advances animate with a directional slide (GSAP).
 */
import gsap from 'gsap';

interface NavProject {
	readonly id: string;
	readonly number: string;
	readonly title: string;
	readonly description: string;
	readonly imageSrc: string;
	readonly imageAlt: string;
	readonly chips: readonly string[];
	readonly href?: string;
	readonly accentColor?: string;
	/** Pre-resolved URL used when swapping folder photos client-side. */
	readonly carouselImageSrc?: string;
}

/** Slide distance in px for exit / enter. */
const SLIDE_PX = 48;

/**
 * Apply project accent CSS vars on a folder root (hover recolor).
 */
const paintAccent = (folderRoot: HTMLElement, accentColor?: string): void => {
	if (accentColor) {
		folderRoot.style.setProperty('--pf-accent', accentColor);
		folderRoot.dataset.hasAccent = 'true';
		return;
	}
	folderRoot.style.removeProperty('--pf-accent');
	delete folderRoot.dataset.hasAccent;
};

/**
 * Fill one carousel slot (folder + copy) from project data.
 */
const paintSlot = (
	root: HTMLElement,
	slotIndex: 0 | 1,
	project: NavProject,
): void => {
	const folderWrap = root.querySelector(`[data-nav-slot="${slotIndex}"]`);
	const copy = root.querySelector(`[data-nav-copy="${slotIndex}"]`);
	if (!(folderWrap instanceof HTMLElement) || !(copy instanceof HTMLElement)) {
		return;
	}

	const folderRoot = folderWrap.querySelector('[data-project-folder]');
	if (folderRoot instanceof HTMLElement) {
		paintAccent(folderRoot, project.accentColor);
	}

	const link = folderWrap.querySelector('a.project-folder, .project-folder');
	if (link instanceof HTMLAnchorElement) {
		link.href = project.href ?? '/work';
		link.setAttribute('aria-label', project.title);
	}

	/**
	 * Astro `<Picture>` keeps `<source srcset>` that win over `img.src`.
	 * Strip sources + srcset so the browser actually shows the new project image.
	 */
	const photoRoot = folderWrap.querySelector('.project-folder__photo');
	if (photoRoot instanceof HTMLElement) {
		photoRoot.querySelectorAll('picture source').forEach((source) => {
			source.remove();
		});
		const photo = photoRoot.querySelector('img');
		if (photo instanceof HTMLImageElement) {
			photo.removeAttribute('srcset');
			photo.removeAttribute('sizes');
			photo.src = project.carouselImageSrc ?? project.imageSrc;
			photo.alt = project.imageAlt;
		}
	}

	const title = copy.querySelector('[data-nav-title]');
	if (title) title.textContent = project.title;

	const description = copy.querySelector('[data-nav-description]');
	if (description) description.textContent = project.description;

	const chips = copy.querySelector('[data-nav-chips]');
	if (chips) {
		chips.replaceChildren(
			...project.chips.map((label) => {
				const span = document.createElement('span');
				span.className =
					'type-chip inline-flex items-center justify-center rounded-lg border border-outline px-4 py-1.5 text-on-surface-variant';
				span.textContent = label;
				return span;
			}),
		);
	}
};

/**
 * Collect folder + copy panels for both carousel columns.
 */
const getPanels = (root: HTMLElement): HTMLElement[] =>
	[0, 1].flatMap((slotIndex) => {
		const folder = root.querySelector(`[data-nav-slot="${slotIndex}"]`);
		const copy = root.querySelector(`[data-nav-copy="${slotIndex}"]`);
		const panels: HTMLElement[] = [];
		if (folder instanceof HTMLElement) panels.push(folder);
		if (copy instanceof HTMLElement) panels.push(copy);
		return panels;
	});

/**
 * Initialize the case-study footer carousel on the page.
 */
export const initCaseStudyNav = (): void => {
	const root = document.querySelector<HTMLElement>('[data-case-study-nav]');
	if (!root || root.dataset.navInit === 'true') return;
	root.dataset.navInit = 'true';

	let projects: NavProject[] = [];
	try {
		projects = JSON.parse(root.dataset.navProjects ?? '[]') as NavProject[];
	} catch {
		return;
	}

	const count = projects.length;
	if (count < 2) return;

	/** Start on [previous, next] of the current page (see getCaseStudyNavProjects order). */
	const parsedOffset = Number.parseInt(root.dataset.navOffset ?? '', 10);
	let offset = Number.isFinite(parsedOffset) ? parsedOffset : count - 1;
	offset = ((offset % count) + count) % count;

	const buttons = Array.from(
		root.querySelectorAll<HTMLButtonElement>('[data-nav-dir]'),
	);
	let animating = false;

	const setButtonsDisabled = (disabled: boolean): void => {
		buttons.forEach((button) => {
			button.disabled = disabled;
		});
	};

	const render = (): void => {
		const left = projects[offset % count];
		const right = projects[(offset + 1) % count];
		if (!left || !right) return;
		paintSlot(root, 0, left);
		paintSlot(root, 1, right);
	};

	const prefersReducedMotion = (): boolean =>
		window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	/**
	 * Advance the window. Positive delta slides content left (next);
	 * negative slides right (prev).
	 */
	const step = (delta: number): void => {
		if (animating || delta === 0) return;

		offset = (offset + delta + count) % count;

		if (prefersReducedMotion()) {
			render();
			return;
		}

		const panels = getPanels(root);
		if (panels.length === 0) {
			render();
			return;
		}

		animating = true;
		setButtonsDisabled(true);

		const exitX = delta > 0 ? -SLIDE_PX : SLIDE_PX;
		const enterX = delta > 0 ? SLIDE_PX : -SLIDE_PX;

		const tl = gsap.timeline({
			onComplete: () => {
				gsap.set(panels, { clearProps: 'transform' });
				animating = false;
				setButtonsDisabled(false);
			},
		});

		tl.to(panels, {
			x: exitX,
			opacity: 0,
			duration: 0.28,
			ease: 'power2.in',
			stagger: 0.03,
		});
		tl.add(() => {
			render();
			gsap.set(panels, { x: enterX, opacity: 0 });
		});
		tl.to(panels, {
			x: 0,
			opacity: 1,
			duration: 0.4,
			ease: 'power3.out',
			stagger: 0.04,
		});
	};

	buttons.forEach((button) => {
		button.addEventListener('click', () => {
			const dir = Number(button.dataset.navDir);
			if (!Number.isFinite(dir) || dir === 0) return;
			step(dir);
		});
	});
};
