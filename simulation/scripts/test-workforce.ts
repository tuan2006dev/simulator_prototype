import assert from 'node:assert/strict';
import {createIsland} from '../src/core/factory';
import {createCivilization} from '../src/core/civilization';
import {enableSettlement} from '../src/core/settlement';
import {initializeWorkforce,planWorkforce,attributeBonus} from '../src/core/workforce';
import {SimulationSession,type PlayerCommand} from '../src/core/SimulationSession';
import {encodeSave,decodeSave} from '../src/core/SaveSystem';
import type {WorldMap} from '../src/renderer/WorldMap';
function fixture(pop=5){
 const map:WorldMap={width:16,height:12,tiles:Array.from({length:12},()=>Array(16).fill('grass')),landTiles:[]};
 for(let y=0;y<12;y++)for(let x=0;x<16;x++)map.landTiles.push({x,y});
 const island=createIsland('Tự nhận việc',pop);island.civilization=createCivilization();enableSettlement(island);initializeWorkforce(island,true);
 island.dailyLife!.campfire={tileX:3,tileY:5,fuel:12,graceUntil:30,lit:true};island.wood=0;island.stone=0;island.sharedFood=pop*5;
 island.npcs.forEach(n=>{n.age=25;n.occupation='gatherer';n.position={tileX:3,tileY:5};n.privateFood=0;n.needs={hunger:0,rest:0,safety:0,social:0};});
 for(let y=2;y<10;y++)for(let x=1;x<12;x++)island.resources.set(`${x},${y}`,{type:'herb_patch',amount:100,maxAmount:100,regenRate:2});
 island.resources.set('5,5',{type:'wood_tree',amount:10000,maxAmount:10000,regenRate:1});island.resources.set('6,5',{type:'stone_deposit',amount:10000,maxAmount:10000,regenRate:0});
 const session=new SimulationSession(island,map);let seq=0;return {island,map,session,submit:(command:PlayerCommand)=>session.submit({playerId:'test',sequence:++seq,command})};
}
for(const pop of [5,10,15]){
 const {island,session}=fixture(pop);
 for(let i=0;i<300;i++)session.advanceTicks(1);
 assert.equal(island.npcs.filter(n=>n.isAlive).length,pop);assert(island.sharedFood>0);assert(island.wood>=8);assert(island.stone>=2);
 console.log(`PASS: ${pop} automatic residents survived 30 days; food ${island.sharedFood.toFixed(1)}, wood ${island.wood.toFixed(1)}, stone ${island.stone.toFixed(1)}.`);
}
{
 const {island,map,session,submit}=fixture(10);island.sharedFood=0;
 const manual=island.npcs[0];assert(submit({type:'assign_labor',npcId:manual.id,role:'stone'}).accepted);
 const builder=island.npcs[1],researcher=island.npcs[2],carrier=island.npcs[3],direct=island.npcs[4];
 island.buildings.push({id:'construction',type:'tent',tileX:2,tileY:2,progress:0,complete:false,workers:[builder.id]});
 researcher.researching=true;carrier.cargo={food:16,wood:0,stone:0,herbs:0};direct.actionTarget={type:'chop_wood',x:5,y:5};direct.laborTask={workTicks:3,totalTicks:5};direct.laborRole='wood';
 const roles=[builder,researcher,carrier,direct].map(n=>n.laborRole);planWorkforce(island,map);
 assert.equal(manual.laborRole,'stone');assert.deepEqual([builder,researcher,carrier,direct].map(n=>n.laborRole),roles);assert.equal(direct.laborTask!.workTicks,3);
 assert.equal(carrier.cargo.food,16);assert(island.npcs.some(n=>n.autoReason?.includes('dưới 1,5')));
 const before=island.npcs.map(n=>n.laborRole);assert(submit({type:'set_auto_claim',enabled:false}).accepted);planWorkforce(island,map);assert.deepEqual(island.npcs.map(n=>n.laborRole),before);
 assert(submit({type:'set_auto_claim',enabled:true}).accepted);assert(submit({type:'set_labor_mode',npcId:manual.id,mode:'auto'}).accepted);planWorkforce(island,map);assert.equal(manual.laborMode,'auto');
 const oldMode=manual.laborMode;assert(!submit({type:'manual_action',npcId:manual.id,action:'invalid' as any}).accepted);assert.equal(manual.laborMode,oldMode);
 const save=encodeSave(island,map,{seed:42,shape:'circle',size:'small',startPop:10,mode:'local'}),loaded=decodeSave(save);initializeWorkforce(loaded.island);
 assert.deepEqual(loaded.island.workforce,island.workforce);assert.deepEqual(loaded.island.npcs.map(n=>n.attributes),island.npcs.map(n=>n.attributes));assert.deepEqual(loaded.island.npcs.map(n=>n.laborMode),island.npcs.map(n=>n.laborMode));
 const corrupt=JSON.parse(save);corrupt.island.npcs[0].attributes.str=11;assert.throws(()=>decodeSave(JSON.stringify(corrupt)),/Thuộc tính/);
 assert.equal(attributeBonus({...manual,attributes:{str:10,dex:1,int:5}},'str'),1.2);assert.equal(attributeBonus({...manual,attributes:{str:10,dex:1,int:5}},'dex'),1);
 session.advanceTicks(1);
}
{
 const {island}=fixture();delete island.workforce;island.npcs.forEach(n=>{delete n.laborMode;delete n.attributes;});const roles=island.npcs.map(n=>n.laborRole);initializeWorkforce(island);
 assert.equal(island.workforce!.enabled,false);assert(island.npcs.every(n=>n.laborMode==='manual'&&n.attributes!.str===5));assert.deepEqual(island.npcs.map(n=>n.laborRole),roles);
}
console.log('PASS: manual locks, builders/researchers/cargo/direct orders, toggle/mode commands, attributes bounds, save/load and conservative legacy migration.');
{
 const {island,session,submit}=fixture();const npc=island.npcs[0];npc.attributes={str:10,dex:10,int:10};npc.position={tileX:5,tileY:5};island.civilization!.unlocks=['stone_tools'];
 const before=island.resources.get('5,5')!.amount;
 assert(submit({type:'manual_action',npcId:npc.id,action:'chop_wood'}).accepted);
 assert(Math.abs(npc.cargo!.wood-5.4)<1e-8,'3 wood ×1.5 tools ×1.2 STR, exactly once');assert(Math.abs(island.resources.get('5,5')!.amount-(before-5.4))<1e-8);assert.equal(island.wood,0);
 assert(!submit({type:'manual_action',npcId:npc.id,action:'chop_wood'}).accepted);assert.equal(island.resources.get('5,5')!.amount,before-5.4);
 npc.cargo=undefined;island.civilization!.unlocks=[];island.wood=10;island.buildings.push({id:'table',type:'study_table',tileX:14,tileY:8,complete:true,progress:100,workers:[]});npc.position={tileX:14,tileY:8};
 assert(submit({type:'start_research',techId:'fire'}).accepted);session.advanceTicks(1);const progress=island.civilization!.research!;assert.equal(progress.workTicks,2.4,'INT changes actual research progress');
 island.tick=5;session.advanceTicks(1);assert.equal(progress.workTicks,2.4,'Night rest still interrupts boosted research');
}
