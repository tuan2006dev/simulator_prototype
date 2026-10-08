import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile,mkdir } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE??'playwright'),root=path.resolve('web');
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
 const snapshot=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('dao_thien_nguyen_v2')!));
 const close=async()=>{if((await page.locator('#panel-overlay').getAttribute('class'))?.includes('open'))await page.locator('#panel-close').click();};
 const save=async()=>{await close();await page.locator('#btn-save-local').click();return snapshot();};
 const resume=async(file:string)=>{
  const raw=await readFile(file,'utf8');await page.goto(url);await page.evaluate((s:string)=>localStorage.setItem('dao_thien_nguyen_v2',s),raw);await page.reload();await page.locator('#btn-resume-game').click();await page.locator('.era-roadmap').waitFor();await page.waitForTimeout(400);return JSON.parse(raw);
 };
 const pause=async()=>{await close();if(!(await page.locator('#btn-pause').getAttribute('class'))?.includes('active'))await page.locator('#btn-pause').click();};
 const inspect=async(name:string)=>{await close();await page.locator('#btn-build').click();await page.locator('[data-inspect-building]').filter({hasText:name}).first().click();};
 try{
  await mkdir('artifacts',{recursive:true});
  const ready=await resume('artifacts/iron-ready-save.json');
  assert.equal(await page.locator('#stat-pop').innerText(),'25');assert(await page.locator('#btn-develop-era').isEnabled());
  assert.equal(await page.locator('.era-requirement.met').count(),9);
  await page.locator('#btn-develop-era').click();assert(await page.locator('#btn-develop-era').isDisabled());
  const paid=await snapshot();assert.equal(paid.island.civilization.inventory.copper,ready.island.civilization.inventory.copper-20);assert.equal(paid.island.civilization.inventory.lumber,ready.island.civilization.inventory.lumber-30);assert.equal(paid.island.civilization.inventory.bricks,ready.island.civilization.inventory.bricks-20);
  await save();await page.reload();await page.locator('#btn-resume-game').click();await page.locator('#era-transition-status').waitFor();assert.match(await page.locator('#era-transition-status').innerText(),/0\/30/);
  await close();await page.locator('.speed-btn[data-speed="2"]').click();await page.waitForFunction(()=>document.querySelector('#era-badge')?.textContent==='Đồ Sắt',undefined,{timeout:25000});
  await pause();await page.locator('#era-badge').click();assert.equal(await page.locator('#btn-develop-era').count(),0);assert.match(await page.locator('#panel-body').innerText(),/Hiện Đại.*chưa triển khai/);
  await page.waitForTimeout(300);await page.screenshot({path:'artifacts/iron-unlocked-desktop.png'});
  await close();await page.locator('#btn-build').click();assert.equal(await page.locator('.build-texture').count(),25);assert.match(await page.locator('[data-build="iron_mine"]').innerText(),/Cần nghiên cứu Luyện sắt/);
  await page.waitForFunction(()=>[...document.querySelectorAll<HTMLImageElement>('.build-texture')].every(i=>i.complete&&i.naturalWidth>0));
  await close();await page.locator('#btn-research').click();await page.locator('[data-tech="iron_smelting"] .tc-research-btn').click();
  await save();await page.reload();await page.locator('#btn-resume-game').click();await page.locator('.era-roadmap').waitFor();await close();await page.locator('#btn-research').click();assert.match(await page.locator('.research-active').innerText(),/Luyện sắt/);

  await resume('artifacts/iron-before-upgrade-save.json');await inspect('Nhà ở');assert(await page.locator('#bi-upgrade').isEnabled());
  const before=await snapshot();await page.locator('#bi-upgrade').click();const upgraded=await snapshot();assert.equal(upgraded.island.civilization.inventory.iron,before.island.civilization.inventory.iron-10);
  const worker=await page.locator('#bi-select-npc option').last().getAttribute('value');await page.locator('#bi-select-npc').selectOption(worker);await page.locator('#bi-btn-assign').click();await page.locator('#bi-close').click();await page.locator('.speed-btn[data-speed="2"]').click();await inspect('Nhà ở');
  await page.waitForFunction(()=>document.querySelector('.bi-level')?.textContent?.includes('Cấp 3'),undefined,{timeout:40000});
  await page.locator('#bi-close').click();await pause();await inspect('Nhà ở');assert.match(await page.locator('.bi-texture').getAttribute('src'),/house-iron-3.svg/);assert.match(await page.locator('.bi-level').innerText(),/Đồ Sắt/);assert.equal(await page.locator('#bi-upgrade').count(),0);
  await page.waitForTimeout(350);await page.screenshot({path:'artifacts/iron-house-level3.png'});await page.locator('#bi-close').click();

  await inspect('Trạm giao thương');assert.equal(await page.locator('[data-trade-offer]').count(),3);await page.locator('[data-trade-offer="copper_for_coal"]').click();
  const dispatch=await snapshot(),post=dispatch.island.buildings.find((b:any)=>b.type==='tradepost');assert(post.shipment);
  await page.locator('#bi-close').click();await save();await page.reload();await page.locator('#btn-resume-game').click();await page.locator('.era-roadmap').waitFor();await close();await inspect('Trạm giao thương');assert(await page.locator('#bi-cancel-trade').isVisible());
  await page.locator('#bi-close').click();await page.locator('.speed-btn[data-speed="2"]').click();
  const initialCarrier=dispatch.island.npcs.find((n:any)=>n.id===post.shipment.workerId).position;
  await page.waitForTimeout(1800);await pause();const moving=await save();
  const carrier=moving.island.npcs.find((n:any)=>n.id===post.shipment.workerId);assert.notDeepEqual(carrier.position,initialCarrier);
  await inspect('Trạm giao thương');await page.waitForTimeout(350);await page.screenshot({path:'artifacts/iron-trade-on-map.png'});
  await page.locator('#bi-close').click();await page.locator('.speed-btn[data-speed="2"]').click();
  await page.waitForFunction(()=>{const raw=localStorage.getItem('dao_thien_nguyen_v2');return raw&&JSON.parse(raw).island.civilization.completedTrades>=1;},undefined,{timeout:40000});
  await pause();const delivered=await save();assert.equal(delivered.island.civilization.completedTrades,1);assert.equal(delivered.island.civilization.produced.coal,dispatch.island.civilization.produced.coal);assert.equal(delivered.island.civilization.inventory.coal,dispatch.island.civilization.inventory.coal+10);
  await inspect('Trạm giao thương');assert.match(await page.locator('.bi-state').innerText(),/Đã giao về kho/);
  await page.locator('[data-trade-offer="copper_for_coal"]').click();await page.locator('#bi-cancel-trade').click();const canceled=await snapshot();assert.equal(canceled.island.civilization.inventory.copper,delivered.island.civilization.inventory.copper);
  await page.locator('#bi-close').click();await save();
  await page.setViewportSize({width:390,height:844});await page.locator('#btn-build').click();await page.locator('[data-build="tradepost"]').scrollIntoViewIfNeeded();await page.waitForTimeout(350);assert.equal(await page.locator('#panel-body').evaluate((e:HTMLElement)=>e.scrollWidth>e.clientWidth),false);await page.screenshot({path:'artifacts/iron-catalogue-mobile.png'});
  await close();await page.locator('#era-badge').click();await page.locator('[data-goods="cloth"]').scrollIntoViewIfNeeded();await page.waitForTimeout(350);assert.equal(await page.locator('#panel-body').evaluate((e:HTMLElement)=>e.scrollWidth>e.clientWidth),false);await page.screenshot({path:'artifacts/iron-goods-mobile.png'});
  assert.deepEqual(errors,[]);console.log('PASS: browser Bronze→Iron fees/30-tick resume/future lock, 21 textures/research, paid level 3, trade dispatch/movement/reload/delivery/cancel, desktop/mobile and zero runtime errors.');
 }catch(e){await page.screenshot({path:'artifacts/iron-ui-failure.png'});console.error(await page.locator('body').innerText());throw e;}
 finally{await browser.close();await new Promise<void>(resolve=>server.close(()=>resolve()));}
}
void main().catch(e=>{console.error(e);process.exitCode=1;server.close();});
