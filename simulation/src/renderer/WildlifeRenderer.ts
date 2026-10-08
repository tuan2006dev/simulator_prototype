import type {Island} from '../core/types';
import type {WorldMap} from './WorldMap';
import type {Camera} from './Camera';
import {drawGameIcon} from '../ui/GameIcons';
export function drawWildlife(ctx:CanvasRenderingContext2D,s:Island,map:WorldMap,cam:Camera,w:number,h:number):void{
 for(const t of s.wilderness?.territories??[]){
  if(!s.exploration?.visible.has(`${t.animalX},${t.animalY}`))continue;
  const x=w/2+((t.animalX-map.width/2+.5)*16-cam.x)*cam.zoom,y=h/2+((t.animalY-map.height/2+.5)*16-cam.y)*cam.zoom,size=Math.max(18,24*cam.zoom),resting=s.tick<t.retreatUntil;
  ctx.save();ctx.fillStyle='rgba(33,45,33,.25)';ctx.beginPath();ctx.ellipse(x,y+size*.35,size*.4,size*.14,0,0,Math.PI*2);ctx.fill();drawGameIcon(ctx,t.species==='wolf'?'wild-wolf':'wild-boar',x,y+Math.sin(s.tick+t.x)*cam.zoom,size);
  ctx.strokeStyle=resting?'#b8cc92':'#ceaa77';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x,y,size*.52,0,Math.PI*2);ctx.stroke();ctx.restore();
 }
}
