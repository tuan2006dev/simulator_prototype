import { mkdir, writeFile } from 'node:fs/promises';
import { buildingTextureSVG } from '../src/renderer/BuildingTextures';
import { BUILD_LABELS } from '../src/renderer/BuildingManager';
import type { BuildingType } from '../src/core/types';

async function main() {
  await mkdir('web/assets/buildings', { recursive: true });
  for (const type of Object.keys(BUILD_LABELS) as BuildingType[]) {
    for (let level = 1; level <= 3; level++) await writeFile(`web/assets/buildings/${type}-${level}.svg`, buildingTextureSVG(type, level));
    for (let level = 1; level <= 3; level++) await writeFile(`web/assets/buildings/${type}-bronze-${level}.svg`, buildingTextureSVG(type, level, 'bronze'));
    for (let level = 1; level <= 3; level++) await writeFile(`web/assets/buildings/${type}-iron-${level}.svg`, buildingTextureSVG(type, level, 'iron'));
  }
  console.log(`Generated ${Object.keys(BUILD_LABELS).length * 9} textures across ${Object.keys(BUILD_LABELS).length} building types, 3 levels and 3 technology styles.`);
}
void main();
