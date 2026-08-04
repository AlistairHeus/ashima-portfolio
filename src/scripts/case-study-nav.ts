/**
 * Case study footer carousel — two visible projects; arrows rotate circularly.
 * Folder links navigate; arrow buttons only advance the window.
 */

interface NavProject {
	readonly id: string;
	readonly number: string;
	readonly title: string;
	readonly description: string;
	readonly imageSrc: string;
	readonly imageAlt: string;
	readonly chips: readonly string[];
	readonly href?: string;
}

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

	const link = folderWrap.querySelector('a.project-folder, .project-folder');
	if (link instanceof HTMLAnchorElement) {
		link.href = project.href ?? '/work';
		link.setAttribute('aria-label', project.title);
	}

	const photo = folderWrap.querySelector('.project-folder__photo img');
	if (photo instanceof HTMLImageElement) {
		photo.src = project.imageSrc;
		photo.alt = project.imageAlt;
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

	const render = (): void => {
		const left = projects[offset % count];
		const right = projects[(offset + 1) % count];
		if (!left || !right) return;
		paintSlot(root, 0, left);
		paintSlot(root, 1, right);
	};

	const step = (delta: number): void => {
		offset = (offset + delta + count) % count;
		render();
	};

	root.querySelectorAll<HTMLButtonElement>('[data-nav-dir]').forEach((button) => {
		button.addEventListener('click', () => {
			const dir = Number(button.dataset.navDir);
			if (!Number.isFinite(dir) || dir === 0) return;
			step(dir);
		});
	});
};
