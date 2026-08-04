/**
 * Dev-only folder gradient debugger for FeaturedCaseStudies.
 * Live-tunes CSS custom properties on `[data-folder-gradient-root]` and
 * exports a paste-ready CSS snippet (copy + download).
 */

/** Tunable gradient controls keyed to CSS custom properties. */
interface GradientState {
	readonly angle: number;
	readonly inactive: string;
	readonly bMix1: number;
	readonly bWith1: string;
	readonly bP1: number;
	readonly bMix2: number;
	readonly bWith2: string;
	readonly bP2: number;
	readonly strokeMix: number;
}

const DEFAULTS: GradientState = {
	angle: 180.6,
	inactive: '#f7f1ec',
	bMix1: 100,
	bWith1: '#7a5c45',
	bP1: -9,
	bMix2: 49,
	bWith2: '#ffffff',
	bP2: 74,
	strokeMix: 32,
};

/** Accent fallbacks used inside color-mix() when a card has no --featured-accent. */
const ACCENT_FALLBACK_1 = '#ddc3ae';
const ACCENT_FALLBACK_2 = '#f3eae3';

/** Bumped when shape of saved state changes so stale localStorage is ignored. */
const STORAGE_KEY = 'ashima-folder-gradient-debug-v2';

const pct = (n: number): string => `${n}%`;
const deg = (n: number): string => `${n}deg`;

/**
 * Applies live CSS custom properties to the featured section root.
 */
const applyState = (root: HTMLElement, state: GradientState): void => {
	root.style.setProperty('--fg-angle', deg(state.angle));
	root.style.setProperty('--fg-inactive', state.inactive);
	root.style.setProperty('--fg-b-mix1', pct(state.bMix1));
	root.style.setProperty('--fg-b-with1', state.bWith1);
	root.style.setProperty('--fg-b-p1', pct(state.bP1));
	root.style.setProperty('--fg-b-mix2', pct(state.bMix2));
	root.style.setProperty('--fg-b-with2', state.bWith2);
	root.style.setProperty('--fg-b-p2', pct(state.bP2));
	root.style.setProperty('--fg-stroke-mix', pct(state.strokeMix));
};

/**
 * Builds the paste-ready CSS block matching FeaturedCaseStudies.astro structure.
 */
const buildCssSnippet = (state: GradientState): string => {
	return `.featured__folder-neutral {
	background: ${state.inactive};
	filter: drop-shadow(1px 0 3.75px rgb(0 0 0 / 0.25));
}

.featured__folder-brand {
	background-image: linear-gradient(
		${deg(state.angle)},
		color-mix(in srgb, var(--featured-accent, ${ACCENT_FALLBACK_1}) ${pct(state.bMix1)}, ${state.bWith1}) ${pct(state.bP1)},
		color-mix(in srgb, var(--featured-accent, ${ACCENT_FALLBACK_2}) ${pct(state.bMix2)}, ${state.bWith2}) ${pct(state.bP2)}
	);
	--featured-stroke: color-mix(
		in srgb,
		var(--featured-outline, var(--featured-accent)) ${pct(state.strokeMix)},
		black
	);
	filter:
		drop-shadow(0 2px 0 var(--featured-stroke))
		drop-shadow(0 -2px 0 var(--featured-stroke))
		drop-shadow(2px 0 0 var(--featured-stroke))
		drop-shadow(-2px 0 0 var(--featured-stroke))
		drop-shadow(1px 1px 0 var(--featured-stroke))
		drop-shadow(-1px -1px 0 var(--featured-stroke))
		drop-shadow(1px -1px 0 var(--featured-stroke))
		drop-shadow(-1px 1px 0 var(--featured-stroke));
	transition: opacity 0.45s ease;
}`;
};

/**
 * Builds the CSS-variable defaults block for the section `style` attribute.
 */
const buildVarsSnippet = (state: GradientState): string => {
	return `--fg-angle: ${deg(state.angle)};
--fg-inactive: ${state.inactive};
--fg-b-mix1: ${pct(state.bMix1)};
--fg-b-with1: ${state.bWith1};
--fg-b-p1: ${pct(state.bP1)};
--fg-b-mix2: ${pct(state.bMix2)};
--fg-b-with2: ${state.bWith2};
--fg-b-p2: ${pct(state.bP2)};
--fg-stroke-mix: ${pct(state.strokeMix)};`;
};

const loadState = (): GradientState => {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return { ...DEFAULTS };
		const parsed = JSON.parse(raw) as Partial<GradientState>;
		return { ...DEFAULTS, ...parsed };
	} catch {
		return { ...DEFAULTS };
	}
};

