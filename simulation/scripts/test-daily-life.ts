import assert from 'node:assert/strict';
import { createIsland } from '../src/core/factory';
import { createCivilization } from '../src/core/civilization';
import { SimulationSession } from '../src/core/SimulationSession';
import { encodeSave, decodeSave } from '../src/core/SaveSystem';
import { tickDailyLife, worldMinutes, dayPhase } from '../src/core/dailyLife';
import type { WorldMap } from '../src/renderer/WorldMap';

const config = {seed:42,shape:'circle',size:'small',startPop:5,mode:'local'} as const;
function fixture(pop=5) {
  const map: WorldMap = {width:12,height:12,tiles:Array.from({length:12},()=>Array(12).fill('grass')),landTiles:[]};
  for(let y=0;y<12;y++)for(let x=0;x<12;x++)map.landTiles.push({x,y});
  const island=createIsland('Nhịp sống',pop); island.civilization=createCivilization();island.dailyLife={campfire:{tileX:5,tileY:5}};island.sharedFood=200;
  island.npcs.forEach((n,i)=>{n.age=25;n.occupation='gatherer';n.position={tileX:5+i%2,tileY:5};n.privateFood=0;n.health=100;n.needs={hunger:8,rest:15,safety:0,social:30};n.laborRole='food';});
  for(let y=1;y<11;y++)for(let x=1;x<11;x++)island.resources.set(`${x},${y}`,{type:'herb_patch',amount:100,maxAmount:100,regenRate:2});
  return {island,map,session:new SimulationSession(island,map)};
}
assert.equal(worldMinutes(0),360);assert.equal(dayPhase(5),'Bữa tối');assert.equal(dayPhase(6),'Nghỉ ngơi');assert.equal(dayPhase(10),'Lao động');
{
  const {island,map}=fixture();island.tick=5;tickDailyLife(island,map);island.tick=6;tickDailyLife(island,map);
  assert(island.npcs.every(n=>n.needs.social<30),'Dinner with nearby residents reduces loneliness');
  assert(island.relationships.size>0,'Communal dinner creates real relationships');
}
{
  const {island,map,session}=fixture(1),n=island.npcs[0];n.position={tileX:9,tileY:5};n.needs.hunger=85;
  map.tiles.forEach(row=>{row[6]='deep_water';});
  const before=island.sharedFood;session.advanceTicks();
  assert.equal(island.sharedFood,before,'An inaccessible stockpile cannot feed a resident remotely');
  assert.equal(n.position.tileX,9);assert.match(n.laborMessage!,/Không có đường/);
}
{
  const {island,session}=fixture(1),n=island.npcs[0];n.position={tileX:9,tileY:5};n.needs.hunger=85;n.laborRole='idle';
  const farm={id:'test-farm',type:'farm' as const,tileX:9,tileY:5,workers:[n.id],progress:100,complete:true,level:1};
  island.buildings.push(farm);n.buildingWork={buildingId:farm.id,ticks:4};
  session.advanceTicks();assert.equal(n.buildingWork.ticks,4,'Trip home preserves the partial production batch');
  session.advanceTicks();assert.equal(n.status,'eating');assert.equal(n.buildingWork.ticks,4);
  session.advanceTicks();assert.equal(n.buildingWork.ticks,4,'Returning to work does not produce before arrival');
  session.advanceTicks();assert.equal(island.buildings[0].productionBatches,1,'One remaining work step completes exactly one batch');
}
{
  const {island,map}=fixture(1), n=island.npcs[0]; island.tick=5;
  const total=()=>island.sharedFood+n.privateFood;
  const before=total();tickDailyLife(island,map);
  assert.equal(n.status,'eating');assert.equal(n.needs.hunger,0);
  assert(Math.abs(before-total()-20*8/35)<1e-8,'Only actual hunger is consumed; ration transfer preserves the ledger');
  const after=total();tickDailyLife(island,map);assert.equal(total(),after,'Repeated dinner in the same day cannot charge again');
  const save=decodeSave(encodeSave(island,map,config));tickDailyLife(save.island,save.map);assert.equal(save.island.sharedFood+save.island.npcs[0].privateFood,after);
}
{
  const {island,session}=fixture(1),n=island.npcs[0];n.position={tileX:9,tileY:5};n.needs.hunger=85;n.privateFood=20;n.actionTarget={type:'gather_food',x:9,y:5};n.laborTask={workTicks:4};
  session.advanceTicks();assert.equal(n.status,'eating');assert.equal(n.laborTask!.workTicks,4);assert(n.needs.hunger<80);
  session.advanceTicks();assert.equal(n.laborTask!.workTicks,3,'The interrupted harvest resumes without losing progress');
  n.needs.hunger=85;n.privateFood=0;session.advanceTicks();assert.equal(n.position.tileX,5);assert.equal(n.laborTask!.workTicks,3,'Walking to eat must not harvest simultaneously');
}
{
  const {island,session}=fixture(1),n=island.npcs[0];n.health=25;n.needs.hunger=10;session.advanceTicks();assert.equal(n.status,'sleeping');assert.equal(n.health,27);
  const saved=decodeSave(encodeSave(island,fixture().map,config));assert.equal(saved.island.npcs[0].health,27);
  session.advanceTicks();assert.equal(n.health,29);for(let i=0;i<30&&n.health<40;i++)session.advanceTicks();assert(n.health>=40);island.tick=0;n.needs.rest=0;n.needs.hunger=0;session.advanceTicks();assert.equal(n.survivalBlocked,false);n.health=89;n.needs.rest=90;session.advanceTicks();assert.equal(n.health,90,'Ordinary rest caps recovery at90 rather than replacing medicine');n.needs.rest=90;session.advanceTicks();assert.equal(n.health,90);
}
{
  const {island,session}=fixture(1),n=island.npcs[0];island.sharedFood=0;n.needs.hunger=100;
  for(let i=0;i<32&&n.isAlive;i++)session.advanceTicks();assert.equal(n.isAlive,false,'Starvation consumes HP and can be fatal');
}
{
  const {island,map,session}=fixture(1),n=island.npcs[0];n.position=null;n.needs.hunger=99;
  session.advanceTicks(10);assert.equal(n.needs.hunger,99,'Settlers not yet placed do not starve off-map');
  const old=JSON.parse(encodeSave(island,map,config));delete old.island.npcs[0].health;const migrated=decodeSave(JSON.stringify(old));assert.equal(migrated.island.npcs[0].health,100);
  old.island.npcs[0].health=-2;assert.throws(()=>decodeSave(JSON.stringify(old)));
}
for(const pop of [5,10,15]) {
  const {island,session}=fixture(pop);island.sharedFood=pop*5;
  for(let i=0;i<300;i++)session.advanceTicks();
  assert.equal(island.npcs.filter(n=>n.isAlive).length,pop,`A ${pop}-person village with reachable food survives 30 days`);
  assert(island.sharedFood>=0);assert(island.npcs.every(n=>n.needs.hunger<80));
}
console.log('Daily life: meal ledger, interrupts, routes, health, save/load, unplaced settlers, and 30-day villages passed.');
