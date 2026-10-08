// ============================================================
// WorldMap.ts — Procedural island tilemap generation
// ============================================================

export type TileType =
  | 'deep_water'
  | 'shallow_water'
  | 'sand'
  | 'grass'
  | 'forest'
  | 'mountain';

export interface TilePos { x: number; y: number }
export type WorldShape='circle'|'elongated'|'archipelago'|'crescent'|'three-islands';
export type RegionId='thien-nguyen'|'than-ngu'|'rang-nanh';
export interface IslandRegion {id:RegionId;name:string;seed:number;center:TilePos;landing:TilePos;bounds:{x:number;y:number;width:number;height:number}}

export interface WorldMap {
  width: number;
  height: number;
  tiles: TileType[][];
  /** All walkable land tiles (grass, forest, sand) */
  landTiles: TilePos[];
  bridges?: Set<string>;
  causeway?: {version:1;main:TilePos;fang:TilePos;tiles:TilePos[]};
  archipelago?: {version:1;masterSeed:number;islands:IslandRegion[];regions:Map<string,RegionId>};
}

/** Seeded deterministic LCG random — same seed → same island */
function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = Math.imul(s ^ (s >>> 16), 0x45d9f3b);
    s = Math.imul(s ^ (s >>> 16), 0x45d9f3b);
    s ^= s >>> 16;
    return (s >>> 0) / 0xffff_ffff;
  };
}

/** Simple smooth noise using bilinear interpolation of random grid */
function smoothNoise(x: number, y: number, rng: () => number, gridSize: number): number {
  const ix = Math.floor(x / gridSize);
  const iy = Math.floor(y / gridSize);
  const fx = (x / gridSize) - ix;
  const fy = (y / gridSize) - iy;

  // Use deterministic values from position
  const h = (gx: number, gy: number) => {
    const seed = ((gx * 73856093) ^ (gy * 19349663)) >>> 0;
    return ((seed * 1664525 + 1013904223) >>> 0) / 0xffff_ffff;
  };

  const v00 = h(ix, iy);
  const v10 = h(ix + 1, iy);
  const v01 = h(ix, iy + 1);
  const v11 = h(ix + 1, iy + 1);

  // Smooth interpolation
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);

  return v00 * (1 - ux) * (1 - uy) +
         v10 * ux       * (1 - uy) +
         v01 * (1 - ux) * uy       +
         v11 * ux       * uy;
}

export function generateWorldMap(
  width: number,
  height: number,
  seed = 42,
  shape: WorldShape = 'circle',
): WorldMap {
  if(shape==='three-islands')return generateThreeIslands(width,height,seed);
  const rng = makeRng(seed);
  const tiles: TileType[][] = [];
  const landTiles: TilePos[] = [];

  const cx = width / 2;
  const cy = height / 2;

  for (let y = 0; y < height; y++) {
    tiles[y] = [];
    for (let x = 0; x < width; x++) {
      let dx: number, dy: number, dist: number;

      if (shape === 'elongated') {
        dx = (x - cx) / (width  * 0.55);
        dy = (y - cy) / (height * 0.30);
        dist = Math.sqrt(dx * dx + dy * dy);
      } else if (shape === 'crescent') {
        // Main circle minus a shifted circle
        dx = (x - cx) / (width  * 0.42);
        dy = (y - cy) / (height * 0.42);
        const mainDist   = Math.sqrt(dx * dx + dy * dy);
        const dx2 = (x - cx * 1.25) / (width * 0.28);
        const dy2 = (y - cy * 0.80) / (height * 0.28);
        const holeDist = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        dist = Math.max(mainDist, 1.0 - holeDist);
      } else if (shape === 'archipelago') {
        // Multiple smaller islands via modulated noise
        dx = (x - cx) / (width  * 0.50);
        dy = (y - cy) / (height * 0.50);
        dist = Math.sqrt(dx * dx + dy * dy) * 0.8;
      } else {
        // circle (default)
        dx = (x - cx) / (width  * 0.42);
        dy = (y - cy) / (height * 0.42);
        dist = Math.sqrt(dx * dx + dy * dy);
      }

      // Multi-octave noise
      const n1 = smoothNoise(x, y, rng, 12) * 0.50;
      const n2 = smoothNoise(x, y, rng, 6)  * 0.30;
      const n3 = smoothNoise(x, y, rng, 3)  * 0.20;
      let   noise = (n1 + n2 + n3) - 0.5;

      // Archipelago gets extra low-freq modulation for separate islands
      if (shape === 'archipelago') {
        const archipelagoNoise = smoothNoise(x, y, rng, 22) * 0.25;
        noise += archipelagoNoise;
      }

      const h = 1.0 - dist + noise * 0.55;

      let tile: TileType;
      if      (h < 0.05) tile = 'deep_water';
      else if (h < 0.18) tile = 'shallow_water';
      else if (h < 0.28) tile = 'sand';
      else if (h < 0.60) tile = 'grass';
      else if (h < 0.82) tile = 'forest';
      else               tile = 'mountain';

      tiles[y][x] = tile;

      if (tile === 'grass' || tile === 'sand' || tile === 'forest') {
        landTiles.push({ x, y });
      }
    }
  }

  return { width, height, tiles, landTiles };
}

