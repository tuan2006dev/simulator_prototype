import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE??'playwright');const root=path.resolve('web');
const server=createServer(async(req,res)=>{const file=path.resolve(root,'.'+new URL(req.url??'/','http://localhost').pathname.replace(/\/$/,'/index.html'));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}try{res.setHeader('content-type',({'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png'} as Record<string,string>)[path.extname(file)]??'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404).end();}});
async function main(){
 await mkdir('artifacts',{recursive:true});await new Promise<void>(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({channel:'msedge',headless:true}),page=await browser.newPage({viewport:{width:1440,height:1000}}),errors:string[]=[],failed:string[]=[];page.on('pageerror',(e:Error)=>errors.push(e.message));page.on('response',(r:any)=>{if(r.status()>=400)failed.push(r.url());});const url=`http://127.0.0.1:${(server.address() as {port:number}).port}`;
 const close=async()=>{if(await page.locator('#building-inspector').isVisible())await page.locator('#bi-close').click();if(await page.locator('#panel-overlay').evaluate((e:HTMLElement)=>e.classList.contains('open')))await page.locator('#panel-close').click();};
 const pause=async(on:boolean)=>{await close();if((await page.locator('#btn-pause').evaluate((e:HTMLElement)=>e.classList.contains('active')))!==on)await page.locator('#btn-pause').click();};
 const save=async()=>{await close();await page.locator('#btn-save-local').click();return page.evaluate(()=>JSON.parse(localStorage.getItem('dao_thien_nguyen_v2')!));};
 const load=async(raw:string)=>{await page.goto(url);await page.evaluate((raw:string)=>localStorage.setItem('dao_thien_nguyen_v2',raw),raw);await page.reload();await page.locator('#btn-resume-game').click();await page.locator('.era-roadmap').waitFor();await pause(true);};
 const open=async()=>{await close();await page.locator('#sb-quests').click();await page.locator('.era-roadmap').waitFor();await page.waitForTimeout(300);};
 const inspect=async(id:string)=>{await close();await page.locator('#btn-build').click();await page.locator(`[data-inspect-building="${id}"]`).click();await page.locator('#building-inspector').waitFor({state:'visible'});await page.waitForTimeout(300);};




 try{
 const raw=await readFile('artifacts/patrol-browser-played-save.json','utf8'),initial=JSON.parse(raw);await load(raw);await open();assert.equal(await page.locator('[data-discovery]').count(),3);assert.equal(await page.locator('[data-visit-discovery]').count(),0);const loaded=await save();assert.deepEqual(loaded.island.exploration.points,initial.island.exploration.points);await open();await page.screenshot({path:'artifacts/patrol-discoveries-desktop.png'});await page.setViewportSize({width:390,height:844});await page.locator('.exploration-panel').scrollIntoViewIfNeeded();await page.screenshot({path:'artifacts/patrol-mobile.png'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.setViewportSize({width:1440,height:1000});const warningRaw=await readFile('artifacts/patrol-warning-fixture-save.json','utf8'),warning=JSON.parse(warningRaw),id=warning.island.exploration.active.npcId;await load(warningRaw);await open();await pause(false);await open();await page.waitForFunction(()=>document.querySelector('.exploration-warning')?.textContent?.includes('Đuốc còn'),{},{timeout:20000});await pause(true);await open();assert.equal(await page.locator('.exploration-warning').evaluate((e:HTMLElement)=>getComputedStyle(e).color),'rgb(244, 210, 137)');await page.screenshot({path:'artifacts/patrol-return-warning-fixture.png'});
 // A separate controlled visit exercises the public manual point button.
 const manual=JSON.parse(warningRaw);manual.island.tick=(Math.floor(manual.island.tick/10)+1)*10;manual.island.exploration.active=undefined;manual.island.exploration.warning='';await load(JSON.stringify(manual));await open();await page.locator('#explorer-choice').selectOption(id);await page.locator('[data-visit-discovery="discovery-0"]').click();const start=await save();assert.equal(start.island.exploration.active.pointId,'discovery-0');assert.equal(start.island.npcs.find((n:any)=>n.id===id).attributes.int,manual.island.npcs.find((n:any)=>n.id===id).attributes.int);await pause(false);await open();await page.waitForFunction(()=>document.querySelector('[data-discovery="discovery-0"]')?.textContent?.includes('Đã xử lý'),{},{timeout:20000});await pause(true);const after=await save();assert(after.island.exploration.points.find((p:any)=>p.id==='discovery-0').claimed);assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);console.log('PASS final browser: claimed points stay one-time after load/desktop/mobile, readable low-torch warning, public manual visit fixture physically collects; no errors.');
 }finally{await browser.close();server.close();}
}
main().catch(e=>{console.error(e);server.close();process.exitCode=1;});
