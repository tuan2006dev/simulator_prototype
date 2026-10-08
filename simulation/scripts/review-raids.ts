import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE??'playwright');const root=path.resolve('web');
const server=createServer(async(req,res)=>{const file=path.resolve(root,'.'+new URL(req.url??'/','http://localhost').pathname.replace(/\/$/,'/index.html'));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}try{res.setHeader('content-type',({'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png'} as Record<string,string>)[path.extname(file)]??'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404).end();}});
async function main(){
 await mkdir('artifacts',{recursive:true});await new Promise<void>(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({channel:'msedge',headless:true}),page=await browser.newPage({viewport:{width:1440,height:1000}}),errors:string[]=[],failed:string[]=[];page.on('pageerror',(e:Error)=>errors.push(e.message));page.on('response',(r:any)=>{if(r.status()>=400)failed.push(r.url());});
 const url=`http://127.0.0.1:${(server.address() as {port:number}).port}`;
 const close=async()=>{if(await page.locator('#panel-overlay').evaluate((e:HTMLElement)=>e.classList.contains('open')))await page.locator('#panel-close').click();await page.waitForTimeout(350);};
 const pause=async(on:boolean)=>{await close();if((await page.locator('#btn-pause').evaluate((e:HTMLElement)=>e.classList.contains('active')))!==on)await page.locator('#btn-pause').click();};
 const save=async()=>{await close();await page.locator('#btn-save-local').click();return page.evaluate(()=>JSON.parse(localStorage.getItem('dao_thien_nguyen_v2')!));};
 const load=async(raw:string)=>{await page.goto(url);await page.evaluate((raw:string)=>localStorage.setItem('dao_thien_nguyen_v2',raw),raw);await page.reload();await page.locator('#btn-resume-game').click();await page.locator('.era-roadmap').waitFor();await pause(true);};
 try{const raw=await readFile('artifacts/raids-combat-save.json','utf8');await load(raw);await page.locator('[data-panel="military"]').click();await page.waitForTimeout(500);await page.screenshot({path:'artifacts/raids-combat-desktop.png'});await close();await page.screenshot({path:'artifacts/raids-combat-island.png'});assert.deepEqual(errors,[]);console.log('PASS: saved combat panel and map review screenshots.');}finally{await browser.close();await new Promise<void>(r=>server.close(()=>r()));}}
void main().catch(e=>{console.error(e);server.close();process.exitCode=1;});
