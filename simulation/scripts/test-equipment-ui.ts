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
    const raw=await readFile('artifacts/workforce-played-save.json','utf8');await page.goto(`http://127.0.0.1:${(server.address() as {port:number}).port}`);await page.evaluate((raw:string)=>localStorage.setItem('dao_thien_nguyen_v2',raw),raw);await page.reload();await page.locator('#btn-resume-game').click();await page.locator('.era-roadmap').waitFor();await close();
    await page.locator('#sb-research').click();await page.locator('.tc-research-btn[data-tech="stone_tools"]').click();await close();let day=Number(await page.locator('#stat-day').innerText());await page.locator('.speed-btn[data-speed="2"]').click();await pause(false);await page.waitForFunction((d:number)=>Number(document.querySelector('#stat-day')?.textContent)>=d,day+7,{timeout:35000});await pause(true);let state=await save();assert(state.island.civilization.unlocks.includes('stone_tools'));
    await page.locator('#sb-population').click();const crafterId=state.island.npcs[0].id,targetId=state.island.npcs[1].id;await page.locator(`.labor-role-select[data-npc="${crafterId}"]`).selectOption('idle');
    for(const n of state.island.npcs)await page.locator(`.tool-choice[data-npc="${n.id}"]`).selectOption('none');
    await close();await pause(false);await page.waitForFunction((id:string)=>!(globalThis as any).__islandNpcs.find((n:any)=>n.id===id).cargo,crafterId,{timeout:45000});await pause(true);
    for(const kind of ['axe','pickaxe','fishing_rod']){
      await close();state=await save();if(state.island.wood<6||state.island.stone<3){await pause(false);await page.waitForFunction(()=>Number(document.querySelector('#stat-wood')?.textContent)>=6&&Number(document.querySelector('#stat-stone')?.textContent)>=3,undefined,{timeout:60000});await pause(true);}
      await page.locator('#sb-population').click();await page.locator(`[data-craft-tool="${kind}"]`).click();state=await save();assert.equal(state.island.equipment.order.kind,kind);await pause(false);await page.locator('#sb-population').click();
      await page.waitForFunction((kind:string)=>Number(document.querySelector(`[data-tool-stock="${kind}"]`)?.textContent)===1,kind,{timeout:45000});await pause(true);await close();state=await save();assert.equal(state.island.equipment.crafted[kind],1);console.log('Crafted',kind);
    }
    await page.locator('#sb-population').click();await page.locator(`.labor-role-select[data-npc="${targetId}"]`).selectOption('wood');await page.locator(`.tool-choice[data-npc="${targetId}"]`).selectOption('axe');await close();await pause(false);await page.waitForFunction((id:string)=>(globalThis as any).__islandNpcs.find((n:any)=>n.id===id).equippedTool==='axe',targetId,{timeout:45000});await pause(true);state=await save();assert.equal(state.island.equipment.stock.axe,0);assert.equal(state.island.npcs.find((n:any)=>n.id===targetId).toolChoice,'axe');
    await page.reload();await page.locator('#btn-resume-game').click();await page.locator('.era-roadmap').waitFor();await close();let loaded=await save();assert.deepEqual(loaded.island.equipment,state.island.equipment);assert.equal(loaded.island.npcs.find((n:any)=>n.id===targetId).equippedTool,'axe');
    await pause(false);await page.waitForFunction((id:string)=>(globalThis as any).__islandNpcs.find((n:any)=>n.id===id).cargo?.wood>0,targetId,{timeout:45000});await pause(true);const carrying=await save();assert(carrying.island.npcs.find((n:any)=>n.id===targetId).cargo.wood<=30);
    await page.locator('#sb-population').click();await page.locator(`.labor-role-select[data-npc="${targetId}"]`).selectOption('stone');await page.locator(`.tool-choice[data-npc="${targetId}"]`).selectOption('auto');await close();loaded=await save();assert.equal(loaded.island.npcs.find((n:any)=>n.id===targetId).equippedTool,'axe');assert.deepEqual(loaded.island.npcs.find((n:any)=>n.id===targetId).cargo,carrying.island.npcs.find((n:any)=>n.id===targetId).cargo);
    await pause(false);await page.waitForFunction((id:string)=>(globalThis as any).__islandNpcs.find((n:any)=>n.id===id).equippedTool==='pickaxe',targetId,{timeout:45000});await pause(true);state=await save();assert.equal(state.island.equipment.stock.axe,1);assert.equal(state.island.equipment.stock.pickaxe,0);assert.equal(state.island.npcs.filter((n:any)=>n.isAlive).length,5);
    await writeFile('artifacts/equipment-played-save.json',JSON.stringify(state));await page.locator('#sb-population').click();await page.locator('.equipment-controls').scrollIntoViewIfNeeded();await page.waitForTimeout(400);await page.screenshot({path:'artifacts/equipment-desktop.png'});await page.locator('.equipment-people').scrollIntoViewIfNeeded();await page.screenshot({path:'artifacts/equipment-bags-desktop.png'});
    await page.setViewportSize({width:390,height:844});await page.locator('.equipment-people').scrollIntoViewIfNeeded();await page.waitForTimeout(400);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:'artifacts/equipment-mobile.png'});
    assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);console.log('PASS: real stone tools research/crafting all three tools, manual equipment/physical pickup, save mid-equipment, carrying/role change/automatic exchange, bags and mobile.');
  }catch(e){await pause(true);await writeFile('artifacts/equipment-ui-failure-save.json',JSON.stringify(await save()));await page.screenshot({path:'artifacts/equipment-ui-failure.png'});throw e;}
  finally{await browser.close();await new Promise<void>(resolve=>server.close(()=>resolve()));}
}
void main().catch(e=>{console.error(e);server.close();process.exitCode=1;});