const saveState = (state: GradientState): void => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const downloadText = (filename: string, text: string): void => {
	const blob = new Blob([text], { type: 'text/css;charset=utf-8' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
};

/**
 * Initializes the floating folder-gradient debug panel (dev only).
 */
export const initFolderGradientDebug = (): void => {
	const root = document.querySelector<HTMLElement>('[data-folder-gradient-root]');
	const panel = document.querySelector<HTMLElement>('[data-folder-gradient-debug]');
	if (!root || !panel) return;

	let state = loadState();
	applyState(root, state);

	const $ = <T extends HTMLElement>(sel: string): T | null =>
		panel.querySelector<T>(sel);

	const syncInputs = (): void => {
		const setNum = (name: string, value: number) => {
			const el = $<HTMLInputElement>(`[data-fg="${name}"]`);
			if (el) el.value = String(value);
			const label = $<HTMLElement>(`[data-fg-val="${name}"]`);
			if (label) label.textContent = String(value);
		};
		const setColor = (name: string, value: string) => {
			const el = $<HTMLInputElement>(`[data-fg="${name}"]`);
			if (el) el.value = value;
			const hex = $<HTMLInputElement>(`[data-fg-hex="${name}"]`);
			if (hex) hex.value = value;
		};

		setNum('angle', state.angle);
		setColor('inactive', state.inactive);
		setNum('bMix1', state.bMix1);
		setColor('bWith1', state.bWith1);
		setNum('bP1', state.bP1);
		setNum('bMix2', state.bMix2);
		setColor('bWith2', state.bWith2);
		setNum('bP2', state.bP2);
		setNum('strokeMix', state.strokeMix);
	};

	const commit = (next: GradientState): void => {
		state = next;
		applyState(root, state);
		saveState(state);
		syncInputs();
		const preview = $<HTMLPreElement>('[data-fg-preview]');
		if (preview) preview.textContent = buildCssSnippet(state);
	};

	const patch = (partial: Partial<GradientState>): void => {
		commit({ ...state, ...partial });
	};

	panel.querySelectorAll<HTMLInputElement>('[data-fg]').forEach((input) => {
		const key = input.dataset.fg as keyof GradientState | undefined;
		if (!key) return;

		const handler = () => {
			if (input.type === 'color') {
				patch({ [key]: input.value } as Partial<GradientState>);
				return;
			}
			const num = Number(input.value);
			if (Number.isNaN(num)) return;
			patch({ [key]: num } as Partial<GradientState>);
		};

		input.addEventListener('input', handler);
		input.addEventListener('change', handler);
	});

	panel.querySelectorAll<HTMLInputElement>('[data-fg-hex]').forEach((input) => {
		const key = input.dataset.fgHex as keyof GradientState | undefined;
		if (!key) return;
		input.addEventListener('change', () => {
			const raw = input.value.trim();
			if (!/^#[0-9a-fA-F]{3,8}$/.test(raw)) return;
			patch({ [key]: raw } as Partial<GradientState>);
		});
	});

	$('[data-fg-flip-angle]')?.addEventListener('click', () => {
		patch({ angle: Number(((state.angle + 180) % 360).toFixed(2)) });
	});

	$('[data-fg-flip]')?.addEventListener('click', () => {
		patch({
			bMix1: state.bMix2,
			bMix2: state.bMix1,
			bWith1: state.bWith2,
			bWith2: state.bWith1,
			bP1: state.bP2,
			bP2: state.bP1,
		});
	});

	$('[data-fg-reset]')?.addEventListener('click', () => {
		localStorage.removeItem(STORAGE_KEY);
		commit({ ...DEFAULTS });
	});

	$('[data-fg-copy-css]')?.addEventListener('click', async () => {
		const css = buildCssSnippet(state);
		await navigator.clipboard.writeText(css);
		const btn = $('[data-fg-copy-css]');
		if (btn) {
			const prev = btn.textContent;
			btn.textContent = 'Copied CSS';
			window.setTimeout(() => {
				btn.textContent = prev;
			}, 1400);
		}
	});

	$('[data-fg-copy-vars]')?.addEventListener('click', async () => {
		const vars = buildVarsSnippet(state);
		await navigator.clipboard.writeText(vars);
		const btn = $('[data-fg-copy-vars]');
		if (btn) {
			const prev = btn.textContent;
			btn.textContent = 'Copied vars';
			window.setTimeout(() => {
				btn.textContent = prev;
			}, 1400);
		}
	});

	$('[data-fg-download]')?.addEventListener('click', () => {
		const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
		downloadText(
			`folder-gradients-${stamp}.css`,
			`/* FeaturedCaseStudies folder gradients — ${stamp} */\n\n${buildCssSnippet(state)}\n\n/* Optional CSS vars for section root */\n:root, [data-folder-gradient-root] {\n${buildVarsSnippet(state)
				.split('\n')
				.map((line) => `\t${line}`)
				.join('\n')}\n}\n`,
		);
	});

	$('[data-fg-toggle]')?.addEventListener('click', () => {
		const collapsed = panel.dataset.collapsed === 'true';
		panel.dataset.collapsed = collapsed ? 'false' : 'true';
	});

	commit(state);
};
