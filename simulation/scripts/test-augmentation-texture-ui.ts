import {characterSVG,characterLook} from '../src/renderer/CharacterTextures';
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
 await page.addInitScript(()=>{const original=CanvasRenderingContext2D.prototype.drawImage;const draws:Record<string,{x:number;y:number;w:number;h:number}>={};(window as any).characterDraws=draws;CanvasRenderingContext2D.prototype.drawImage=function(...args:any[]){const img=args[0] as HTMLImageElement;if(img?.src?.includes('viewBox%3D%220%200%2024%2036%22')&&args.length===5)draws[img.src]={x:args[1],y:args[2],w:args[3],h:args[4]};return (original as any).apply(this,args);};});

 const raw=await readFile('artifacts/augmentation-equipped-save.json','utf8'),data=JSON.parse(raw),person=data.island.npcs.find((n:any)=>n.adaptation);await load(raw);await close();for(let i=0;i<4;i++)await page.locator('#btn-zoom-in').click();await page.waitForTimeout(1200);const sources=[];for(const direction of ['south','north','east','west'] as const)for(const pose of ['idle','walk','work','sleep','fight'] as const)for(let f=0;f<2;f++)sources.push('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(characterSVG(characterLook(person),'anomaly',direction,pose,f)));const draw=await page.evaluate((sources:string[])=>{for(const src of sources)if((window as any).characterDraws[src])return (window as any).characterDraws[src];return null;},sources);assert(draw,'Custom brace variant actually rendered on game canvas');await page.screenshot({path:'artifacts/augmentation-texture-in-game.png'});assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);console.log('PASS actual Hightech brace rendered through animated game canvas, preserved chibi silhouette.');
 }finally{await browser.close();server.close();}
}
main().catch(e=>{console.error(e);server.close();process.exitCode=1;});
