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
    await page.goto(`http://127.0.0.1:${(server.address() as {port:number}).port}`);
    await page.locator('[data-size="small"]').click();await page.locator('#start-seed').fill('321');await page.locator('#start-pop-slider').fill('8');await page.locator('#btn-start-game').click();
    await page.locator('[data-creature="founder"]').click();
    const map=generateWorldMap(50,35,321),box=await page.locator('#game-canvas').boundingBox(),zoom=Math.min(box.width/800,box.height/560)*.88;
    const point=(x:number,y:number)=>({x:box.x+box.width/2+(x-25+.5)*16*zoom,y:box.y+box.height/2+(y-17.5+.5)*16*zoom});
    const founders=map.landTiles.filter(t=>t.x>=17&&t.x<=22&&t.y>=14&&t.y<=20).slice(0,8);
    for(const t of founders){const p=point(t.x,t.y);await page.mouse.click(p.x,p.y);}
    await page.locator('#mc-fraction').filter({hasText:'Bước 1'}).waitFor();await page.locator('#sb-population').click();
    await page.locator('.labor-role-select').nth(5).selectOption('wood');
    const builderId=await page.locator('.labor-role-select').last().getAttribute('data-npc');
    await close();await page.locator('.speed-btn[data-speed="2"]').click();
    await page.waitForFunction(()=>Number(document.querySelector('#stat-wood')?.textContent)>=14&&Number(document.querySelector('#stat-stone')?.textContent)>=2,undefined,{timeout:90000});
    const sites:{x:number;y:number}[]=[];
    const build=async(type:string)=>{
      await close();if(await page.locator('#building-inspector').isVisible())await page.locator('#bi-close').click();
      await pause(true);await page.locator('#btn-build').click();assert.equal(await page.locator('.build-texture').count(),25);
      await page.waitForFunction(()=>[...document.querySelectorAll<HTMLImageElement>('.build-texture')].every(i=>i.complete&&i.naturalWidth>0));
      const occupied=await page.evaluate(()=>(globalThis as any).__islandNpcs.filter((n:any)=>n.isAlive&&n.position).map((n:any)=>`${n.position.tileX},${n.position.tileY}`));
      const t=map.landTiles.find(t=>t.x>=18&&t.x<=26&&t.y>=15&&t.y<=23&&map.tiles[t.y][t.x]==='grass'&&!occupied.includes(`${t.x},${t.y}`)&&!sites.some(s=>s.x===t.x&&s.y===t.y)&&!(t.x===founders[0].x&&t.y===founders[0].y))!;
      assert(t);sites.push(t);await page.locator(`[data-build="${type}"]`).click();const p=point(t.x,t.y);await page.mouse.click(p.x,p.y);
      await page.locator('#building-inspector').waitFor({state:'visible'});assert.match(await page.locator('.bi-level').innerText(),/Cấp 1 \/ 1/);
      await page.locator('#bi-select-npc').selectOption(builderId);await page.locator('#bi-btn-assign').click();await pause(false);
      await page.waitForFunction(()=>document.querySelector('.bi-state')?.textContent==='Hoàn thành',undefined,{timeout:45000});
      await pause(true);assert.equal(await page.locator('#bi-upgrade').count(),0);await page.locator('#bi-close').click();
    };
    await build('tent');
    await pause(false);await page.waitForFunction(()=>Number(document.querySelector('#stat-wood')?.textContent)>=6,undefined,{timeout:60000});await build('stockpile');
    for(let i=0;i<2;i++){await pause(false);await page.waitForFunction(()=>Number(document.querySelector('#stat-wood')?.textContent)>=8,undefined,{timeout:60000});await build('tent');}
    assert.match(await page.locator('#settlement-shelter').innerText(),/9 chỗ ngủ \/ 8 dân/);
    await pause(false);await page.waitForFunction(()=>(globalThis as any).__islandNpcs.some((n:any)=>n.sleepSite&&n.status==='sleeping')&&document.querySelector('#world-time')?.textContent==='01:12',undefined,{timeout:30000});await pause(true);
    const before=await save();assert.equal(before.island.buildings.filter((b:any)=>b.type==='tent'&&b.complete).length,3);assert(before.island.dailyLife.campfire.fuel>=0);assert(before.island.npcs.some((n:any)=>n.sleepSite));
    assert.equal(before.island.npcs.filter((n:any)=>n.isAlive).length,8);assert.equal(before.island.civilization.unlocks.length,0,'Starter buildings need no research');
    await page.screenshot({path:'artifacts/settlement-desktop.png'});await writeFile('artifacts/settlement-played-save.json',JSON.stringify(before));
    await page.reload();await page.locator('#btn-resume-game').click();await page.locator('.era-roadmap').waitFor();await close();const after=await save();
    assert.equal(after.island.tick,before.island.tick);assert.deepEqual(after.island.dailyLife,before.island.dailyLife);assert.deepEqual(after.island.npcs.map((n:any)=>n.cargo),before.island.npcs.map((n:any)=>n.cargo));
    await page.setViewportSize({width:390,height:844});assert(await page.locator('#settlement-fire').isVisible());assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await page.screenshot({path:'artifacts/settlement-mobile.png'});await page.locator('#btn-build').click();await page.screenshot({path:'artifacts/settlement-build-mobile.png'});
    assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);console.log('PASS: fresh village with real harvested resources, three tents/stockpile and workers, sleep/fuel/guidance, save/resume, textures and desktop/mobile.');
  }catch(e){await page.screenshot({path:'artifacts/settlement-ui-failure.png'});throw e;}
  finally{await browser.close();await new Promise<void>(resolve=>server.close(()=>resolve()));}
}
void main().catch(e=>{console.error(e);server.close();process.exitCode=1;});
