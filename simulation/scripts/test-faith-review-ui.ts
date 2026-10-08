import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE??'playwright');const root=path.resolve('web');
const server=createServer(async(req,res)=>{const file=path.resolve(root,'.'+new URL(req.url??'/','http://localhost').pathname.replace(/\/$/,'/index.html'));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}try{res.setHeader('content-type',({'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png'} as Record<string,string>)[path.extname(file)]??'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404).end();}});
async function main(){
 await new Promise<void>(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({channel:'msedge',headless:true}),page=await browser.newPage({viewport:{width:1440,height:1000}}),errors:string[]=[];page.on('pageerror',(e:Error)=>errors.push(e.message));
 const url=`http://127.0.0.1:${(server.address() as {port:number}).port}`;
 const close=async()=>{if(await page.locator('#panel-overlay').evaluate((e:HTMLElement)=>e.classList.contains('open')))await page.locator('#panel-close').click();await page.waitForTimeout(350);};
 const load=async(file:string)=>{const raw=await readFile(file,'utf8');await page.goto(url);await page.evaluate((raw:string)=>localStorage.setItem('dao_thien_nguyen_v2',raw),raw);await page.reload();await page.locator('#btn-resume-game').click();await page.locator('.era-roadmap').waitFor();await close();if(!(await page.locator('#btn-pause').evaluate((e:HTMLElement)=>e.classList.contains('active'))))await page.locator('#btn-pause').click();await page.waitForTimeout(350);};
 try{
  await load('artifacts/faith-blessing-save.json');await page.locator('#faith-hud').click();await page.waitForTimeout(350);assert.match(await page.locator('#blessing-status').innerText(),/Ban Phước/);await page.screenshot({path:'artifacts/faith-blessing-desktop.png'});await close();await page.screenshot({path:'artifacts/faith-halo-desktop.png'});
  await load('artifacts/faith-exhaustion-save.json');await page.setViewportSize({width:390,height:844});await page.waitForTimeout(350);const badge=await page.locator('#manual-badge').boundingBox(),hud=await page.locator('#faith-hud').boundingBox();assert(badge.x>=0&&badge.x+badge.width<=390);assert(badge.x+badge.width<=hud.x||hud.x+hud.width<=badge.x||badge.y+badge.height<=hud.y||hud.y+hud.height<=badge.y,'Faith and the instruction badge must not overlap');await page.screenshot({path:'artifacts/faith-hud-mobile.png'});await page.locator('#faith-hud').click();await page.waitForTimeout(350);assert(await page.locator('#cast-blessing').isDisabled());assert.match(await page.locator('#blessing-status').innerText(),/Kiệt sức/);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:'artifacts/faith-exhaustion-mobile.png'});assert.deepEqual(errors,[]);console.log('PASS: real saved Blessing/exhaustion, golden HUD and instruction badge do not overlap, readable desktop/mobile panels, no overflow or runtime errors.');
 }finally{await browser.close();await new Promise<void>(r=>server.close(()=>r()));}
}
void main().catch(e=>{console.error(e);server.close();process.exitCode=1;});