export function regionAt(map:WorldMap,x:number,y:number):IslandRegion|undefined{
 const id=map.archipelago?.regions.get(`${x},${y}`);return map.archipelago?.islands.find(r=>r.id===id);
}
export function regionSeed(master:number,id:RegionId):number{
 let value=master>>>0;for(const c of id)value=Math.imul(value^c.charCodeAt(0),16777619)>>>0;return value;
}
function seededNoise(x:number,y:number,seed:number):number{
 const gx=Math.floor(x/4),gy=Math.floor(y/4),fx=x/4-gx,fy=y/4-gy;
 const sample=(xx:number,yy:number)=>{let a=(seed^Math.imul(xx,73856093)^Math.imul(yy,19349663))>>>0;a=Math.imul(a^(a>>>16),0x45d9f3b);return ((a^(a>>>16))>>>0)/0xffffffff;};
 const ux=fx*fx*(3-2*fx),uy=fy*fy*(3-2*fy);return sample(gx,gy)*(1-ux)*(1-uy)+sample(gx+1,gy)*ux*(1-uy)+sample(gx,gy+1)*(1-ux)*uy+sample(gx+1,gy+1)*ux*uy;
}
function islandTemplate(width:number,height:number,seed:number,id:RegionId):WorldMap{
 const tiles:TileType[][]=Array.from({length:height},()=>Array<TileType>(width).fill('deep_water')),landTiles:TilePos[]=[];
 for(let y=1;y<height-1;y++)for(let x=1;x<width-1;x++){
  const dx=(x-(width-1)/2)/(width*.40),dy=(y-(height-1)/2)/(height*.40),theta=Math.atan2(dy,dx),dist=Math.hypot(dx,dy),noise=seededNoise(x,y,seed)-.5;
  const elevation=1-dist+noise*.12+Math.cos(theta*3+(seed%100)/16)*.035;
  let tile:TileType=elevation<-.07?'deep_water':elevation<.1?'shallow_water':elevation<.24?'sand':'grass';
  if(elevation>=.24){if(id==='than-ngu')tile=elevation>.45?'forest':'grass';else if(id==='rang-nanh')tile=elevation>.45?'mountain':'grass';else tile=elevation>.8?'mountain':elevation>.58?'forest':'grass';}
  tiles[y][x]=tile;if(['grass','forest','sand'].includes(tile))landTiles.push({x,y});
 }
 // Noise can leave a single walkable pocket inside a rocky core. Keep the main
 // connected landmass so placement never strands a villager in such a pocket.
 const keys=new Set(landTiles.map(p=>`${p.x},${p.y}`)),visited=new Set<string>();let largest:TilePos[]=[];
 for(const p of landTiles){if(visited.has(`${p.x},${p.y}`))continue;const component=[p];visited.add(`${p.x},${p.y}`);for(let i=0;i<component.length;i++)for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){const x=component[i].x+dx,y=component[i].y+dy,k=`${x},${y}`;if(keys.has(k)&&!visited.has(k)){visited.add(k);component.push({x,y});}}if(component.length>largest.length)largest=component;}
 const connected=new Set(largest.map(p=>`${p.x},${p.y}`));for(const p of landTiles)if(!connected.has(`${p.x},${p.y}`))tiles[p.y][p.x]='mountain';
 return {width,height,tiles,landTiles:largest};
}
/** A separate seeded layout leaves every pre-existing shape and save untouched. */
export function generateThreeIslands(baseWidth:number,baseHeight:number,seed:number):WorldMap{
 if(!Number.isSafeInteger(baseWidth)||!Number.isSafeInteger(baseHeight)||baseWidth<30||baseHeight<24||baseWidth>150||baseHeight>100)throw new RangeError('Kích thước đảo chính không hợp lệ.');
 const ids:RegionId[]=['thien-nguyen','than-ngu','rang-nanh'],names=['Thiên Nguyên','Thần Ngư','Răng Nanh'];
 const templates=ids.map((id,i)=>islandTemplate(i===0?baseWidth:Math.max(20,Math.round(baseWidth*.60)),i===0?baseHeight:Math.max(16,Math.round(baseHeight*.65)),regionSeed(seed,id),id));
 const main=templates[0],offsets:TilePos[]=[{x:0,y:0},{x:0,y:0},{x:0,y:0}];
 const shore=(m:WorldMap)=>m.landTiles.filter(p=>[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>['shallow_water','deep_water'].includes(m.tiles[p.y+dy]?.[p.x+dx])));
 const coast=templates.map(shore);
 const occupied=templates.map(m=>m.tiles.flatMap((row,y)=>row.flatMap((t,x)=>t==='deep_water'?[]:[{x,y}]))),mainMask=new Set(occupied[0].map(p=>`${p.x},${p.y}`));
 for(const i of [1,2]){const direction=i===1?1:-1,other=templates[i];let shift=0;
  for(;shift<baseWidth+baseHeight;shift++){
   const x=Math.round((main.width-other.width)/2)+direction*shift,y=Math.round((main.height-other.height)/2)+direction*shift;
   if(occupied[i].some(p=>mainMask.has(`${p.x+x},${p.y+y}`)))continue;
   let gap=Infinity;for(const a of coast[0])for(const b of coast[i])gap=Math.min(gap,Math.hypot(a.x-b.x-x,a.y-b.y-y));
   if(gap>=12){offsets[i]={x,y};break;}
  }
  if(shift===baseWidth+baseHeight)throw new Error('Không tìm được khoảng bờ an toàn.');
 }
 const pad=5,minX=Math.min(...offsets.map(p=>p.x))-pad,minY=Math.min(...offsets.map(p=>p.y))-pad,width=Math.max(...templates.map((m,i)=>offsets[i].x+m.width))-minX+pad,height=Math.max(...templates.map((m,i)=>offsets[i].y+m.height))-minY+pad;
 const map:WorldMap={width,height,tiles:Array.from({length:height},()=>Array<TileType>(width).fill('deep_water')),landTiles:[],archipelago:{version:1,masterSeed:seed,islands:[],regions:new Map()}};
 templates.forEach((m,i)=>{const origin={x:offsets[i].x-minX,y:offsets[i].y-minY},id=ids[i];
  for(let y=0;y<m.height;y++)for(let x=0;x<m.width;x++){const tile=m.tiles[y][x];if(tile==='deep_water')continue;const xx=x+origin.x,yy=y+origin.y,k=`${xx},${yy}`;if(map.archipelago!.regions.has(k))throw new Error('Hai vùng đảo bị chồng.');map.tiles[yy][xx]=tile;map.archipelago!.regions.set(k,id);if(['grass','forest','sand'].includes(tile))map.landTiles.push({x:xx,y:yy});}
  const target={x:m.width/2,y:m.height*.65},candidates=m.landTiles.filter(p=>m.tiles[p.y][p.x]==='grass');const landing=(candidates.length?candidates:m.landTiles).sort((a,b)=>Math.hypot(a.x-target.x,a.y-target.y)-Math.hypot(b.x-target.x,b.y-target.y))[0];
  map.archipelago!.islands.push({id,name:names[i],seed:regionSeed(seed,id),center:{x:origin.x+Math.floor(m.width/2),y:origin.y+Math.floor(m.height/2)},landing:{x:origin.x+landing.x,y:origin.y+landing.y},bounds:{...origin,width:m.width,height:m.height}});
 });return map;
}

/** Tile pixel center in world space (origin at map center) */
export function tileToWorld(tx: number, ty: number, tileSize: number, mapW: number, mapH: number) {
  return {
    wx: (tx - mapW / 2 + 0.5) * tileSize,
    wy: (ty - mapH / 2 + 0.5) * tileSize,
  };
}

/** Get walkable neighbors of a tile */
export function getNeighbors(tx: number, ty: number, map: WorldMap): TilePos[] {
  const dirs = [
    { dx: -1, dy: 0 }, { dx: 1, dy: 0 },
    { dx: 0, dy: -1 }, { dx: 0, dy: 1 },
    { dx: -1, dy: -1 }, { dx: 1, dy: -1 },
    { dx: -1, dy: 1 },  { dx: 1, dy: 1 },
  ];
  const result: TilePos[] = [];
  for (const { dx, dy } of dirs) {
    const nx = tx + dx;
    const ny = ty + dy;
    if (nx < 0 || ny < 0 || nx >= map.width || ny >= map.height) continue;
    const t = map.tiles[ny][nx];
    if (t === 'grass' || t === 'sand' || t === 'forest') {
      result.push({ x: nx, y: ny });
    }
  }
  return result;
}
