import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {TECH_TREE} from '../src/core/research';
import {decodeSave} from '../src/core/SaveSystem';
const tech=(id:any,name:any,icon:any,category:any,requires:any,needEra:any,costs:any,days:any,effect:any,implemented=true)=>({id,name,icon,category,requires,needEra,costWood:costs[0],costStone:costs[1],costFood:costs[2],costHerbs:costs[3],daysNeeded:days,unlocksId:id,description:effect,effect,implemented});
const previous=vm.runInNewContext(readFileSync('artifacts/recovered-tech-tree.txt','utf8'),{tech});assert.equal(previous.length,43);for(const p of previous){const n=TECH_TREE.find(x=>x.id===p.id);assert(n,p.id);assert.deepEqual(JSON.parse(JSON.stringify(n)),JSON.parse(JSON.stringify(p)),p.id);if(p.condition)for(const name of ['anomaly-played','mystic-played','eldritch-transition-played']){const s=decodeSave(readFileSync('artifacts/'+name+'-save.json','utf8')).island;assert.equal(n.condition!(s,{} as any),p.condition(s,{}),p.id);}}assert.equal(TECH_TREE.length,44);console.log('PASS recovered research: all43 previous technology fields/costs/effects/conditions identical to verified build; only new biological adaptation44th node.');
