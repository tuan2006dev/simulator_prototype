import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { generateWorldMap } from '../src/renderer/WorldMap';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const root = path.resolve('web');
const server = createServer(async (req, res) => {
  const file = path.resolve(root, '.' + new URL(req.url ?? '/', 'http://localhost').pathname.replace(/\/$/, '/index.html'));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  try {
    const data = await readFile(file);
    const mime: Record<string, string> = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml' };
    res.setHeader('content-type', mime[path.extname(file)] ?? 'application/octet-stream');
    res.end(data);
  } catch { res.writeHead(404).end(); }
});

async function main() {
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address() as { port: number };
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const errors: string[] = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    page.on('pageerror', (error: Error) => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${address.port}`);
    await page.locator('[data-size="small"]').click();
    await page.locator('#start-seed').fill('321');
    await page.locator('#start-pop-slider').fill('3');
    await page.locator('#btn-start-game').click();
    await page.locator('#panel-title').filter({ hasText: 'Sinh vật' }).waitFor();
    assert.equal(await page.locator('.creature-card').count(), 5);
    assert.equal(await page.locator('[data-creature="settler"]').isDisabled(), true);
    await mkdir('artifacts', { recursive: true });
    await page.screenshot({ path: 'artifacts/creatures-desktop.png' });
    await page.locator('[data-creature="founder"]').click();
    const map = generateWorldMap(50, 35, 321);
    const tiles = map.landTiles.filter(t => t.x >= 17 && t.x <= 25 && t.y >= 14 && t.y <= 22).slice(0, 3);
    assert.equal(tiles.length, 3);
    const box = await page.locator('#game-canvas').boundingBox();
    const zoom = Math.min(box.width / 800, box.height / 560) * .88;
    const point = (t: { x: number; y: number }) => ({ x: box.x + box.width / 2 + (t.x - 25 + .5) * 16 * zoom, y: box.y + box.height / 2 + (t.y - 17.5 + .5) * 16 * zoom });
    for (const tile of tiles) {
      const p = point(tile);
      await page.mouse.click(p.x, p.y);
    }
    await page.locator('#mc-fraction').filter({ hasText: 'Bước 1' }).waitFor();
    await page.locator('.speed-btn[data-speed="2"]').click();
    await page.locator('#btn-pause').click();
    await page.locator('#sb-population').click();
    await page.locator('.labor-role-select').last().selectOption('food');
    const woodWorker = page.locator('.labor-role-select').first();
    const workerId = await woodWorker.getAttribute('data-npc');
    await woodWorker.selectOption('wood');
    await page.locator('#panel-close').click();
    await page.locator('#btn-pause').click();
    await page.locator('#sb-population').click();
    const workerStatus = page.locator(`[data-labor-status="${workerId}"]`);
    await page.waitForFunction((id: string) => /Đang đi|Đang thu hoạch/.test(document.querySelector(`[data-labor-status="${id}"]`)?.textContent ?? ''), workerId, { timeout: 15000 });
    await page.screenshot({ path: 'artifacts/labor-walking.png' });
    await page.waitForFunction((id: string) => document.querySelector(`[data-labor-status="${id}"]`)?.textContent?.includes('Đang thu hoạch'), workerId, { timeout: 20000 });
    const beforeWood = Number(await page.locator('#stat-wood').innerText());
    await page.screenshot({ path: 'artifacts/labor-harvesting.png' });
    await page.waitForFunction((before: number) => Number(document.querySelector('#stat-wood')?.textContent) > before, beforeWood, { timeout: 20000 });
    await page.locator('#panel-close').click();
    await page.locator('#btn-pause').click();
    await page.locator('#sb-population').click();
    await page.locator('.labor-role-select').first().selectOption('idle');
    const stoppedWood = Number(await page.locator('#stat-wood').innerText());
    await page.locator('#panel-close').click();
    await page.locator('#btn-pause').click();
    await page.locator('#sb-population').click();
    await page.waitForTimeout(3600);
    assert.equal(Number(await page.locator('#stat-wood').innerText()), stoppedWood, 'Idle worker must stop producing wood');
    await page.locator('.labor-role-select').first().selectOption('wood');
    await page.screenshot({ path: 'artifacts/labor-desktop.png' });
    await page.locator('#panel-close').click();
    // Daily meals now consume stock regularly: create a food surplus before immigration.
    await page.locator('#sb-population').click();
    await page.locator('.labor-role-select').first().selectOption('food');
    await page.waitForFunction(()=>Number(document.querySelector('#stat-food')?.textContent)>=85,undefined,{timeout:45000});
    await page.locator('.labor-role-select').first().selectOption('wood');
    await page.locator('#panel-close').click();
    await page.locator('#btn-creatures').click();
    assert.equal(await page.locator('[data-creature="founder"]').isDisabled(), true);
    await page.waitForFunction(() => !(document.querySelector('[data-creature="settler"]') as HTMLButtonElement)?.disabled, undefined, { timeout: 45000 });
    await page.locator('#panel-close').click();
    await page.locator('#btn-pause').click();
    await page.locator('#btn-creatures').click();
    await page.locator('[data-creature="settler"]').click();
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#stat-pop').innerText(), '3', 'Cancel placement must not create a settler');
    await page.locator('#btn-creatures').click();
    await page.locator('[data-creature="settler"]').click();
    const invalid = point({ x: 8, y: 8 });
    await page.mouse.click(invalid.x, invalid.y);
    assert.equal(await page.locator('#stat-pop').innerText(), '3', 'Water tile must not create a settler');
    const arrivalTiles = map.landTiles.filter(t => t.x >= 23 && t.x <= 30 && t.y >= 24 && t.y <= 27 && ['grass', 'sand', 'forest'].includes(map.tiles[t.y][t.x])).slice(0, 8);
    for (const tile of arrivalTiles) {
      const arrival = point(tile);
      await page.mouse.click(arrival.x, arrival.y);
      await page.waitForTimeout(150);
      if (await page.locator('#stat-pop').innerText() === '4') break;
    }
    await page.locator('#stat-pop').filter({ hasText: '4' }).waitFor();
    await page.locator('#btn-creatures').click();
    assert.match(await page.locator('.creature-group').first().innerText(), /4 \/ 15/);
    await page.locator('#panel-close').click();
    await page.locator('#btn-research').click();
    assert.equal(await page.locator('.tech-group').count(), 13);
    assert.equal(await page.locator('.tech-card').count(), 25);
    const desktop = await page.locator('.tech-grid').first().evaluate((el: HTMLElement) => getComputedStyle(el).gridTemplateColumns);
    assert.equal(desktop.split(' ').length, 2);
    await page.screenshot({ path: 'artifacts/research-desktop.png' });
    await page.setViewportSize({ width: 390, height: 844 });
    const mobile = await page.locator('.tech-grid').first().evaluate((el: HTMLElement) => getComputedStyle(el).gridTemplateColumns);
    assert.equal(mobile.split(' ').length, 1);
    const overflow = await page.locator('#panel-body').evaluate((el: HTMLElement) => el.scrollWidth > el.clientWidth);
    assert.equal(overflow, false, 'Research panel must not overflow horizontally on mobile');
    await page.screenshot({ path: 'artifacts/research-mobile.png' });
    await page.locator('#panel-close').click();
    await page.locator('#btn-creatures').click();
    assert.equal(await page.locator('#panel-body').evaluate((el: HTMLElement) => el.scrollWidth > el.clientWidth), false);
    await page.screenshot({ path: 'artifacts/creatures-mobile.png' });
    assert.deepEqual(errors, [], 'Browser runtime must have no uncaught errors');
    console.log('PASS: browser labor assignment, walking, timed harvest, stock increase, idle/resume, immigration/cancellation/invalid placement, research desktop/mobile, and zero runtime errors.');
  } catch (error) {
    const pages = browser.contexts().flatMap((context: any) => context.pages());
    if (pages[0]) {
      await pages[0].screenshot({ path: 'artifacts/browser-failure.png' });
      console.error(await pages[0].locator('body').innerText());
    }
    throw error;
  } finally {
    await browser.close();
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
}
void main().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
