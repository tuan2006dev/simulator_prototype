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
  const pause=async(on:boolean)=>{if((await page.locator('#btn-pause').evaluate((e:HTMLElement)=>e.classList.contains('active')))!==on)await page.locator('#btn-pause').click();};
  const save=async()=>{await close();await page.locator('#btn-save-local').click();return page.evaluate(()=>JSON.parse(localStorage.getItem('dao_thien_nguyen_v2')!));};
  try{
    const raw=await readFile('artifacts/opening-played-save.json','utf8');
    await page.goto(`http://127.0.0.1:${(server.address() as {port:number}).port}`);await page.evaluate((raw:string)=>localStorage.setItem('dao_thien_nguyen_v2',raw),raw);await page.reload();await page.locator('#btn-resume-game').click();await page.locator('.era-roadmap').waitFor();await close();
    const before=await save();await page.locator('.speed-btn[data-speed="2"]').click();await pause(false);
    await page.waitForFunction((target:number)=>Number(document.querySelector('#stat-day')?.textContent)>=target,Math.floor(before.island.tick/10)+11,{timeout:60000});await pause(true);
    const after=await save();assert(after.island.tick>=before.island.tick+90);assert.equal(after.island.npcs.filter((n:any)=>n.isAlive).length,5);assert(after.island.sharedFood>0);assert(after.island.buildings.find((b:any)=>b.type==='fishing_dock').productionBatches>before.island.buildings.find((b:any)=>b.type==='fishing_dock').productionBatches);
    await writeFile('artifacts/opening-stable-save.json',JSON.stringify(after));await page.screenshot({path:'artifacts/opening-stable-desktop.png'});
    await page.locator('#btn-build').click();assert.match(await page.locator('.opening-checklist').innerText(),/Bến câu đã có mẻ cá/);await page.waitForTimeout(400);await page.screenshot({path:'artifacts/opening-checklist-desktop.png'});
    await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.waitForTimeout(400);await page.screenshot({path:'artifacts/opening-checklist-mobile.png'});
    assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);console.log('PASS: played village resumes and lives 10 further browser days, positive food, continued real fishing, final checklist and desktop/mobile.');
  }finally{await browser.close();await new Promise<void>(resolve=>server.close(()=>resolve()));}
}
void main().catch(e=>{console.error(e);server.close();process.exitCode=1;});
