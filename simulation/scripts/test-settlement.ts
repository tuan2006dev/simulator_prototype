import assert from 'node:assert/strict';
import { createIsland } from '../src/core/factory';
import { createCivilization, buildingLock } from '../src/core/civilization';
import { enableSettlement, tickCargo, tickCampfire, sleepingAssignments, shelterBeds } from '../src/core/settlement';
import { tickDailyLife } from '../src/core/dailyLife';
import { SimulationSession } from '../src/core/SimulationSession';
import { encodeSave, decodeSave } from '../src/core/SaveSystem';
import { foodCapacity, placeBuilding, assignWorker, maxBuildingWorkers } from '../src/renderer/BuildingManager';
import type { WorldMap } from '../src/renderer/WorldMap';
const config={seed:42,shape:'circle',size:'small',startPop:5,mode:'local'} as const;
function fixture(pop=5){
  const map:WorldMap={width:12,height:12,tiles:Array.from({length:12},()=>Array(12).fill('grass')),landTiles:[]};
  for(let y=0;y<12;y++)for(let x=0;x<12;x++)map.landTiles.push({x,y});
  const island=createIsland('Định cư',pop);island.civilization=createCivilization();island.dailyLife={campfire:{tileX:2,tileY:5,fuel:12,graceUntil:30,lit:true}};enableSettlement(island);
  island.sharedFood=pop*5;island.wood=0;island.stone=0;
  island.npcs.forEach((n,i)=>{n.age=25;n.occupation='gatherer';n.position={tileX:2+i%2,tileY:5};n.privateFood=0;n.needs={hunger:0,rest:10,safety:0,social:0};n.laborRole='food';});
  return{island,map,session:new SimulationSession(island,map)};
}
{
  const {island,map}=fixture();island.tick=8;
  island.buildings.push({id:'tent',type:'tent',tileX:3,tileY:3,complete:true,progress:100,workers:[]});
  island.npcs.forEach(n=>{n.position={tileX:3,tileY:3};n.lastDinnerDay=0;n.needs.rest=60;});
  const assignments=sleepingAssignments(island,map);assert.equal(assignments.size,3);assert.equal(shelterBeds(island.buildings[0]),3);
  tickDailyLife(island,map);assert.equal(island.npcs.filter(n=>n.sleepSite==='tent').length,3);
  assert(island.npcs.filter(n=>n.sleepSite).every(n=>n.needs.rest===42));assert(island.npcs.filter(n=>!n.sleepSite).every(n=>n.needs.rest===54));
  assert.equal(maxBuildingWorkers(island.buildings[0]),0);assert.match(buildingLock(island,'tent',2)!,/một cấp/);
  island.buildings[0].complete=false;assert.equal(sleepingAssignments(island,map).size,0);
}
{
  const {island,map}=fixture(1);island.buildings.push({id:'tent',type:'tent',tileX:3,tileY:3,complete:true,progress:100,workers:[]});
  island.npcs[0].position={tileX:9,tileY:3};map.tiles.forEach(row=>row[6]='deep_water');
  assert.equal(sleepingAssignments(island,map).size,0,'An unreachable bed is never assigned');
}
{
  const {island,map,session}=fixture(1),n=island.npcs[0];n.laborRole='idle';n.position={tileX:10,tileY:5};
  island.resources.set('10,5',{type:'herb_patch',amount:100,maxAmount:100,regenRate:0});
  const before=island.sharedFood;
  assert(session.submit({playerId:'test',sequence:1,command:{type:'manual_action',npcId:n.id,action:'gather_food'}}).accepted);
  assert.equal(island.sharedFood,before);assert.equal(n.cargo!.food,20,'Harvest belongs to the carrier until deposited');
  session.advanceTicks();assert.equal(n.position.tileX,4);assert.equal(island.sharedFood,before);
  const saved=decodeSave(encodeSave(island,map,config));assert.equal(saved.island.npcs[0].cargo!.food,20);
  session.submit({playerId:'test',sequence:2,command:{type:'assign_labor',npcId:n.id,role:'wood'}});assert.equal(n.cargo!.food,20);
  assert.equal(session.submit({playerId:'test',sequence:3,command:{type:'manual_action',npcId:n.id,action:'gather_food'}}).accepted,false);
  session.advanceTicks(2);assert.equal(n.cargo,undefined);assert.equal(island.sharedFood,before+20);
  const resumed=new SimulationSession(saved.island,saved.map);resumed.advanceTicks(2);assert.equal(saved.island.sharedFood,before+20);
}
{
  const {island,map}=fixture(1),n=island.npcs[0];n.cargo={food:20,wood:6,stone:0,herbs:0};n.position={tileX:9,tileY:5};
  map.tiles.forEach(row=>row[6]='deep_water');tickCargo(island,map);assert.equal(n.cargo.food,20);assert.equal(island.wood,0);assert.match(n.laborMessage!,/không có đường/);
  map.tiles.forEach(row=>row[6]='grass');n.position={tileX:2,tileY:5};island.sharedFood=300;n.survivalBlocked=false;tickCargo(island,map);
  assert.equal(island.wood,6);assert.equal(n.cargo.food,20);assert.match(n.laborMessage!,/đã đầy/);
  island.buildings.push({id:'pile',type:'stockpile',tileX:3,tileY:5,complete:true,progress:100,workers:[]});assert.equal(foodCapacity(island),400);
  n.survivalBlocked=false;tickCargo(island,map);assert.equal(island.sharedFood,320);assert.equal(island.wood,6);assert.equal(n.cargo,undefined);
}
{
  const {island,map}=fixture(1);island.tick=36;const fire=island.dailyLife!.campfire!;fire.fuel=4;
  tickCampfire(island,map);assert.equal(fire.fuel,3);tickCampfire(island,map);assert.equal(fire.fuel,3,'Repeated processing must not burn twice');
  for(const t of [37,38,39]){island.tick=t;tickCampfire(island,map);}assert.equal(fire.fuel,0);assert.equal(fire.lit,true,'Four wood units must cover all four night steps');
  const saved=decodeSave(encodeSave(island,map,config));enableSettlement(saved.island);tickCampfire(saved.island,saved.map);assert.equal(saved.island.dailyLife!.campfire!.fuel,0);assert.equal(saved.island.dailyLife!.campfire!.graceUntil,30);
  island.tick=40;island.wood=6;const total=island.wood+fire.fuel;assert(tickCampfire(island,map));assert.equal(island.wood+fire.fuel,total);assert.equal(fire.fuel,6);assert.equal(fire.lit,true);
  const raw=JSON.parse(encodeSave(island,map,config));raw.island.dailyLife.campfire.fuel=-1;assert.throws(()=>decodeSave(JSON.stringify(raw)));
}
{
  const {island,map}=fixture(1),n=island.npcs[0];island.wood=300;island.stone=300;n.cargo={food:0,wood:6,stone:4,herbs:0};
  tickCargo(island,map);assert.equal(island.wood,300);assert.equal(n.cargo.wood,6);assert.equal(n.cargo.stone,4);
  island.buildings.push({id:'pile',type:'stockpile',tileX:3,tileY:5,complete:true,progress:100,workers:[]});n.survivalBlocked=false;
  tickCargo(island,map);assert.equal(island.wood,306);assert.equal(island.stone,304);assert.equal(n.cargo,undefined);
}
{
  const {island,map}=fixture(1);island.wood=8;island.dailyLife!.campfire!.fuel=0;
  island.npcs[0].researching=true;assert.equal(tickCampfire(island,map),undefined);assert.equal(island.wood,8);
  island.npcs[0].researching=false;island.buildings.push({id:'building',type:'tent',tileX:3,tileY:3,complete:false,progress:0,workers:[island.npcs[0].id]});
  assert.equal(tickCampfire(island,map),undefined,'Keeping fire must never steal a builder');
}
{
  const {island,map,session}=fixture(1);island.wood=20;island.stone=3;
  const tent=placeBuilding(island,'tent',3,5)!,pile=placeBuilding(island,'stockpile',4,5)!;assert(tent&&pile);assert.equal(island.wood,6);assert.equal(island.stone,1);
  assert(assignWorker(island,tent.id,island.npcs[0].id));for(let i=0;i<5;i++)session.advanceTicks(10);assert(tent.complete);assert.equal(tent.workers.length,0);
  assert(assignWorker(island,pile.id,island.npcs[0].id));for(let i=0;i<5;i++)session.advanceTicks(10);assert(pile.complete);assert.equal(foodCapacity(island),400);
}
for(const pop of [5,10,15]){
  const {island,map,session}=fixture(pop);island.dailyLife!.campfire!.fuel=0;
  for(let y=1;y<11;y++)for(let x=1;x<11;x++){
    const type=x%5===0?'wood_tree':x%7===0?'stone_deposit':'herb_patch';
    island.resources.set(`${x},${y}`,{type,amount:100,maxAmount:100,regenRate:2});
  }
  island.npcs.forEach((n,i)=>n.laborRole=i<Math.min(pop-2,Math.ceil(pop*.7))?'food':i===pop-1?'stone':'wood');
  for(let i=0;i<Math.ceil(pop/3);i++)island.buildings.push({id:'tent'+i,type:'tent',tileX:3+i,tileY:3,complete:true,progress:100,workers:[]});
  island.buildings.push({id:'pile',type:'stockpile',tileX:4,tileY:5,complete:true,progress:100,workers:[]});
  for(let i=0;i<30;i++)session.advanceTicks(10);assert.equal(island.npcs.filter(n=>n.isAlive).length,pop,`${pop} residents survive 30 days with actual carried harvests`);
  assert(island.sharedFood>=0&&island.sharedFood<=foodCapacity(island));assert(island.npcs.every(n=>n.needs.hunger<80));
  assert(island.dailyLife!.campfire!.fuel!>=0);assert(island.wood>=0);assert(island.buildings.every(b=>shelterBeds(b)<=3));
  assert(island.wood>=8,'A small settlement must retain enough wood to build after fueling the fire');
  console.log(`PASS: ${pop}-person village, 30 days, shared food ${island.sharedFood.toFixed(1)}, wood ${island.wood.toFixed(1)}.`);
}
{
  const {island,session}=fixture(1),n=island.npcs[0];island.herbs=300;
  island.resources.set('2,5',{type:'herb_patch',amount:100,maxAmount:100,regenRate:1});
  for(let i=0;i<30&&!n.cargo;i++)session.advanceTicks();
  assert(n.cargo&&n.cargo.food>0);assert.equal(n.cargo.herbs,0,'Full herb stock must not strand food gatherers with an unwanted coproduct');
  session.advanceTicks(2);assert.equal(n.cargo,undefined);assert.equal(island.herbs,300);assert(island.sharedFood>5);
}
console.log('PASS: reachable bed capacity, real construction, cargo/role changes/save/blocked paths/full stock, fuel conservation/grace/reload, and 30-day settlements.');
