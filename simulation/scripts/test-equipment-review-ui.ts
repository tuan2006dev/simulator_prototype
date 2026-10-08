import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { generateWorldMap } from '../src/renderer/WorldMap';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE??'playwright');
const root=path.resolve('web');
const server=createServer(async(req,res)=>{
  const file=path.resolve(root,'.'+new URL(req.url??'/','http://localhost').pathname.replace(/\/$/,'/index.html'));
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  try{res.setHeader('content-type',({'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png'} as Record<string,string>)[path.extname(file)]??'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404).end();}
});
async function main(){
  await mkdir('artifacts',{recursive:true});await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch({channel:'msedge',headless:true}),page=await browser.newPage({viewport:{width:1440,height:1000}}),errors:string[]=[],failed:string[]=[];
  page.on('pageerror',(e:Error)=>errors.push(e.message));page.on('response',(r:any)=>{if(r.status()>=400)failed.push(r.url());});
  const close=async()=>{if(await page.locator('#panel-overlay').evaluate((e:HTMLElement)=>e.classList.contains('open')))await page.locator('#panel-close').click();};
  const pause=async(on:boolean)=>{await close();if((await page.locator('#btn-pause').evaluate((e:HTMLElement)=>e.classList.contains('active')))!==on)await page.locator('#btn-pause').click();};
  const save=async()=>{await close();await page.locator('#btn-save-local').click();return page.evaluate(()=>JSON.parse(localStorage.getItem('dao_thien_nguyen_v2')!));};
  try{
    const raw=await readFile('artifacts/equipment-played-save.json','utf8');await page.goto(`http://127.0.0.1:${(server.address() as {port:number}).port}`);await page.evaluate((raw:string)=>localStorage.setItem('dao_thien_nguyen_v2',raw),raw);await page.reload();await page.locator('#btn-resume-game').click();await page.locator('.era-roadmap').waitFor();await close();let state=await save(),id=state.island.npcs[0].id;
    await page.locator('#sb-population').click();await page.locator('[data-craft-tool="axe"]').click();state=await save();assert(state.island.equipment.order);const paid={wood:state.island.wood,stone:state.island.stone};await page.locator('#sb-population').click();await page.locator('#cancel-tool-craft').click();await close();state=await save();assert.equal(state.island.equipment.order,undefined);assert.equal(state.island.wood,paid.wood+4);assert.equal(state.island.stone,paid.stone+3);assert.equal(state.island.equipment.crafted.axe,1);
    await page.locator('#sb-population').click();await page.locator(`.labor-mode-select[data-npc="${id}"]`).selectOption('auto');await close();const start=Number(await page.locator('#stat-day').innerText());await page.locator('.speed-btn[data-speed="2"]').click();await pause(false);await page.waitForFunction((d:number)=>Number(document.querySelector('#stat-day')?.textContent)>=d,start+10,{timeout:50000});await pause(true);state=await save();assert.equal(state.island.npcs.filter((n:any)=>n.isAlive).length,5);assert(state.island.sharedFood>0);assert(state.island.npcs.every((n:any)=>!n.cargo||Object.values(n.cargo).reduce((s:number,v:any)=>s+v,0)<=30.00000001));
    for(const kind of ['axe','pickaxe','fishing_rod'])assert.equal(state.island.equipment.stock[kind]+state.island.npcs.filter((n:any)=>n.equippedTool===kind).length,state.island.equipment.crafted[kind]);
    await writeFile('artifacts/equipment-stable-save.json',JSON.stringify(state));await page.locator('#sb-population').click();await page.locator('.equipment-controls').scrollIntoViewIfNeeded();await page.waitForTimeout(400);await page.screenshot({path:'artifacts/equipment-desktop.png'});await page.locator('.equipment-people').scrollIntoViewIfNeeded();
    for(const npc of state.island.npcs.filter((n:any)=>n.isAlive)){
      const bag=page.locator(`[data-inventory="${npc.id}"]`);
      assert.equal(await bag.locator('.inventory-grid .inventory-slot').count(),4);
      for(const kind of ['wood','stone','food','herbs'])assert.equal(Number(await bag.locator(`[data-cargo-kind="${kind}"]`).getAttribute('data-quantity')),npc.cargo?.[kind]??0);
      assert.equal(await bag.locator('.inventory-equipment .inventory-slot').getAttribute('aria-label'),npc.equippedTool?({axe:'Rìu đá',pickaxe:'Cuốc đá',fishing_rod:'Cần câu'} as any)[npc.equippedTool]:'Ô công cụ trống');
    }
    assert(await page.locator('.inventory-slot img').evaluateAll((images:HTMLImageElement[])=>images.every(image=>image.complete&&image.naturalWidth>0)));
    await page.screenshot({path:'artifacts/equipment-bags-desktop.png'});await page.setViewportSize({width:390,height:844});await page.locator('.equipment-people').scrollIntoViewIfNeeded();await page.waitForTimeout(400);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:'artifacts/equipment-mobile.png'});
    assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);console.log('PASS: paid crafting cancellation/refund via UI, 10 further played days, bags ≤30, equipment conservation, desktop/mobile.');
  }finally{await browser.close();await new Promise<void>(resolve=>server.close(()=>resolve()));}
}
void main().catch(e=>{console.error(e);server.close();process.exitCode=1;});
