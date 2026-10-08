import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE??'playwright');
const root=path.resolve('web');
const server=createServer(async(req,res)=>{
 const file=path.resolve(root,'.'+new URL(req.url??'/','http://localhost').pathname.replace(/\/$/,'/index.html'));
 if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 try{res.setHeader('content-type',({'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml'} as Record<string,string>)[path.extname(file)]??'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404).end();}
});
async function main(){
 await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({channel:'msedge',headless:true}),page=await browser.newPage({viewport:{width:1440,height:1000}}),errors:string[]=[];
 page.on('pageerror',(e:Error)=>errors.push(e.message));page.on('dialog',async(d:any)=>{errors.push(d.message());await d.dismiss();});
 const url=`http://127.0.0.1:${(server.address() as {port:number}).port}`;
 const pause=async()=>{if(!(await page.locator('#btn-pause').getAttribute('class'))?.includes('active'))await page.locator('#btn-pause').click();};
 const resume=async(file:string)=>{
  const raw=await readFile(file,'utf8');await page.goto(url);await page.evaluate((raw:string)=>localStorage.setItem('dao_thien_nguyen_v2',raw),raw);await page.reload();await page.locator('#btn-resume-game').click();await page.locator('.era-roadmap').waitFor();await page.waitForTimeout(350);return JSON.parse(raw);
 };
 const stock=async()=>{
  if((await page.locator('#panel-overlay').getAttribute('class'))?.includes('open'))await page.locator('#panel-close').click();
  await page.locator('#btn-save-local').click();return page.evaluate(()=>JSON.parse(localStorage.getItem('dao_thien_nguyen_v2')!));
 };
 const place=async(type:string,x:number,y:number)=>{
  await page.locator('[data-build="'+type+'"]').click();
  const box=await page.locator('#game-canvas').boundingBox(),zoom=Math.min(box.width/320,box.height/320)*.88;
  await page.mouse.click(box.x+box.width/2+(x-10+.5)*16*zoom,box.y+box.height/2+(y-10+.5)*16*zoom);
  await page.locator('#building-inspector').waitFor({state:'visible'});
 };
 try{
  await mkdir('artifacts',{recursive:true});
  const initial=await resume('artifacts/bronze-expansion-start-save.json');
  await page.locator('#panel-close').click();await page.locator('#btn-build').click();
  assert.equal(await page.locator('.build-texture').count(),25);
  assert.match(await page.locator('[data-build="clay_pit"]').innerText(),/Cần nghiên cứu Gạch và đồ gốm/);
  assert.match(await page.locator('[data-build="bakery"]').innerText(),/Gạch 8/);
  await page.waitForFunction(()=>[...document.querySelectorAll<HTMLImageElement>('.build-texture')].every(i=>i.complete&&i.naturalWidth>0));
  await page.locator('#panel-close').click();await page.locator('#btn-research').click();
  for(const id of ['ceramics','grain_processing']){
   await page.locator('#panel-close').click();
   await page.locator('.speed-btn[data-speed="2"]').click();
   await page.locator('#btn-research').click();
   await page.locator(`[data-tech="${id}"] .tc-research-btn`).waitFor({timeout:60000});
   if(id==='ceramics') {
    await page.evaluate(()=>{(globalThis as any).__researchButton=document.querySelector('[data-tech="ceramics"] .tc-research-btn');});
    await page.waitForTimeout(900);
    assert(await page.evaluate(()=>(globalThis as any).__researchButton===document.querySelector('[data-tech="ceramics"] .tc-research-btn')),'An unchanged research button must survive simulation ticks');
   }
   await page.locator(`[data-tech="${id}"] .tc-research-btn`).click();
   await page.locator(`[data-tech="${id}"].tc-done`).waitFor({timeout:60000});
  }
  await page.locator('#panel-close').click();
  await page.waitForFunction(()=>Number(document.querySelector('#stat-wood')?.textContent)>=20&&Number(document.querySelector('#stat-stone')?.textContent)>=15);
  await pause();await page.locator('#btn-build').click();
  assert(!(await page.locator('[data-build="clay_pit"]').getAttribute('class'))?.includes('unaffordable'));
  assert((await page.locator('[data-build="bakery"]').getAttribute('class'))?.includes('unaffordable'),'Bakery requires real bricks/pottery, not only basic materials');
  await place('clay_pit',9,16);
  await page.locator('#bi-select-npc').selectOption(initial.island.npcs[10].id);await page.locator('#bi-btn-assign').click();
  await page.locator('#bi-close').click();await page.locator('.speed-btn[data-speed="2"]').click();
  await page.waitForFunction(()=>Number(document.querySelector('#stat-clay')?.textContent)>0,undefined,{timeout:45000});
  await pause();await page.locator('#btn-build').click();await page.locator('[data-inspect-building]').filter({hasText:'Hố đất sét'}).click();
  assert.match(await page.locator('.bi-state').innerText(),/Thu .* đất sét/);
  await page.waitForTimeout(300);await page.screenshot({path:'artifacts/bronze-clay-producing.png'});
  await page.locator('#bi-close').click();const researched=await stock();assert(researched.island.civilization.unlocks.includes('ceramics'));assert(researched.island.civilization.unlocks.includes('grain_processing'));

  // Inspect and extend the complete economy produced by the core playthrough.
  const complete=await resume('artifacts/bronze-expanded-save.json');
  assert.match(await page.locator('#panel-body').innerText(),/Lúa mì thô không được tính/);
  await page.locator('#panel-close').click();await page.locator('#btn-build').click();
  for(const type of ['clay_pit','brick_kiln','pottery_workshop','wheat_field','bakery']){
   const name=({clay_pit:'Hố đất sét',brick_kiln:'Lò gạch',pottery_workshop:'Xưởng gốm',wheat_field:'Ruộng lúa mì',bakery:'Lò bánh'} as Record<string,string>)[type];
   await page.locator('[data-inspect-building]').filter({hasText:name}).click();
   assert.match(await page.locator('.bi-texture').getAttribute('src'),new RegExp(type+'-bronze-1.svg'));
   assert.match(await page.locator('.bi-state').innerText(),type==='bakery'?/40 thức ăn/:type==='wheat_field'?/lúa mì/:type==='pottery_workshop'?/đồ gốm/:type==='brick_kiln'?/gạch/:/đất sét/);
   await page.locator('#bi-close').click();await page.locator('#btn-build').click();
  }
  const goods=complete.island.civilization.inventory;
  await place('bakery',17,12);assert.match(await page.locator('.bi-header').innerText(),/Lò bánh/);
  await page.locator('#bi-close').click();const built=await stock();
  assert.equal(built.island.civilization.inventory.bricks,goods.bricks-8);assert.equal(built.island.civilization.inventory.pottery,goods.pottery-2);
  await page.reload();await page.locator('#btn-resume-game').click();await page.locator('.era-roadmap').waitFor();
  const roundtrip=await stock();assert.deepEqual(roundtrip.island.civilization.inventory,built.island.civilization.inventory);
  assert.equal(roundtrip.island.buildings.filter((b:any)=>b.type==='bakery').length,2);
  await page.locator('#btn-build').click();
  await page.locator('[data-inspect-building]').filter({hasText:'Lò bánh'}).first().click();await page.waitForTimeout(350);
  await page.screenshot({path:'artifacts/bronze-bakery-desktop.png'});
  await page.locator('#bi-close').click();await page.setViewportSize({width:390,height:844});await page.locator('#btn-build').click();
  await page.locator('[data-build="bakery"]').scrollIntoViewIfNeeded();await page.waitForTimeout(350);
  assert.equal(await page.locator('#panel-body').evaluate((e:HTMLElement)=>e.scrollWidth>e.clientWidth),false);
  await page.screenshot({path:'artifacts/bronze-economy-mobile.png'});
  await page.locator('#panel-close').click();await page.locator('#era-badge').click();await page.locator('[data-goods="wheat"]').scrollIntoViewIfNeeded();await page.waitForTimeout(350);
  assert.equal(await page.locator('#panel-body').evaluate((e:HTMLElement)=>e.scrollWidth>e.clientWidth),false);
  await page.screenshot({path:'artifacts/bronze-goods-mobile.png'});
  assert.deepEqual(errors,[]);
  console.log('PASS: browser Bronze research, gates/15 textures, real clay placement/work/production, five economy inspectors, bakery goods payment, save/reload, desktop/mobile without overflow or runtime errors.');
 }catch(e){await page.screenshot({path:'artifacts/bronze-economy-ui-failure.png'});console.error(await page.locator('body').innerText());throw e;}
 finally{await browser.close();await new Promise<void>(resolve=>server.close(()=>resolve()));}
}
void main().catch(e=>{console.error(e);process.exitCode=1;server.close();});
