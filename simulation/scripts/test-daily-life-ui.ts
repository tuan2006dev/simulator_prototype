import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { generateWorldMap } from '../src/renderer/WorldMap';
const require=createRequire(import.meta.url), {chromium}=require(process.env.PLAYWRIGHT_MODULE??'playwright');
const root=path.resolve('web');
const server=createServer(async(req,res)=>{
  const file=path.resolve(root,'.'+new URL(req.url??'/','http://localhost').pathname.replace(/\/$/,'/index.html'));
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  try{res.setHeader('content-type',({'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png'} as Record<string,string>)[path.extname(file)]??'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404).end();}
});
async function main(){
  await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch({channel:'msedge',headless:true});
  const page=await browser.newPage({viewport:{width:1440,height:1000}}), errors:string[]=[];
  page.on('pageerror',(e:Error)=>errors.push(e.message));
  const close=async()=>{if((await page.locator('#panel-overlay').getAttribute('class'))?.includes('open'))await page.locator('#panel-close').click();};
  const save=async()=>{await close();await page.locator('#btn-save-local').click();return page.evaluate(()=>JSON.parse(localStorage.getItem('dao_thien_nguyen_v2')!));};
  try{
    await mkdir('artifacts',{recursive:true});
    await page.goto(`http://127.0.0.1:${(server.address() as {port:number}).port}`);
    await page.locator('[data-size="small"]').click();await page.locator('#start-seed').fill('321');await page.locator('#start-pop-slider').fill('5');await page.locator('#btn-start-game').click();
    await page.locator('[data-creature="founder"]').click();
    const map=generateWorldMap(50,35,321),box=await page.locator('#game-canvas').boundingBox();
    const zoom=Math.min(box.width/800,box.height/560)*.88;
    const point=(x:number,y:number)=>({x:box.x+box.width/2+(x-25+.5)*16*zoom,y:box.y+box.height/2+(y-17.5+.5)*16*zoom});
    for(const tile of map.landTiles.filter(t=>t.x>=17&&t.x<=22&&t.y>=14&&t.y<=20).slice(0,5)){const p=point(tile.x,tile.y);await page.mouse.click(p.x,p.y);}
    await page.locator('#mc-fraction').filter({hasText:'Bước 1'}).waitFor();
    await close();await page.locator('.speed-btn[data-speed="2"]').click();
    await page.waitForFunction(()=>Number(document.querySelector('#stat-day')?.textContent)>=6,undefined,{timeout:30000});
    await page.waitForFunction(()=>document.querySelector('#world-time')?.getAttribute('data-phase')==='Nghỉ ngơi' && (globalThis as any).__islandNpcs?.some((n:any)=>n.status==='sleeping'),undefined,{timeout:20000});
    await page.locator('#btn-pause').click();
    const saved=await save();assert(saved.island.dailyLife.campfire);assert.equal(saved.island.npcs.filter((n:any)=>n.isAlive).length,5);
    assert(saved.island.npcs.every((n:any)=>n.health>=0&&n.health<=100));assert(saved.island.npcs.some((n:any)=>n.lastDinnerDay!==undefined));
    const n=saved.island.npcs.find((n:any)=>n.isAlive&&n.position);const p=point(n.position.tileX,n.position.tileY);await page.mouse.click(p.x,p.y);
    await page.locator('#inspector-panel').filter({hasText:'Sức khỏe'}).waitFor();
    assert.match(await page.locator('#inspector-panel').innerText(),/Đồ ăn mang theo/);
    assert.equal(await page.locator('#inspector-empty').isVisible(),false);
    assert.equal(await page.locator('#inspector-panel .inventory-grid .inventory-slot').count(),4);
    assert(await page.locator('#inspector-panel .inventory-slot img').evaluateAll((images:HTMLImageElement[])=>images.every(image=>image.complete&&image.naturalWidth>0)));
    await page.locator('#world-time').click(); // close the contextual action menu
    await page.screenshot({path:'artifacts/daily-life-night.png'});
    await page.waitForTimeout(1000);const paused=await save();assert.equal(paused.island.tick,saved.island.tick);assert.equal(paused.island.sharedFood,saved.island.sharedFood,'Pause freezes meals and work');
    await writeFile('artifacts/daily-life-ui-save.json',JSON.stringify(paused));
    await page.setViewportSize({width:390,height:844});
    assert(await page.locator('#world-time').isVisible());assert(await page.locator('#inspector-panel').isVisible());
    assert.equal(await page.locator('#inspector-panel').evaluate((el:HTMLElement)=>el.scrollWidth>el.clientWidth),false);
    await page.screenshot({path:'artifacts/daily-life-health-mobile.png'});
    await page.setViewportSize({width:1440,height:1000});
    await page.reload();await page.locator('#btn-resume-game').click();await page.locator('.era-roadmap').waitFor();await close();
    const reloaded=await save();assert.deepEqual(reloaded.island.dailyLife,saved.island.dailyLife);assert.equal(reloaded.island.tick,saved.island.tick);assert.deepEqual(reloaded.island.npcs.map((n:any)=>[n.id,n.health,n.lastDinnerDay,n.privateFood]),saved.island.npcs.map((n:any)=>[n.id,n.health,n.lastDinnerDay,n.privateFood]));
    await page.setViewportSize({width:390,height:844});assert(await page.locator('#world-time').isVisible());
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await page.screenshot({path:'artifacts/daily-life-mobile.png'});
    await page.locator('#btn-pause').click();await page.waitForFunction((t:number)=>(globalThis as any).__islandNpcs?.some((n:any)=>n.status==='working')&&Number(document.querySelector('#stat-day')?.textContent)>Math.floor(t/10)+1,saved.island.tick,{timeout:20000});
    assert.deepEqual(errors,[]);console.log('PASS: fresh browser village, dinner/sleep/health, inspector, pause conservation, save/resume, mobile clock/layout and work resumption.');
  }catch(e){await page.screenshot({path:'artifacts/daily-life-ui-failure.png'});throw e;}
  finally{await browser.close();await new Promise<void>(resolve=>server.close(()=>resolve()));}
}
void main().catch(e=>{console.error(e);server.close();process.exitCode=1;});
