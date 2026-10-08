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
 await load(await readFile('artifacts/exploration-midtrip-save.json','utf8'));const mid=await save();assert(mid.island.exploration.active);await page.screenshot({path:'artifacts/exploration-midtrip-world.png'});
 await load(await readFile('artifacts/exploration-played-save.json','utf8'));await open();assert.equal(await page.locator('[data-explore-done]').getAttribute('data-explore-done'),'3');await page.screenshot({path:'artifacts/exploration-complete-desktop.png'});await page.setViewportSize({width:390,height:844});await page.locator('.exploration-panel').scrollIntoViewIfNeeded();await page.screenshot({path:'artifacts/exploration-mobile.png'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 const raw=await readFile('artifacts/anomaly-played-save.json','utf8'),original=JSON.parse(raw);await page.setViewportSize({width:1440,height:1000});await load(raw);const legacy=await save();assert(legacy.island.exploration.legacy);assert.equal(legacy.island.exploration.discovered.values.length,legacy.map.width*legacy.map.height);for(const [key,value] of Object.entries(original.island.civilization.inventory))assert.equal(legacy.island.civilization.inventory[key],value);for(const key of Object.keys(legacy.island.civilization.inventory))if(!(key in original.island.civilization.inventory))assert.equal(legacy.island.civilization.inventory[key],0);assert.equal(legacy.island.npcs.filter((n:any)=>n.isAlive).length,50);assert.equal(legacy.island.civilization.anomalyBranch,'hightech');assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);console.log('PASS final build browser smoke: midtrip restore/fog screenshot,3mission steps/mobile, legacy50alive/Hightech/full-known map/inventory unchanged/no errors.');
 }finally{await browser.close();server.close();}
}
main().catch(e=>{console.error(e);server.close();process.exitCode=1;});
