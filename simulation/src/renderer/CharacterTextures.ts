import type {NPC} from '../core/types';

export type CharacterEra='stone'|'bronze'|'iron'|'modern'|'anomaly';
export type CharacterDirection='south'|'north'|'east'|'west';
export type CharacterPose='idle'|'walk'|'work'|'sleep'|'fight';
export interface CharacterLook {variant:number;child:boolean;elder:boolean;role:'villager'|'researcher'|'guard';tool:string;bag:boolean;weapon?:string;armor?:string;adaptation?:string;activeAdaptation?:boolean;torch?:boolean;torchLit?:boolean}
const SKIN=['#dca46c','#bd8156','#edbf89','#a86d49','#d5a079','#e7b17d'];
const HAIR=['#513a2c','#302b28','#79513b','#483f32','#b07a44','#684630'];
const CLOTH:Record<CharacterEra,string[]>={stone:['#b98950','#826a46','#bd995d'],bronze:['#507a77','#b47546','#77834f'],iron:['#46657b','#936655','#667862'],modern:['#477c99','#d3c4a0','#727d8b'],anomaly:['#75699e','#469b94','#916579']};
export function characterLook(n:NPC):CharacterLook{let hash=2166136261;for(const c of n.id)hash=Math.imul(hash^c.charCodeAt(0),16777619);return {variant:(hash>>>0)%6,child:n.age<18||n.occupation==='child',elder:n.age>=60,role:n.researching?'researcher':n.guardDuty||n.occupation==='warrior'?'guard':'villager',adaptation:n.adaptation?.kind,activeAdaptation:(n.adaptation?.charge??0)>0,weapon:n.weapon,armor:n.armor,tool:n.equippedTool??'',bag:!!n.cargo||!!n.freight,torch:!!n.torch,torchLit:(n.torch?.fuel??0)>0};}
export function characterPose(n:NPC,moving:boolean):CharacterPose{return n.status==='sleeping'?'sleep':n.raidResponse==='guarding'||n.status==='fighting'?'fight':moving?'walk':n.status==='working'||n.researching?'work':'idle';}
/** Original soft chibi silhouettes, designed to stay readable at settlement scale. */
export function characterSVG(look:CharacterLook,era:CharacterEra='stone',direction:CharacterDirection='south',pose:CharacterPose='idle',frame=0):string{
 const v=look.variant%6,skin=SKIN[v],hair=look.elder?'#d5cdb8':HAIR[v],cloth=CLOTH[era][v%3],ink='#574436',back=direction==='north',side=direction==='east'||direction==='west',step=frame%2,active=pose==='work'||pose==='fight';
 const rect=(x:number,y:number,w:number,h:number,color:string,r=1.2)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${color}"/>`;
 const path=(d:string,fill:string,stroke=ink,width=1)=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round"/>`;
 const circle=(x:number,y:number,r:number,fill:string)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
 let a='<ellipse cx="12" cy="32" rx="7" ry="2" fill="#354e3730"/>';
 // Small rounded feet and a short outfit beneath an oversized face.
 a+=rect(7,25,4,5,era==='stone'?skin:'#858878',1.5)+rect(13,25,4,5,era==='stone'?skin:'#858878',1.5);
 a+=rect(6,pose==='walk'&&step?28:30,5.5,2.5,'#7e6047',1.3)+rect(12.5,pose==='walk'&&!step?28:30,5.5,2.5,'#7e6047',1.3);
 a+=path('M8 17 Q12 15 16 17 L18 25 Q12 29 6 25Z',cloth);
 a+=path('M7 24 Q12 26 17 24','none','#e2c797',1.5)+circle(12,25,1.1,'#cda95f');
 if(era==='stone')a+=path('M8 17 Q11 18 13 17 L10 22Z','#e7cf9a','none')+path('M8 25l1 1m3-1 1 1m3-2 1 1','none','#dcc39a',.8);
 if(era==='bronze')a+=path('M8 17 L12 20 16 17','none','#ddc589',1.5)+rect(10.5,20,3,3,'#dfc38b',.8);
 if(era==='iron')a+=path('M8 17 Q12 19 16 17','none','#d5d7c4',2)+rect(7,20,2.5,3,'#bbc6ba',1)+rect(14.5,20,2.5,3,'#bbc6ba',1);
 if(era==='modern')a+=path('M9 17l3 3 3-3','none','#f6ead0',2)+path('M12 20v4','none','#f4e8d2',1.2)+rect(14,21,2,1.5,'#aecfd0',.5);
 if(era==='anomaly')a+=path('M8 18 Q12 21 16 18','none','#b6ebce',1.6)+circle(12,21,1.6,'#c1f1d8');
 const armY=active&&step?18:21,otherY=active&&!step?18:21;
 a+=path(`M7 18 Q3 ${armY-2} 4 ${armY+2}`,cloth,ink,3)+circle(4,armY+2,1.9,skin)+path(`M17 18 Q21 ${otherY-2} 20 ${otherY+2}`,cloth,ink,3)+circle(20,otherY+2,1.9,skin);
 // Round cheeks, bright eyes and a small smile soften every era's clothing.
 a+=circle(4.7,11.3,1.8,skin)+circle(19.3,11.3,1.8,skin);
 a+=path('M5 7 Q5 2 12 2 Q19 2 19 7 L19 12 Q18 18 12 18 Q6 18 5 12Z',back?hair:skin);
 a+=path(v%2?'M5 10 Q3 3 9 2 Q16 0 19 6 L19 9 Q16 7 16 5 Q12 9 8 6 Q7 9 5 10Z':'M5 10 Q3 4 8 2 Q15 0 19 5 L19 9 Q17 8 16 5 Q12 8 7 5 L6 10Z',hair);
 if(look.elder)a+=path('M6 8 Q7 5 8 5 M16 5q1 1 1 3','none','#f0e5ca',1.2);
 if(!back){const eyes=side?[15.5]:[8.7,15.3];for(const x of eyes){a+=pose==='sleep'?path(`M${x-1.5} 11q1.5 1.2 3 0`,'none',ink,1):`<ellipse cx="${x}" cy="10.7" rx="1.55" ry="2" fill="#3e3532"/>`+circle(x-.45,10.1,.5,'#fff4da');}a+=`<ellipse cx="${side?17.5:6.8}" cy="13.4" rx="1.6" ry=".8" fill="#d88775" opacity=".6"/>`;if(!side)a+='<ellipse cx="17.2" cy="13.4" rx="1.6" ry=".8" fill="#d88775" opacity=".6"/>';a+=path(side?'M15 14q1 1 2 0':'M10.5 14q1.5 1.6 3 0','none','#9e6451',.8);}
 if(look.role==='researcher'){a+=path('M6 5Q12 2 18 5','none','#ddc688',1.8);if(!back)a+=path('M2 22 L5 21 8 22 V27 L5 26 2 27Z','#eedcaf','#81634a',.8)+path('M5 22v4','none','#a98758',.7);}
 if(look.role==='guard'){a+=path('M5 7 Q12 5 19 7','none','#b2c2ac',2)+circle(12,6,1.2,'#e1c588');if(!back)a+=path('M10 20h4v3l-2 1-2-1Z','#e9d29b','#748e7c',.6);}
 if(look.tool==='axe')a+=path('M20 18l-1 10','none','#a17a4b',1.7)+path('M18 17 Q22 15 23 19 L21 21 18 20Z','#b7c3b6',ink,.7);
 if(look.tool==='pickaxe')a+=path('M20 18l-1 10','none','#a17a4b',1.7)+path('M16 18 Q20 15 23 18','none','#b7c3b6',2);
 if(look.tool==='fishing_rod')a+=path('M20 27 L22 7 Q19 5 17 8','none','#b69766',1.3)+path('M17 8v9','none','#e1d2aa',.6);
 if(look.torch)a+=path('M2 28L3 16','none','#a17a4b',1.8)+path('M1 17h4v3H1Z','#dfbe80',ink,.6)+(look.torchLit?path('M3 9q-4 5-1 8q5 1 3-3l-2-5Z','#eda551','#ab6741',.6)+circle(3,15,1.2,'#ffe3a2'):'');
 if(look.armor)a+=path('M8 19h8v6H8Z','#8ba894',ink,.8)+path('M9 20l6 4m-6 0 6-4','none','#decc9f',.7);
 if(look.weapon)a+=path('M21 29V6','none','#aa8455',1.4)+path('M21 2l-2 5 2 3 2-3Z','#b8c5b6',ink,.7);
 if(look.adaptation==='hightech')a+=rect(back?16:2,(back?otherY:armY)+1,5,3,'#a8b6bd',1.3)+circle(back?18.5:4.5,(back?otherY:armY)+2.5,1,look.activeAdaptation?'#9ddcc8':'#8e8e84')+path('M5 8q-1-3 1-4','none','#a8b6bd',1.2);
 if(look.adaptation==='mystic')a+=path('M8 18Q12 22 16 18','none',look.activeAdaptation?'#aed9b2':'#b7b6a3',1.2)+circle(12,22,1.5,look.activeAdaptation?'#99d6bd':'#9eaa96')+path('M18 6q3-3 4 1q-3 2-4-1Z',look.activeAdaptation?'#bcd9a8':'#9eaa96','none');
 if(look.adaptation==='eldritch')a+=path('M8 20h8v5H8Z',look.activeAdaptation?'#acaf93':'#9c9c90',ink,.7)+path('M10 21v3m4-3v3','none','#eee3c3',.6)+circle(12,22.5,1.2,look.activeAdaptation?'#d2a6a5':'#a7a293');
 if(look.bag)a+=rect(back?7:17,19,back?10:5,7,'#c5a46e',2)+path(back?'M8 21h8M12 21v3':'M18 21h3','none','#896d49',1);
 let transform=direction==='west'?'translate(24 0) scale(-1 1)':'';
 if(look.child)transform+=' translate(2.6 7) scale(.78)';
 if(pose==='sleep')transform='translate(1 27) rotate(-90) scale(.6) '+transform;
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="96" height="144"><g transform="${transform.trim()}">${a}</g></svg>`;
}
const cache=new Map<string,HTMLImageElement>();
export function characterPortrait(n:NPC,era:CharacterEra='stone'):string{return `<img class="character-portrait" width="32" height="48" alt="Cư dân" src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(characterSVG(characterLook(n),era))}">`;}
export function characterHitBounds(zoom:number):{halfWidth:number;top:number;bottom:number}{const ratio=Math.max(.65/zoom,.9),margin=2/zoom;return {halfWidth:8*ratio+margin,top:13*ratio+margin,bottom:11*ratio+margin};}
export function drawCharacter(ctx:CanvasRenderingContext2D,n:NPC,x:number,y:number,zoom:number,era:CharacterEra,direction:CharacterDirection,pose:CharacterPose,frame:number):void{
 const look=characterLook(n),key=JSON.stringify([look,era,direction,pose,frame%2]);let img=cache.get(key);if(!img){img=new Image();img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(characterSVG(look,era,direction,pose,frame));cache.set(key,img);}
 if(!img.complete||!img.naturalWidth)return;
 const scale=Math.max(.65,zoom*.9);ctx.save();ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(img,Math.round(x-8*scale),Math.round(y-13*scale),16*scale,24*scale);ctx.restore();
}
