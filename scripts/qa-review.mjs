import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

mkdirSync('.qa-shots', { recursive: true });

const base = 'http://localhost:4322';
const shots = [
	['home-hero-375', '/', 375, 812, 0],
	['home-hero-1280', '/', 1280, 800, 0],
	['home-about-1280', '/', 1280, 800, 900],
	['home-featured-1280', '/', 1280, 800, 2200],
	['home-other-1280', '/', 1280, 800, 4500],
	['work-1280', '/work', 1280, 800, 0],
	['igl-1280', '/work/igl', 1280, 800, 0],
	['igl-body-1280', '/work/igl', 1280, 800, 1400],
	['air-india-1280', '/work/air-india-brand', 1280, 800, 0],
	['convergence-1280', '/work/convergence', 1280, 800, 0],
	['akshar-1280', '/work/akshar-chitra', 1280, 800, 0],
	['home-hero-1920', '/', 1920, 1080, 0],
];

const browser = await chromium.launch();
const results = [];

for (const [name, path, w, h, y] of shots) {
	const page = await browser.newPage({ viewport: { width: w, height: h } });
	await page.goto(base + path, { waitUntil: 'networkidle', timeout: 90000 });
	if (y) await page.evaluate((yy) => window.scrollTo(0, yy), y);
	await page.waitForTimeout(700);
	const broken = await page.evaluate(
		() => [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).length,
	);
	const overflow = await page.evaluate(
		() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
	);
	const file = `.qa-shots/r-${name}.png`;
	await page.screenshot({ path: file });
	results.push({ name, broken, overflow, file });
	console.log(JSON.stringify({ name, broken, overflow }));
	await page.close();
}

await browser.close();
writeFileSync('.qa-shots/review.json', JSON.stringify(results, null, 2));
