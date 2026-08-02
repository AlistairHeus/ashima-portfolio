/**
 * Other-projects polaroid stack.
 * Hovering / focusing a list item promotes that project's polaroid to the front
 * and lightly shuffles the cards underneath.
 */

interface StackSlot {
	readonly rotate: number;
	readonly left: string;
	readonly top: string;
	readonly width: string;
}

/**
 * Apply a slot's layout to a polaroid wrapper.
 */
const applySlot = (
	card: HTMLElement,
	slot: StackSlot,
	zIndex: number,
): void => {
	card.style.left = slot.left;
	card.style.top = slot.top;
	card.style.width = slot.width;
	card.style.zIndex = String(zIndex);
	card.style.setProperty('--polaroid-rotate', `${slot.rotate}deg`);
};

/**
 * Mild Fisher–Yates shuffle (mutates and returns the array).
 */
const shuffleInPlace = <T>(items: T[]): T[] => {
	for (let i = items.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1));
		const a = items[i]!;
		const b = items[j]!;
		items[i] = b;
		items[j] = a;
	}
	return items;
};

/**
 * Put `activeId` on top; shuffle the remaining order for a stack reshuffle.
 */
const promoteAndShuffle = (
	order: readonly string[],
	activeId: string,
): string[] => {
	const rest = order.filter((id) => id !== activeId);
	shuffleInPlace(rest);
	return [...rest, activeId];
};

/**
 * Initialize the other-projects hover stack on the page.
 */
export const initOtherProjectsStack = (): void => {
	const root = document.querySelector<HTMLElement>('[data-other-projects]');
	if (!root || root.dataset.otherProjectsInit === 'true') return;
	root.dataset.otherProjectsInit = 'true';

	const items = Array.from(
		root.querySelectorAll<HTMLElement>('[data-other-project-id]'),
	).filter((el) => el.tagName === 'LI');
	const stack = root.querySelector<HTMLElement>('[data-other-projects-stack]');
	const cards = Array.from(
		root.querySelectorAll<HTMLElement>('[data-other-polaroid]'),
	);
	if (!stack || cards.length === 0 || items.length === 0) return;

	const slotsJson = stack.dataset.stackSlots;
	if (!slotsJson) return;

	let slots: StackSlot[];
	try {
		slots = JSON.parse(slotsJson) as StackSlot[];
	} catch {
		return;
	}
	if (slots.length === 0) return;

	const cardById = new Map(
		cards.map((card) => [card.dataset.otherPolaroid ?? '', card]),
	);

	/** Bottom → top project ids (last is front of stack). */
	let order = cards
		.map((card) => card.dataset.otherPolaroid ?? '')
		.filter(Boolean);

	const layoutFromOrder = (nextOrder: readonly string[]): void => {
		order = [...nextOrder];
		order.forEach((id, depth) => {
			const card = cardById.get(id);
			const slot = slots[Math.min(depth, slots.length - 1)];
			if (!card || !slot) return;
			applySlot(card, slot, depth + 1);
			card.dataset.active = depth === order.length - 1 ? 'true' : 'false';
		});
	};

	const activate = (projectId: string): void => {
		if (!cardById.has(projectId)) return;
		layoutFromOrder(promoteAndShuffle(order, projectId));

		items.forEach((item) => {
			item.dataset.active =
				item.dataset.otherProjectId === projectId ? 'true' : 'false';
		});
	};

	const clearActive = (): void => {
		items.forEach((item) => {
			item.dataset.active = 'false';
		});
	};

	items.forEach((item) => {
		const projectId = item.dataset.otherProjectId;
		if (!projectId) return;

		item.addEventListener('mouseenter', () => activate(projectId));
		item.addEventListener('focusin', () => activate(projectId));
		item.addEventListener('mouseleave', clearActive);
		item.addEventListener('focusout', (event) => {
			const next = event.relatedTarget;
			if (next instanceof Node && item.contains(next)) return;
			clearActive();
		});
	});

	// Initial layout: catalogue order, last card on top.
	layoutFromOrder(order);
};
