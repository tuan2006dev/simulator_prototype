import type {Island} from '../core/types';
import type {WorldMap} from './WorldMap';
import type {Camera} from './Camera';
import {drawGameIcon} from '../ui/GameIcons';
import {drawWildlife} from './WildlifeRenderer';
export function drawFog(ctx:CanvasRenderingContext2D,s:Island,map:WorldMap,cam:Camera,w:number,h:number):void{
 const e=s.exploration;if(!e)return;const size=16*cam.zoom;
 ctx.save();ctx.fillStyle='#172c38';
 const left=w/2+(-map.width/2*16-cam.x)*cam.zoom,top=h/2+(-map.height/2*16-cam.y)*cam.zoom,right=left+map.width*size,bottom=top+map.height*size;
 if(top>0)ctx.fillRect(0,0,w,top);if(bottom<h)ctx.fillRect(0,bottom,w,h-bottom);if(left>0)ctx.fillRect(0,Math.max(0,top),left,Math.min(h,bottom)-Math.max(0,top));if(right<w)ctx.fillRect(right,Math.max(0,top),w-right,Math.min(h,bottom)-Math.max(0,top));
 for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
 const px=w/2+((x-map.width/2)*16-cam.x)*cam.zoom,py=h/2+((y-map.height/2)*16-cam.y)*cam.zoom;if(px+size<0||py+size<0||px>w||py>h)continue;
 const key=`${x},${y}`;if(e.visible.has(key))continue;ctx.fillStyle=e.discovered.has(key)?'rgba(17,34,42,.42)':'#172c38';ctx.fillRect(Math.floor(px),Math.floor(py),Math.ceil(size)+1,Math.ceil(size)+1);
 }ctx.restore();
 for(const p of e.points??[]){if(!e.discovered.has(`${p.x},${p.y}`))continue;const x=w/2+((p.x-map.width/2+.5)*16-cam.x)*cam.zoom,y=h/2+((p.y-map.height/2+.5)*16-cam.y)*cam.zoom,size=Math.max(16,18*cam.zoom);ctx.save();ctx.globalAlpha=p.claimed||p.exhausted?0.45:1;drawGameIcon(ctx,p.kind==='monolith'?'ancient-stone':p.kind==='food_cache'?'food':'herbs',x,y,size);ctx.restore();}
 drawWildlife(ctx,s,map,cam,w,h);
 const a=e.active;if(a){const x=w/2+((a.target.x-map.width/2+.5)*16-cam.x)*cam.zoom,y=h/2+((a.target.y-map.height/2+.5)*16-cam.y)*cam.zoom;ctx.save();ctx.strokeStyle='#f4d289';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,Math.max(7,6*cam.zoom),0,Math.PI*2);ctx.stroke();ctx.restore();}
}
