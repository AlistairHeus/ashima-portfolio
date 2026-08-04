/**
 * Dev-only hero debug upload — saves an image into `public/images/work`.
 * Disabled in production builds.
 */
import type { APIRoute } from 'astro';
import { mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';

export const prerender = false;

const WORK_DIR = path.join(process.cwd(), 'public', 'images', 'work');

const ALLOWED_TYPES: Readonly<Record<string, string>> = {
	'image/jpeg': '.jpg',
	'image/jpg': '.jpg',
	'image/png': '.png',
	'image/webp': '.webp',
	'image/gif': '.gif',
};

/**
 * Turn a filename into a URL-safe kebab slug (no extension).
 */
const slugifyBase = (name: string): string => {
	const base = name.replace(/\.[^.]+$/, '');
	const slug = base
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
	return slug || 'hero-polaroid';
};

/**
 * Pick a unique filename in the work directory.
 */
const uniqueFileName = async (
	base: string,
	ext: string,
): Promise<string> => {
	let candidate = `${base}${ext}`;
	let attempt = 0;
	while (true) {
		try {
			await access(path.join(WORK_DIR, candidate));
			attempt += 1;
			candidate = `${base}-${attempt}${ext}`;
		} catch {
			return candidate;
		}
	}
};

export const POST: APIRoute = async ({ request }) => {
	if (!import.meta.env.DEV) {
		return new Response(
			JSON.stringify({ error: 'Hero debug upload is only available in local development.' }),
			{ status: 403, headers: { 'Content-Type': 'application/json' } },
		);
	}

	let form: FormData;
	try {
		form = await request.formData();
	} catch {
		return new Response(JSON.stringify({ error: 'Expected multipart form data.' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const file = form.get('file');
	if (!(file instanceof File)) {
		return new Response(JSON.stringify({ error: 'Missing file field.' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const extFromType = ALLOWED_TYPES[file.type];
	const nameExt = path.extname(file.name).toLowerCase();
	const ext =
		extFromType ??
		(nameExt === '.jpeg' ? '.jpg' : ['.jpg', '.png', '.webp', '.gif'].includes(nameExt)
			? nameExt
			: null);

	if (!ext) {
		return new Response(
			JSON.stringify({ error: 'Unsupported image type. Use jpg, png, webp, or gif.' }),
			{ status: 400, headers: { 'Content-Type': 'application/json' } },
		);
	}

	const base = slugifyBase(file.name);
	await mkdir(WORK_DIR, { recursive: true });
	const fileName = await uniqueFileName(base, ext);
	const absolutePath = path.join(WORK_DIR, fileName);
	const buffer = Buffer.from(await file.arrayBuffer());
	await writeFile(absolutePath, buffer);

	const publicPath = `/images/work/${fileName}`;

	return new Response(
		JSON.stringify({
			src: publicPath,
			fileName,
			alt: base.replace(/-/g, ' '),
		}),
		{ status: 200, headers: { 'Content-Type': 'application/json' } },
	);
};
