// ============================================================
// pathfinding.ts — A* Pathfinding implementation for WorldMap
// ============================================================

import type { WorldMap, TilePos } from '../renderer/WorldMap';

interface AStarNode {
  x: number;
  y: number;
  g: number;
  h: number;
  f: number;
  parent: AStarNode | null;
}

export function findPath(
  map: WorldMap,
  startX: number,
  startY: number,
  targetX: number,
  targetY: number,
): TilePos[] | null {
  // If start is target, return empty path
  if (startX === targetX && startY === targetY) return [];

  // Check if target is walkable
  const targetTile = map.tiles[targetY]?.[targetX];
  if (!targetTile || !isWalkable(targetTile, map, targetX, targetY)) {
    // If target is unwalkable (like water for fishing or mountain for mining),
    // we want to pathfind to the *closest walkable neighbor* of the target.
    const neighbors = getWalkableNeighbors(map, targetX, targetY);
    if (neighbors.length === 0) return null;
    
    // A nearby shore may be disconnected; try every walkable approach.
    const paths = neighbors.map(n => findPath(map, startX, startY, n.x, n.y))
      .filter((path): path is TilePos[] => path !== null);
    return paths.sort((a, b) => a.length - b.length)[0] ?? null;
  }
  
  if (startX === targetX && startY === targetY) return [];

  const openList: AStarNode[] = [];
  const closedSet = new Set<string>();

  const startNode: AStarNode = {
    x: startX,
    y: startY,
    g: 0,
    h: heuristic(startX, startY, targetX, targetY),
    f: 0,
    parent: null,
  };
  startNode.f = startNode.g + startNode.h;
  openList.push(startNode);

  while (openList.length > 0) {
    // Get node with lowest f
    let lowestIdx = 0;
    for (let i = 1; i < openList.length; i++) {
      if (openList[i].f < openList[lowestIdx].f) {
        lowestIdx = i;
      }
    }
    const current = openList[lowestIdx];

    // Reached target
    if (current.x === targetX && current.y === targetY) {
      const path: TilePos[] = [];
      let curr: AStarNode | null = current;
      while (curr !== null) {
        path.push({ x: curr.x, y: curr.y });
        curr = curr.parent;
      }
      return path.reverse().slice(1); // Exclude start pos
    }

    // Move from open to closed
    openList.splice(lowestIdx, 1);
    closedSet.add(`${current.x},${current.y}`);

    // Check neighbors
    const neighbors = getWalkableNeighbors(map, current.x, current.y);
    for (const neighbor of neighbors) {
      if (closedSet.has(`${neighbor.x},${neighbor.y}`)) continue;

      const gScore = current.g + 1; // All movements cost 1
      let gScoreIsBest = false;

      let inOpen = false;
      for (let i = 0; i < openList.length; i++) {
        if (openList[i].x === neighbor.x && openList[i].y === neighbor.y) {
          inOpen = true;
          if (gScore < openList[i].g) {
            openList[i].g = gScore;
            openList[i].f = openList[i].g + openList[i].h;
            openList[i].parent = current;
          }
          break;
        }
      }

      if (!inOpen) {
        const h = heuristic(neighbor.x, neighbor.y, targetX, targetY);
        openList.push({
          x: neighbor.x,
          y: neighbor.y,
          g: gScore,
          h: h,
          f: gScore + h,
          parent: current,
        });
      }
    }
  }

  return null; // No path found
}

function heuristic(x1: number, y1: number, x2: number, y2: number): number {
  return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
}

export function isWalkable(t: string, map: WorldMap, x: number, y: number): boolean {
  return t === 'grass' || t === 'sand' || t === 'forest' || Boolean(map.bridges?.has(`${x},${y}`));
}

function getWalkableNeighbors(map: WorldMap, tx: number, ty: number): TilePos[] {
  const dirs = [
    { dx: -1, dy: 0 }, { dx: 1, dy: 0 },
    { dx: 0, dy: -1 }, { dx: 0, dy: 1 },
    // diagonals
    { dx: -1, dy: -1 }, { dx: 1, dy: -1 },
    { dx: -1, dy: 1 },  { dx: 1, dy: 1 },
  ];
  const result: TilePos[] = [];
  for (const { dx, dy } of dirs) {
    const nx = tx + dx;
    const ny = ty + dy;
    if (nx >= 0 && ny >= 0 && nx < map.width && ny < map.height) {
      if (isWalkable(map.tiles[ny][nx], map, nx, ny)) {
        result.push({ x: nx, y: ny });
      }
    }
  }
  return result;
}
