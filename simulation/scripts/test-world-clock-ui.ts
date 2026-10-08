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
 await page.goto(url);await page.locator('#world-clock-note').waitFor({state:'visible'});assert(await page.locator('#world-clock-note').isVisible());
 const raw=await readFile('artifacts/three-islands-ready-save.json','utf8');await load(raw);assert.equal(await page.locator('#world-time').textContent(),'06:00');const start=await save();assert.equal(start.island.tick,0);assert.equal(start.island.clock.progressMs,0);
 await page.locator('.speed-btn[data-speed="1"]').click();let began=Date.now();
 await page.waitForFunction(()=>{const t=document.querySelector('#world-time')?.textContent??'';return t>='07:00'&&t<'07:30';},{},{timeout:15000});await pause(true);let runningMs=Date.now()-began;const partial=await save();assert.equal(partial.island.tick,0);assert(partial.island.clock.progressMs>=5000&&partial.island.clock.progressMs<7000);await writeFile('artifacts/world-clock-browser-partial-save.json',JSON.stringify(partial));
 await page.waitForTimeout(3000);const frozen=await save();assert.deepEqual(frozen.island.clock,partial.island.clock);assert.deepEqual(frozen.island.faith,partial.island.faith);assert.deepEqual(frozen.island.weather,partial.island.weather);
 await load(JSON.stringify(partial));const restored=await save();assert.deepEqual(restored.island.clock,partial.island.clock);const restoredTime=await page.locator('#world-time').textContent();await pause(false);began=Date.now();
 await page.waitForFunction(()=>{const t=document.querySelector('#world-time')?.textContent??'';return t>='09:00'&&t<'09:30';},{},{timeout:20000});assert((await page.locator('#tide-status').textContent())?.includes('Nước rút'));await page.screenshot({path:'artifacts/world-clock-low-tide.png'});
 await page.waitForFunction(()=>{const t=document.querySelector('#world-time')?.textContent??'';return t>='15:00'&&t<'15:30';},{},{timeout:40000});assert((await page.locator('#tide-status').textContent())?.includes('Nước lên'));
 await page.waitForFunction(()=>document.querySelector('#world-time')?.getAttribute('data-phase')==='Bữa tối',{},{timeout:25000});await page.screenshot({path:'artifacts/world-clock-dinner-desktop.png'});
 await page.waitForFunction(()=>document.querySelector('#world-time')?.getAttribute('data-phase')==='Nghỉ ngơi',{},{timeout:20000});
 await page.waitForFunction(()=>Number(document.querySelector('#stat-day')?.textContent)>=2,{},{timeout:65000});runningMs+=Date.now()-began;await pause(true);const day=await save();assert.equal(day.island.tick,10);assert(Math.abs(runningMs-120000)<5000,JSON.stringify({runningMs,progress:day.island.clock.progressMs}));assert.equal(day.island.npcs.filter((n:any)=>n.isAlive).length,8);assert(day.island.sharedFood>0);await writeFile('artifacts/world-clock-browser-day-save.json',JSON.stringify(day));
 const absolute=(d:any)=>d.island.tick*12000+d.island.clock.progressMs;const before2=await save();await page.locator('.speed-btn[data-speed="2"]').click();await page.waitForTimeout(5000);await pause(true);const after2=await save(),twoDelta=absolute(after2)-absolute(before2);assert(Math.abs(twoDelta-10000)<1500,JSON.stringify({twoDelta}));
 await open();await page.setViewportSize({width:390,height:844});await page.locator('.tidal-panel').scrollIntoViewIfNeeded();await page.screenshot({path:'artifacts/world-clock-mobile.png'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);await writeFile('artifacts/world-clock-browser-result.json',JSON.stringify({oneRealDayAt1xMs:runningMs,hourAt1xMs:partial.island.clock.progressMs,pause3sFrozen:true,partialReload:true,restoredTime,realTide09to15:true,realDinner18to20:true,realNight20to06:true,secondDayTick:10,alive:8,food:day.island.sharedFood,speed2Elapsed5sSimulationMs:twoDelta,mobile:true,errors,failed},null,2));console.log('PASS real browser120s day / continuous5s hour / pause / partial save reload / actual09-15tide / 18-20dinner / night / x2 / 8alive / mobile / no errors.',runningMs,twoDelta);
 }catch(error){try{await page.screenshot({path:'artifacts/world-clock-ui-failure.png'});await close();await page.locator('#btn-save-local').click();const raw=await page.evaluate(()=>localStorage.getItem('dao_thien_nguyen_v2'));if(raw)await writeFile('artifacts/world-clock-ui-failure-save.json',raw);}catch{}throw error;}finally{await browser.close();server.close();}
}
main().catch(e=>{console.error(e);server.close();process.exitCode=1;});
