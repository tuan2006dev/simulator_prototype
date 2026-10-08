import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { ICON_ART, SYMBOL_ICONS } from '../src/ui/GameIcons';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE??'playwright');
const root=path.resolve('web');
const server=createServer(async(req,res)=>{
  const file=path.resolve(root,'.'+new URL(req.url??'/','http://localhost').pathname.replace(/\/$/,'/index.html'));
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  try{res.setHeader('content-type',({'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png'} as Record<string,string>)[path.extname(file)]??'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404).end();}
});
async function main(){
  await mkdir('artifacts',{recursive:true});
  await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch({channel:'msedge',headless:true});
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors:string[]=[],failed:string[]=[];
  page.on('pageerror',(e:Error)=>errors.push(e.message));
  page.on('response',(r:any)=>{if(r.status()>=400)failed.push(r.url());});
  const url=`http://127.0.0.1:${(server.address() as {port:number}).port}`;
  const loaded=async()=>page.waitForFunction(()=>[...document.querySelectorAll<HTMLImageElement>('.game-icon')].every(i=>i.complete&&i.naturalWidth>0));
  const assertCustom=async()=>{
    await loaded();
    const leftovers=await page.evaluate((symbols:string[])=>{
      const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),remaining:string[]=[];
      while(walker.nextNode()) {
        const n=walker.currentNode as Text,p=n.parentElement;
        if(!p||p.closest('script,style,option,textarea,[data-keep-symbols]')||!p.getClientRects().length)continue;
        if(symbols.some(s=>n.data.includes(s)) || /\p{Extended_Pictographic}/u.test(n.data))remaining.push(n.data);
      }
      return remaining;
    },Object.keys(SYMBOL_ICONS));
    assert.deepEqual(leftovers,[],'Visible UI must use illustrated assets instead of emoji');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  };
  try{
    await page.goto(url+'/icon-gallery.html');
    await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth>0));
    assert.equal(await page.locator('article').count(),Object.keys(ICON_ART).length);
    await page.screenshot({path:'artifacts/game-icons-gallery.png',fullPage:true});
    await page.goto(url);await assertCustom();
    await page.screenshot({path:'artifacts/game-icons-start.png'});
    const raw=await readFile('artifacts/daily-life-ui-save.json','utf8');
    await page.evaluate((raw:string)=>localStorage.setItem('dao_thien_nguyen_v2',raw),raw);
    await page.reload();await page.locator('#btn-resume-game').click();await page.locator('.era-roadmap').waitFor();
    await page.locator('#panel-close').click();await assertCustom();
    assert.equal(await page.locator('#chip-copper .game-icon').getAttribute('data-game-icon'),'copper');
    assert.equal(await page.locator('#chip-pottery .game-icon').getAttribute('data-game-icon'),'pottery');
    assert.equal(await page.locator('#chip-fiber .game-icon').getAttribute('data-game-icon'),'fiber');
    await page.screenshot({path:'artifacts/game-icons-world.png'});
    for(const id of ['btn-build','btn-research','btn-creatures','btn-genealogy','btn-settings','btn-military','sb-population','sb-terrain','sb-resources','sb-quests']){
      await page.locator('#'+id).click();await assertCustom();
      if(id==='btn-research'){
        assert.equal(await page.locator('[data-tech="ceramics"] .tc-icon .game-icon').getAttribute('data-game-icon'),'pottery');
        assert.equal(await page.locator('[data-tech="copper_smelting"] .tc-icon .game-icon').getAttribute('data-game-icon'),'copper');
        await page.screenshot({path:'artifacts/game-icons-research.png'});
      }
      await page.locator('#panel-close').click();
    }
    await page.locator('#btn-save-local').click();
    const saved=await page.evaluate(()=>localStorage.getItem('dao_thien_nguyen_v2'));
    assert(!saved!.includes('<img'),'Presentation assets must never enter save data');
    await page.setViewportSize({width:390,height:844});await assertCustom();
    await page.screenshot({path:'artifacts/game-icons-mobile.png'});
    await page.locator('#btn-research').click();await assertCustom();
    await page.screenshot({path:'artifacts/game-icons-research-mobile.png'});
    await page.locator('#panel-close').click();
    await page.locator('.speed-btn[data-speed="2"]').click();
    const before=Number(await page.locator('#stat-day').innerText());
    await page.waitForFunction((day:number)=>Number(document.querySelector('#stat-day')?.textContent)>day,before,{timeout:15000});
    await assertCustom();assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
    console.log(`PASS: ${Object.keys(ICON_ART).length} assets loaded; dynamic panels, unique resource/technology symbols, save integrity, simulation controls and desktop/mobile layouts.`);
  }catch(e){await page.screenshot({path:'artifacts/game-icons-failure.png'});throw e;}
  finally{await browser.close();await new Promise<void>(resolve=>server.close(()=>resolve()));}
}
void main().catch(e=>{console.error(e);server.close();process.exitCode=1;});
