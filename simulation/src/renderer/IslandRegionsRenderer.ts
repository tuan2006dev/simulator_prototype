import type {Island} from '../core/types';
import type {WorldMap} from './WorldMap';
import type {Camera} from './Camera';
import {lowTide} from '../core/TidalManager';
export function drawTidalGround(ctx:CanvasRenderingContext2D,map:WorldMap,cam:Camera,w:number,h:number,s?:Island):void{
 for(const p of map.causeway?.tiles??[]){
  if(s?.exploration&&!s.exploration.discovered.has(`${p.x},${p.y}`))continue;
  const x=w/2+((p.x-map.width/2+.5)*16-cam.x)*cam.zoom,y=h/2+((p.y-map.height/2+.5)*16-cam.y)*cam.zoom,size=16*cam.zoom,low=lowTide(s?.tick??0,s?.clock?.progressMs??0);
  ctx.save();ctx.globalAlpha=low?1:.35;ctx.fillStyle=low?'#cfbd88':'#72c9c9';ctx.beginPath();ctx.ellipse(x,y,size*.68,size*.43,Math.PI/4,0,Math.PI*2);ctx.fill();
  if(low){ctx.fillStyle='#e3d6a2';ctx.beginPath();ctx.ellipse(x-size*.08,y-size*.1,size*.42,size*.20,Math.PI/4,0,Math.PI*2);ctx.fill();ctx.fillStyle='#828969';ctx.beginPath();ctx.ellipse(x+size*.12,y+size*.08,size*.15,size*.09,-.4,0,Math.PI*2);ctx.fill();ctx.fillStyle='#adb18e';ctx.beginPath();ctx.arc(x-size*.23,y-size*.17,size*.055,0,Math.PI*2);ctx.fill();}
  ctx.restore();
 }
}
export function drawIslandRegions(ctx:CanvasRenderingContext2D,map:WorldMap,cam:Camera,w:number,h:number,s?:Island):void{
 if(!map.archipelago)return;ctx.save();ctx.font='bold 13px sans-serif';ctx.textAlign='center';ctx.lineWidth=4;ctx.strokeStyle='#233e3a';ctx.fillStyle='#f9e4ad';
 for(const r of map.archipelago.islands){if(s?.exploration&&!s.exploration.discovered.has(`${r.center.x},${r.center.y}`))continue;const x=w/2+((r.center.x-map.width/2+.5)*16-cam.x)*cam.zoom,y=h/2+((r.center.y-map.height/2+.5)*16-cam.y)*cam.zoom;ctx.strokeText(r.name,x,y);ctx.fillText(r.name,x,y);}
 if(!s){const r=map.archipelago.islands.find(r=>r.id==='thien-nguyen')!,x=w/2+((r.landing.x-map.width/2+.5)*16-cam.x)*cam.zoom,y=h/2+((r.landing.y-map.height/2+.5)*16-cam.y)*cam.zoom;ctx.strokeStyle='#f4d28f';ctx.beginPath();ctx.arc(x,y,10,0,Math.PI*2);ctx.stroke();ctx.fillText('Bãi định cư',x,y+25);}
 ctx.restore();
}
