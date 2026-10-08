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
    await page.goto(`http://127.0.0.1:${(server.address() as {port:number}).port}`);await page.locator('[data-size="small"]').click();await page.locator('#start-seed').fill('321');await page.locator('#start-pop-slider').fill('5');await page.locator('#btn-start-game').click();await page.locator('[data-creature="founder"]').click();
    const map=generateWorldMap(50,35,321),box=await page.locator('#game-canvas').boundingBox(),zoom=Math.min(box.width/800,box.height/560)*.88;
    const point=(x:number,y:number)=>({x:box.x+box.width/2+(x-25+.5)*16*zoom,y:box.y+box.height/2+(y-17.5+.5)*16*zoom});
    const founders=map.landTiles.filter(t=>t.x>=17&&t.x<=22&&t.y>=14&&t.y<=20).slice(0,5);for(const t of founders){const p=point(t.x,t.y);await page.mouse.click(p.x,p.y);}
    await page.locator('.speed-btn[data-speed="2"]').click();await page.waitForFunction(()=>Number(document.querySelector('#stat-day')?.textContent)>=31,undefined,{timeout:110000});await pause(true);
    let state=await save();assert.equal(state.island.npcs.filter((n:any)=>n.isAlive).length,5);assert(state.island.sharedFood>0);assert(state.island.wood>=6&&state.island.stone>=2);assert(state.island.workforce.enabled);assert(state.island.npcs.every((n:any)=>n.laborMode==='auto'&&n.attributes));
    await page.locator('#sb-population').click();await page.locator('#auto-claim-toggle').uncheck();assert.equal((await save()).island.workforce.enabled,false);await page.locator('#sb-population').click();await page.locator('#auto-claim-toggle').check();
    const manualId=await page.locator('.labor-role-select').last().getAttribute('data-npc');await page.locator('.labor-role-select').last().selectOption('stone');assert.equal(await page.locator('.labor-mode-select').last().inputValue(),'manual');
    await close();const day=Number(await page.locator('#stat-day').innerText());await pause(false);await page.waitForFunction((d:number)=>Number(document.querySelector('#stat-day')?.textContent)>=d,day+3,{timeout:20000});await pause(true);state=await save();assert.equal(state.island.npcs.find((n:any)=>n.id===manualId).laborRole,'stone');assert.equal(state.island.npcs.find((n:any)=>n.id===manualId).laborMode,'manual');
    await page.locator('#sb-population').click();await page.locator(`.labor-mode-select[data-npc="${manualId}"]`).selectOption('auto');await close();state=await save();assert.equal(state.island.npcs.find((n:any)=>n.id===manualId).laborMode,'auto');
    await page.locator('#btn-build').click();const occupied=state.island.npcs.filter((n:any)=>n.isAlive&&n.position).map((n:any)=>`${n.position.tileX},${n.position.tileY}`),site=map.landTiles.find(t=>t.x>=18&&t.x<=25&&t.y>=15&&t.y<=23&&map.tiles[t.y][t.x]==='grass'&&!occupied.includes(`${t.x},${t.y}`)&&!(t.x===founders[0].x&&t.y===founders[0].y))!;assert(site);
    await page.locator('[data-build="study_table"]').click();let p=point(site.x,site.y);await page.mouse.click(p.x,p.y);await page.locator('#bi-select-npc').selectOption(manualId);await page.locator('#bi-btn-assign').click();await pause(false);await page.waitForFunction(()=>document.querySelector('.bi-state')?.textContent==='Hoàn thành',undefined,{timeout:45000});await pause(true);await page.locator('#bi-close').click();state=await save();assert.equal(state.island.npcs.find((n:any)=>n.id===manualId).laborMode,'auto');assert.equal(state.island.buildings[0].workers.length,0,'Completed table releases builder');
    if(state.island.wood<5){await pause(false);await page.waitForFunction(()=>Number(document.querySelector('#stat-wood')?.textContent)>=5,undefined,{timeout:45000});await pause(true);}
    await page.locator('#sb-research').click();await page.locator('.tc-research-btn[data-tech="fire"]').click();await close();await pause(false);await page.waitForFunction(()=> (globalThis as any).__islandNpcs.some((n:any)=>n.researching),undefined,{timeout:5000});await pause(true);state=await save();const researcherId=state.island.civilization.research.researcherId;const start=state.island.civilization.research.workTicks;
    await pause(false);const target=Number(await page.locator('#stat-day').innerText())+7;await page.waitForFunction((d:number)=>Number(document.querySelector('#stat-day')?.textContent)>=d,target,{timeout:35000});await pause(true);state=await save();assert(state.island.civilization.unlocks.includes('fire'));assert.equal(state.island.npcs.filter((n:any)=>n.isAlive).length,5);assert(state.island.sharedFood>0);assert.equal(state.island.npcs.find((n:any)=>n.id===researcherId).researching,false);
    await writeFile('artifacts/workforce-played-save.json',JSON.stringify(state));await page.locator('#sb-population').click();await page.waitForTimeout(400);await page.screenshot({path:'artifacts/workforce-desktop.png'});
    await page.setViewportSize({width:390,height:844});await page.waitForTimeout(400);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert(await page.locator('#auto-claim-toggle').isVisible());assert.equal(await page.locator('.npc-attributes').count(),5);await page.screenshot({path:'artifacts/workforce-mobile.png'});
    await close();const before=await save();await page.reload();await page.locator('#btn-resume-game').click();await page.locator('.era-roadmap').waitFor();await close();const after=await save();assert.equal(after.island.tick,before.island.tick);assert.deepEqual(after.island.workforce,before.island.workforce);assert.deepEqual(after.island.npcs.map((n:any)=>[n.attributes,n.laborMode,n.cargo]),before.island.npcs.map((n:any)=>[n.attributes,n.laborMode,n.cargo]));
    assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);console.log('PASS: fresh 5-person village auto survives 30 days without manual roles, toggle/manual lock/re-enable, real table/build/research/return, save and mobile.');
  }catch(e){await pause(true);await writeFile('artifacts/workforce-ui-failure-save.json',JSON.stringify(await save()));await page.screenshot({path:'artifacts/workforce-ui-failure.png'});throw e;}
  finally{await browser.close();await new Promise<void>(resolve=>server.close(()=>resolve()));}
}
void main().catch(e=>{console.error(e);server.close();process.exitCode=1;});
