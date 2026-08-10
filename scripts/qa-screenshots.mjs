import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

mkdirSync('.qa-shots', { recursive: true });

const base = 'http://localhost:4322';
const pages = [
	['home', '/'],
	['work', '/work'],
	['air-india', '/work/air-india-brand'],
	['igl', '/work/igl'],
	['mythila', '/work/mythila'],
	['akshar', '/work/akshar-chitra'],
	['convergence', '/work/convergence'],
	['himalayan', '/work/himalayan-book'],
	['witch', '/work/way-of-the-witch'],
	['maahi', '/work/maahi'],
	['vivan', '/work/vivan'],
];

const viewports = [
	['375', { width: 375, height: 812 }],
	['768', { width: 768, height: 1024 }],
	['1280', { width: 1280, height: 800 }],
	['1920', { width: 1920, height: 1080 }],
];

const browser = await chromium.launch();
const results = [];

for (const [name, path] of pages) {
	for (const [vw, size] of viewports) {
		const page = await browser.newPage({ viewport: size });
		const resp = await page.goto(base + path, {
			waitUntil: 'networkidle',
			timeout: 90000,
		});
		await page.waitForTimeout(800);
		const overflow = await page.evaluate(() => {
			const doc = document.documentElement;
			return {
				scrollWidth: doc.scrollWidth,
				clientWidth: doc.clientWidth,
				overflow: doc.scrollWidth > doc.clientWidth + 1,
			};
		});
		const file = `.qa-shots/${name}-${vw}.png`;
		await page.screenshot({ path: file, fullPage: false });
		results.push({
			name,
			vw,
			status: resp?.status(),
			...overflow,
			file,
		});
		await page.close();
	}
}

await browser.close();
writeFileSync('.qa-shots/report.json', JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
