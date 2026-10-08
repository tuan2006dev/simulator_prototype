import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE??'playwright');
const root=path.resolve('web');
const server=createServer(async(req,res)=>{const file=path.resolve(root,'.'+new URL(req.url??'/','http://localhost').pathname.replace(/\/$/,'/index.html'));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}try{res.setHeader('content-type',({'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png'} as Record<string,string>)[path.extname(file)]??'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404).end();}});
async function main(){
 await mkdir('artifacts',{recursive:true});await new Promise<void>(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({channel:'msedge',headless:true}),page=await browser.newPage({viewport:{width:1440,height:1000}}),errors:string[]=[],failed:string[]=[];
 page.on('pageerror',(e:Error)=>errors.push(e.message));page.on('response',(r:any)=>{if(r.status()>=400)failed.push(r.url());});
 const close=async()=>{if(await page.locator('#panel-overlay').evaluate((e:HTMLElement)=>e.classList.contains('open')))await page.locator('#panel-close').click();};
 const pause=async(on:boolean)=>{await close();if((await page.locator('#btn-pause').evaluate((e:HTMLElement)=>e.classList.contains('active')))!==on)await page.locator('#btn-pause').click();};
 const save=async()=>{await close();await page.locator('#btn-save-local').click();return page.evaluate(()=>JSON.parse(localStorage.getItem('dao_thien_nguyen_v2')!));};
 try{
  const oldRaw=await readFile('artifacts/bronze-playable-save.json','utf8'),old=JSON.parse(oldRaw);
  await page.goto(`http://127.0.0.1:${(server.address() as {port:number}).port}`);await page.evaluate((raw:string)=>localStorage.setItem('dao_thien_nguyen_v2',raw),oldRaw);await page.reload();await page.locator('#btn-resume-game').click();await page.locator('.era-roadmap').waitFor();await pause(true);const migrated=await save();assert(migrated.island.logistics);assert.deepEqual(migrated.island.civilization.inventory,old.island.civilization.inventory);assert(migrated.island.buildings.filter((b:any)=>b.buffer).every((b:any)=>Object.keys(b.buffer.input).length===0&&Object.keys(b.buffer.output).length===0));
  const raw=await readFile('artifacts/logistics-played-save.json','utf8');await page.goto(`http://127.0.0.1:${(server.address() as {port:number}).port}`);await page.evaluate((raw:string)=>localStorage.setItem('dao_thien_nguyen_v2',raw),raw);await page.reload();await page.locator('#btn-resume-game').click();await page.locator('.era-roadmap').waitFor();await pause(true);
  const initial=await save();await page.locator('#sb-population').click();assert(await page.locator('#logistics-overview').isVisible());assert.match(await page.locator('#logistics-overview').innerText(),/Đầu vào|Thành phẩm/);assert(await page.locator('.labor-role-select option[value="haul"]').count()>0);
  await page.locator('#logistics-overview').screenshot({path:'artifacts/logistics-overview.png'});
  await close();await page.locator('.speed-btn[data-speed="2"]').click();await pause(false);
  await page.waitForFunction(()=>(globalThis as any).__islandNpcs?.some((n:any)=>n.freight&&n.freight.good!=='food'),undefined,{timeout:45000});await pause(true);
  let state=await save();const loaded=state.island.npcs.find((n:any)=>n.freight&&n.freight.good!=='food');assert(loaded);assert(loaded.freight.amount<=30);
  await page.locator('#sb-population').click();await page.locator(`.labor-role-select[data-npc="${loaded.id}"]`).selectOption('idle');state=await save();assert.deepEqual(state.island.npcs.find((n:any)=>n.id===loaded.id).freight,loaded.freight);
  await page.reload();await page.locator('#btn-resume-game').click();await page.locator('.era-roadmap').waitFor();await pause(true);state=await save();assert.deepEqual(state.island.npcs.find((n:any)=>n.id===loaded.id).freight,loaded.freight);
  await page.locator('#sb-population').click();const bag=page.locator(`[data-inventory="${loaded.id}"]`);await bag.scrollIntoViewIfNeeded();assert.match(await bag.innerText(),/Túi đồ/);await page.waitForTimeout(300);assert(await bag.locator('img').evaluateAll((images:HTMLImageElement[])=>images.every(i=>i.complete&&i.naturalWidth>0)));await bag.screenshot({path:'artifacts/logistics-loaded-bag.png'});
  await close();await pause(false);await page.waitForFunction((id:string)=>(globalThis as any).__islandNpcs?.some((n:any)=>n.id===id&&!n.freight),loaded.id,{timeout:45000});await pause(true);
  // Return this carrier to the haul role through the actual controls.
  await page.locator('#sb-population').click();await page.locator(`.labor-role-select[data-npc="${loaded.id}"]`).selectOption('haul');await close();
  const day=Number(await page.locator('#stat-day').innerText());await page.locator('.speed-btn[data-speed="2"]').click();await pause(false);await page.waitForFunction((day:number)=>Number(document.querySelector('#stat-day')?.textContent)>=day,day+12,{timeout:65000});await pause(true);state=await save();
  assert.equal(state.island.npcs.filter((n:any)=>n.isAlive).length,12);assert(state.island.sharedFood>0);assert(state.island.civilization.produced.copper>initial.island.civilization.produced.copper);assert(state.island.civilization.produced.lumber>initial.island.civilization.produced.lumber);assert(state.island.civilization.inventory.copper>initial.island.civilization.inventory.copper||state.island.civilization.inventory.lumber>initial.island.civilization.inventory.lumber,'Finished goods must actually arrive at the warehouse');
  assert(state.island.npcs.every((n:any)=>!n.freight||n.freight.amount<=30));for(const b of state.island.buildings.filter((b:any)=>b.buffer))for(const stock of [b.buffer.input,b.buffer.output])assert(Object.values(stock).reduce((s:number,n:any)=>s+n,0)<=60.00000001);
  await writeFile('artifacts/logistics-browser-save.json',JSON.stringify(state));
  await page.locator('#btn-build').click();await page.locator('[data-inspect-building]').filter({hasText:'Xưởng gỗ'}).click();await page.locator('[data-building-logistics]').waitFor();assert.match(await page.locator('[data-building-logistics]').innerText(),/Đầu vào|Thành phẩm/);await page.locator('[data-building-logistics]').scrollIntoViewIfNeeded();await page.waitForTimeout(350);await page.screenshot({path:'artifacts/logistics-factory-desktop.png'});await page.locator('#bi-close').click();
  await page.locator('#sb-population').click();await page.locator('#logistics-overview').scrollIntoViewIfNeeded();await page.screenshot({path:'artifacts/logistics-desktop.png'});await page.setViewportSize({width:390,height:844});await page.locator('#logistics-overview').scrollIntoViewIfNeeded();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:'artifacts/logistics-mobile.png'});
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);console.log(`PASS: browser physical freight, role-change preserves load, reload/delivery, factory stocks, 12 additional days, 12 alive Food ${state.island.sharedFood.toFixed(1)}, copper/lumber produced, desktop/mobile and no runtime/asset errors.`);
 }catch(e){await page.screenshot({path:'artifacts/logistics-ui-failure.png'});throw e;}finally{await browser.close();await new Promise<void>(r=>server.close(()=>r()));}
}
void main().catch(e=>{console.error(e);server.close();process.exitCode=1;});
