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
    res.setHeader('content-type', ({ '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' } as Record<string, string>)[path.extname(file)] ?? 'application/octet-stream');
    res.end(data);
  } catch { res.writeHead(404).end(); }
});
async function main() {
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors: string[] = [];
  page.on('pageerror', (e: Error) => errors.push(e.message));
  try {
    await mkdir('artifacts', { recursive: true });
    await page.goto(`http://127.0.0.1:${(server.address() as { port: number }).port}`);
    await page.locator('[data-size="small"]').click(); await page.locator('#start-seed').fill('321');
    await page.locator('#start-pop-slider').fill('8'); await page.locator('#btn-start-game').click();
    await page.locator('[data-creature="founder"]').click();
    const map = generateWorldMap(50, 35, 321);
    const box = await page.locator('#game-canvas').boundingBox();
    const zoom = Math.min(box.width / 800, box.height / 560) * .88;
    const point = (t: { x: number; y: number }) => ({ x: box.x + box.width / 2 + (t.x - 25 + .5) * 16 * zoom, y: box.y + box.height / 2 + (t.y - 17.5 + .5) * 16 * zoom });
    for (const tile of map.landTiles.filter(t => t.x >= 17 && t.x <= 22 && t.y >= 14 && t.y <= 20).slice(0, 8)) { const p = point(tile); await page.mouse.click(p.x, p.y); }
    await page.locator('#mc-fraction').filter({ hasText: 'Bước 1' }).waitFor();
    await page.locator('.speed-btn[data-speed="2"]').click();
    await page.waitForFunction(() => Number(document.querySelector('#stat-wood')?.textContent) >= 25 && Number(document.querySelector('#stat-stone')?.textContent) >= 15, undefined, { timeout: 90000 });
    await page.locator('#btn-pause').click(); await page.locator('#btn-build').click();
    assert.equal(await page.locator('.build-texture').count(), 29);
    await page.waitForFunction(() => [...document.querySelectorAll<HTMLImageElement>('.build-texture')].every(img => img.complete && img.naturalWidth > 0));
    await page.screenshot({ path: 'artifacts/building-catalogue.png' });
    await page.locator('[data-build="house"]').click();
    const houseTile = map.landTiles.find(t => t.x >= 23 && t.x <= 26 && t.y >= 24 && t.y <= 25 && map.tiles[t.y][t.x] === 'grass')!;
    const housePoint = point(houseTile); await page.mouse.click(housePoint.x, housePoint.y);
    await page.locator('#building-inspector').waitFor({ state: 'visible' });
    assert.match(await page.locator('#building-inspector').innerText(), /Cấp 1 \/ 3/);
    const workerId = await page.locator('#bi-select-npc option').last().getAttribute('value');
    await page.locator('#bi-select-npc').selectOption(workerId); await page.locator('#bi-btn-assign').click();
    await page.locator('#bi-close').click(); await page.locator('#btn-pause').click();
    // Open through the catalogue so position changes cannot affect selection.
    await page.locator('#btn-build').click(); await page.locator('[data-inspect-building]').first().click();
    await page.waitForFunction(() => document.querySelector('#building-inspector')?.textContent?.includes('Hoàn thành'), undefined, { timeout: 45000 });
    await page.screenshot({ path: 'artifacts/house-level-1.png' });
    await page.locator('#bi-close').click();
    await page.waitForFunction(() => Number(document.querySelector('#stat-wood')?.textContent) >= 60 && Number(document.querySelector('#stat-stone')?.textContent) >= 25 && Number(document.querySelector('#stat-food')?.textContent) >= 100, undefined, { timeout: 90000 });
    const eraContinue = page.getByRole('button', { name: 'Tiếp tục', exact: true });
    if (await eraContinue.isVisible()) await eraContinue.click();
    await page.locator('#btn-pause').click(); await page.locator('#btn-build').click(); await page.locator('[data-inspect-building]').first().click();
    assert.equal(await page.locator('#bi-upgrade').isEnabled(), false, 'Stone buildings require Bronze before level 2');
    assert.match(await page.locator('#building-inspector').innerText(), /Cần Đồ Đồng/);
    await page.screenshot({ path: 'artifacts/stone-house-upgrade-lock.png' });
    await page.locator('#bi-close').click();    await page.locator('#btn-creatures').click(); assert.match(await page.locator('.creature-group').first().innerText(), /8 \/ 20/);
    await page.locator('[data-creature="settler"]').click();
    const arrivalTile = map.landTiles.find(t => t.x >= 28 && t.x <= 31 && t.y >= 24 && t.y <= 25 && map.tiles[t.y][t.x] === 'grass')!;
    const arrival = point(arrivalTile); await page.mouse.click(arrival.x, arrival.y);
    await page.locator('#stat-pop').filter({ hasText: '9' }).waitFor();
    await page.locator('#btn-build').click(); await page.locator('[data-inspect-building]').first().click();
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.locator('#building-inspector').evaluate((el: HTMLElement) => el.scrollWidth > el.clientWidth), false);
    await page.screenshot({ path: 'artifacts/buildings-mobile.png' });
    assert.deepEqual(errors, []);
    console.log('PASS: browser texture loading, building placement, worker assignment, construction, Stone upgrade lock, housing capacity, immigration, mobile layout, and zero runtime errors.');
  } catch (e) { await page.screenshot({ path: 'artifacts/buildings-failure.png' }); console.error(await page.locator('body').innerText()); throw e; }
  finally { await browser.close(); await new Promise<void>(resolve => server.close(() => resolve())); }
}
void main().catch(e => { console.error(e); server.close(); process.exitCode = 1; });
