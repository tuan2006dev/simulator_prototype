import {WORLD_STEP_MS,EFFECT_STEP_MS} from './core/WorldClock';
import {drawIslandRegions,drawTidalGround} from './renderer/IslandRegionsRenderer';
import {archipelagoPanelHTML,selectTidalScout} from './ui/ArchipelagoPanel';
import {initializeExploration,refreshVisibility,knownTile} from './core/ExplorationManager';
import {drawFog} from './renderer/FogRenderer';
import {selectExplorer} from './ui/ExplorationPanel';
let explorationPlacementNpcId:string|null=null;
import {selectAdaptationLab} from './ui/AdaptationPanel';
import {initializePower} from './core/PowerManager';
import {initializeRaids,raidSummary} from './core/RaidManager';
import {militaryPanelHTML,updateMilitaryPanel} from './ui/MilitaryPanel';
import {managementPanelHTML,updateManagementPanel} from './ui/ManagementPanel';
import {initializeWeather,isRaining} from './core/WeatherManager';
import {initializeFaith} from './core/FaithManager';
import {faithPanelHTML,updateFaithPanel} from './ui/FaithPanel';
import {initializeLogistics} from './core/logistics';
// ============================================================
// main.ts — Phase 4: Animals + Genealogy + Save/Load
// ============================================================

import { createIsland, reserveEntityIds } from './core/factory';
import { SimulationSession, type PlayerCommand } from './core/SimulationSession';
import { createCivilization, ERAS } from './core/civilization';
import { encodeSave, readLocalSave, LOCAL_SAVE_KEY, type SavedWorld } from './core/SaveSystem';
import { eraPanelHTML } from './ui/EraPanel';
import { ServerSessionClient } from './core/ServerSessionClient';
import { generateWorldMap,regionAt } from './renderer/WorldMap';
import { createCamera, updateCamera, zoomAt } from './renderer/Camera';
import { TilemapRenderer, TILE_SIZE } from './renderer/TilemapRenderer';
import { NPCRenderer }      from './renderer/NPCRenderer';
import { AnimalRenderer }   from './renderer/AnimalRenderer';
import { InputHandler }     from './game/InputHandler';
import { HUD, updateChronicle } from './ui/HUD';
import { InspectorPanel }   from './ui/InspectorPanel';
import { Minimap }          from './ui/Minimap';
import { BuildPanel }       from './ui/BuildPanel';
import { StartScreen, type WorldConfig } from './ui/StartScreen';
import { ActionMenu }       from './ui/ActionMenu';
import { ResearchPanel }    from './ui/ResearchPanel';
import { PaintPanel }       from './ui/PaintPanel';
import { BuildingInspector } from './ui/BuildingInspector';
import { PopulationPanel }   from './ui/PopulationPanel';
import { CreaturesPanel } from './ui/CreaturesPanel';
import { canInviteSettler } from './core/settlers';
import { createAnimal } from './core/factory';
import { ANIMAL_CONFIG, type AnimalSpecies } from './core/types';
import { AnimalPanel }       from './ui/AnimalPanel';
import { GenealogyPanel }    from './ui/GenealogyPanel';
import { spawnResources, RESOURCE_ICONS } from './renderer/ResourceSpawner';
import { BUILD_LABELS, getBuildingAt, foodCapacity } from './renderer/BuildingManager';
import { drawBuildingTexture } from './renderer/BuildingTextures';
import { buildingLevel } from './renderer/BuildingManager';
import {
  tickAnimals, applyDogGuardBonus,
  spawnWildAnimals, feedAnimal,


} from './core/AnimalSystem';
import {
  createGameState, ERA_NAMES,
  type GameState, type IslandStats, type NPCCommandType,
  COMMAND_YIELD, COMMAND_TERRAIN,
} from './game/GameState';
import {
  TECH_TREE, startResearch, tickResearch,
  type ResearchProgress,
} from './core/research';
import type { WorldMap } from './renderer/WorldMap';
import type { Island, NPC }   from './core/types';
import { TICKS_PER_DAY } from './core/utils';
import { establishCampfire, worldMinutes } from './core/dailyLife';
import { installGameIcons, drawGameIcon, drawSymbolIcon } from './ui/GameIcons';
import { enableSettlement, campfireSummary, shelterBeds, openingMilestones } from './core/settlement';
import {initializeWorkforce} from './core/workforce';
import {initializeEquipment} from './core/equipment';

installGameIcons();

// ── Constants ────────────────────────────────────────────────────────────────
const BASE_MS_TICK = WORLD_STEP_MS;

// ── Loading helpers ───────────────────────────────────────────────────────────
function setLoadingMsg(msg: string, pct: number): void {
  const el  = document.getElementById('loading-sub');
  const bar = document.getElementById('loading-bar');
  if (el)  el.textContent = msg;
  if (bar) bar.style.width = `${pct}%`;
}
function hideLoadingScreen(): void {
  const s = document.getElementById('loading-screen');
  if (!s) return;
  s.style.opacity = '0';
  setTimeout(() => { s.style.display = 'none'; }, 600);
}

// ── Canvas setup ──────────────────────────────────────────────────────────────
const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const ctx    = canvas.getContext('2d')!;
function resizeCanvas(): void {
  const r = canvas.getBoundingClientRect();
  if (canvas.width !== Math.round(r.width) || canvas.height !== Math.round(r.height)) {
    canvas.width  = Math.round(r.width);
    canvas.height = Math.round(r.height);
  }
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// ── Mutable game state ────────────────────────────────────────────────────────
let worldMap!:    WorldMap;
let island!:      Island;
let simulationSession!: SimulationSession;
let serverSessionClient: ServerSessionClient | null = null;
let serverPollTimer: number | null = null;
let serverPollInFlight = false;
let lastRemoteSnapshotRevision = -1;
let showStartScreenAgain: (() => void) | null = null;
let pendingServerPlacement = false;
let resources!:   ReturnType<typeof spawnResources>;
let gameState!:   GameState;
let tilemapRenderer!: TilemapRenderer;
let npcRenderer!:     NPCRenderer;
let animalRenderer!:  AnimalRenderer;
let input!:           InputHandler;
let minimap!:         Minimap;
let activeResearch:   ResearchProgress | null = null;
let npcsToPlace:      NPC[] = [];
let creaturePlacement: 'founder' | 'settler' | AnimalSpecies | null = null;
let activePanel = '';
let creatureMessage = '';
let worldConfig: WorldConfig | null = null;  // saved for save/load
// Short, action-driven onboarding.
let tutorialStep: 0 | 1 | 2 | 3 | 4 = 0;

// NPC manual command queue: npcId → pending command
const npcCommands = new Map<string, NPCCommandType>();
let localCommandSequence = 0;
const LOCAL_PLAYER_ID = 'local-player'; // Replaced by the authenticated principal in the online transport.

// ── Singleton UI ──────────────────────────────────────────────────────────────
const hud         = new HUD();
const inspector   = new InspectorPanel();
const buildingInspector = new BuildingInspector();
const buildPanel  = new BuildPanel();
const actionMenu  = new ActionMenu();
const researchPanel = new ResearchPanel();
let lastResearchMarkup = '';
const paintPanel  = new PaintPanel();
const populationPanel = new PopulationPanel();
const creaturesPanel = new CreaturesPanel();
const animalPanel  = new AnimalPanel();
const genealogyPanel = new GenealogyPanel();

function setHUDVisibility(visible: boolean) {
  const display = visible ? 'flex' : 'none';
  document.getElementById('hud-top')!.style.display = display;
  document.getElementById('toolbar-bottom')!.style.display = display;
  document.getElementById('chronicle-panel')!.style.display = visible ? 'flex' : 'none';
  document.getElementById('minimap-container')!.style.display = visible ? 'block' : 'none';
}

let isPaused = false;
let speed: 1|2|4 = 1;
let tickAccumulator  = 0;
let lastTime         = performance.now();
let lastChronicleIdx = 0;

// ── Manual command execution ──────────────────────────────────────────────────
function issueNpcCommand(npcId: string, cmd: NPCCommandType): void {
  if (serverSessionClient) {
    void serverSessionClient.issueAction(npcId, cmd).then(accepted => {
      if (!accepted) console.warn(`[server-session] action rejected: ${cmd}`);
    }).catch(error => console.error('[server-session] action failed:', error));
    return;
  }
  const result = simulationSession.submit({
    playerId: LOCAL_PLAYER_ID, sequence: ++localCommandSequence,
    command: { type: 'manual_action', npcId, action: cmd },
  });
  if (result.accepted && cmd === 'gather_food' && tutorialStep === 2) {
    tutorialStep = 3;
    updateMissionCard();
  }
}
actionMenu.onCommand(issueNpcCommand);
inspector.onCommand(issueNpcCommand);

// ── Research panel callback ───────────────────────────────────────────────────
researchPanel.onResearch((tech) => {
  if (!island || activeResearch) return;
  const reason = submitLocal({type:'start_research',techId:tech.id});
  if (reason) { window.alert(reason); return; }
  showPanel('research');
});
researchPanel.onResearcher(npcId => { const reason = submitLocal({type:'assign_researcher',npcId}); if (reason) window.alert(reason); showPanel('research'); });
// ── Helper: build IslandStats for condition checks ────────────────────────────
function buildIslandStats(): IslandStats {
  const alive      = island?.npcs.filter(n => n.isAlive) ?? [];
  const allNpcs = island?.npcs ?? [];
  const npcById = new Map(allNpcs.map(npc => [npc.id, npc]));
  const generationMemo = new Map<string, number>();
  const generationOf = (npcId: string, visiting = new Set<string>()): number => {
    const cached = generationMemo.get(npcId);
    if (cached !== undefined) return cached;
    const npc = npcById.get(npcId);
    if (!npc || visiting.has(npcId)) return 0;
    const parents = [npc.motherId, npc.fatherId]
      .filter((id): id is string => id !== null && npcById.has(id));
    if (!parents.length) return 0;
    const nextVisiting = new Set(visiting).add(npcId);
    const generation = 1 + Math.max(...parents.map(parentId => generationOf(parentId, nextVisiting)));
    generationMemo.set(npcId, generation);
    return generation;
  };
  const maxGeneration = alive.reduce((max, npc) => Math.max(max, generationOf(npc.id)), 0);
  const maxAdultGeneration = alive
    .filter(npc => npc.age >= 18)
    .reduce((max, npc) => Math.max(max, generationOf(npc.id)), 0);
  return {
    population:    alive.length,
    sharedFood:    island?.sharedFood ?? 0,
    wood:          island?.wood  ?? 0,
    stone:         island?.stone ?? 0,
    herbs:         island?.herbs ?? 0,
    buildingCount: island?.buildings.length ?? 0,
    completedBuildingCount: island?.buildings.filter(b => b.complete).length ?? 0,
    elderCount:    alive.filter(n => n.age >= 50).length,
    daysPassed:    getCurrentDay(),
    maxGeneration,
    maxAdultGeneration,
    domesticatedSpecies: [...gameState.unlocks].filter(u => u.startsWith('domesticate_')).length,
  };
}

function getCurrentDay(): number {
  return island ? Math.floor(island.tick / TICKS_PER_DAY) + 1 : 0;
}

function syncCivilization(): void {
  const c = island?.civilization;
  if (!c) return;
  gameState.era = ERAS.findIndex(e => e.id === c.era);
  gameState.unlocks = new Set(c.unlocks);
  activeResearch = c.research ?? null;
  const badge = document.getElementById('era-badge');
  if (badge) badge.textContent = ERAS.find(e => e.id === c.era)?.name ?? '';
}
function saveLocalWorld(): boolean {
  if (!island || !worldConfig || serverSessionClient || !island.civilization) return false;
  try {
    localStorage.setItem(LOCAL_SAVE_KEY, encodeSave(island, worldMap, worldConfig, tutorialStep));
    const el = document.getElementById('save-status'); if (el) el.textContent = 'Đã lưu';
    return true;
  } catch { const el = document.getElementById('save-status'); if (el) el.textContent = 'Không lưu được — kiểm tra dung lượng trình duyệt'; return false; }
}
function submitLocal(command: PlayerCommand): string | null {
  if (serverSessionClient) return 'Tính năng này đang có trong chế độ cục bộ.';
  const result = simulationSession.submit({playerId:LOCAL_PLAYER_ID,sequence:++localCommandSequence,command});
  syncCivilization();
  if (result.accepted) saveLocalWorld();
  return result.accepted ? null : result.reason ?? 'Không thể thực hiện.';
}
buildPanel.onPlace((type,x,y) => !submitLocal({type:'build',buildingType:type,tileX:x,tileY:y}));
buildingInspector.onCommand(submitLocal);
window.addEventListener('beforeunload', () => saveLocalWorld());
window.addEventListener('pagehide', () => saveLocalWorld());
document.getElementById('btn-save-local')?.addEventListener('click', () => saveLocalWorld());
document.getElementById('faith-hud')?.addEventListener('click',()=>showPanel('faith'));
document.getElementById('era-badge')?.addEventListener('click', () => showPanel('quests'));
function updateManualBadge(): void {
  let badge = document.getElementById('manual-badge');
  if (!badge) {
    badge = document.createElement('div');
    badge.id = 'manual-badge';
    document.body.appendChild(badge);
  }
  
  if(explorationPlacementNpcId){badge.textContent='Chọn mốc đất ở rìa sương mù · Esc để hủy';badge.style.display='block';}
  else if (gameState.phase === 'ENTITY_PLACE') {
    badge.textContent = creaturePlacement ? `📍 Đặt cư dân: còn ${npcsToPlace.length} người · Click ô đất trống · Esc để hủy` : '🐾 Mở tab Sinh vật để đặt nhóm cư dân khởi đầu';
    badge.style.display = 'block';
  } else if (creaturePlacement) {
    badge.textContent = '📍 Chọn ô cỏ, cát hoặc rừng trống để đặt sinh vật · Esc để hủy';
    badge.style.display = 'block';
  } else if (serverSessionClient) {
    badge.textContent = `☁ Server thử nghiệm · Ngày ${Math.floor((island?.tick ?? 0) / TICKS_PER_DAY) + 1} · đặt dân, phân công & lệnh trực tiếp`;
    badge.style.display = 'block';
  } else if (gameState.autoLevel === 0) {
    badge.textContent = '🖱️ Lệnh trực tiếp · cư dân vẫn tự làm việc hằng ngày';
    badge.style.display = 'block';
  } else {
    badge.style.display = 'none';
  }
  updateMissionCard();
}

async function pollServerSnapshot(): Promise<void> {
  if (!serverSessionClient || serverPollInFlight) return;
  serverPollInFlight = true;
  try {
    const snapshot = await serverSessionClient.fetchSnapshot();
    if (snapshot.revision > lastRemoteSnapshotRevision) {
      Object.assign(island, snapshot.island);
      resources = island.resources;
      serverSessionClient.revision = Math.max(serverSessionClient.revision, snapshot.revision);
      lastRemoteSnapshotRevision = snapshot.revision;
      npcRenderer?.syncPositions(island.npcs);
      npcsToPlace = island.npcs.filter(npc => npc.isAlive && !npc.position);
      if (gameState.phase === 'ENTITY_PLACE' && !npcsToPlace.length) {
        gameState.phase = 'PLAYING';
        creaturePlacement = null;
        tutorialStep = 1;
      }
      if (activePanel === 'creatures' && document.getElementById('panel-overlay')?.classList.contains('open')) renderCreaturesPanel();
      if (activePanel === 'population') populationPanel.updateStatuses(document.getElementById('panel-body')!, island);
      updateManualBadge();
    }
  } catch (error) {
    console.error('[server-session] snapshot failed:', error);
  } finally {
    serverPollInFlight = false;
  }
}

// ── World init (called after start screen) ────────────────────────────────────
async function initWorld(map: WorldMap, config: WorldConfig, joinedServerClient?: ServerSessionClient, restored?: SavedWorld): Promise<void> {
  gameState = createGameState();
  activeResearch = null; lastChronicleIdx = 0; tickAccumulator = restored?.island.clock?.progressMs??0;
  buildPanel.deactivate(); buildingInspector.hide();
  worldMap = map;
  explorationPlacementNpcId=null;
  // Frame the complete island at world start; users can zoom in after orientation.
  const fitZoom = Math.min(
    canvas.width / (map.width * TILE_SIZE),
    canvas.height / (map.height * TILE_SIZE),
  ) * 0.88;
  camera.zoom = fitZoom;
  camera.targetZoom = fitZoom;
  camera.x = camera.targetX = 0;
  camera.y = camera.targetY = 0;
  resources = new Map();
  serverSessionClient = null;
  if (serverPollTimer !== null) window.clearInterval(serverPollTimer);
  serverPollTimer = null;
  lastRemoteSnapshotRevision = -1;
  localCommandSequence = 0;
  if (config.mode === 'server-dev') {
    try {
      serverSessionClient = joinedServerClient ?? await ServerSessionClient.create(config);
      island = serverSessionClient.island;
      resources = island.resources;
      lastRemoteSnapshotRevision = serverSessionClient.revision;
    } catch (error) {
      console.error('[server-session] create failed:', error);
      gameState.phase = 'MENU';
      setHUDVisibility(false);
      showStartScreenAgain?.();
      window.alert(`Không kết nối được server thử nghiệm tại 127.0.0.1:3001.\n\n${error instanceof Error ? error.message : 'Lỗi kết nối'}`);
      return;
    }
  } else {
    island = restored?.island ?? createIsland('Đảo Thiên Nguyên', config.startPop);
    if (!restored) island.resources = spawnResources(worldMap, config.seed);
    resources = island.resources;
    island.civilization ??= createCivilization();
    island.dailyLife ??= { campfire: null };
    enableSettlement(island);
    initializeWorkforce(island,!restored);
    initializeEquipment(island);
    initializeLogistics(island);
    initializeFaith(island);
    initializeWeather(island,config.seed);
    initializeRaids(island);
    initializePower(island);
    establishCampfire(island, worldMap);
  }
  simulationSession = new SimulationSession(island, worldMap, () => gameState.unlocks.has('stone_tools') ? 1.5 : 1);
  if(!serverSessionClient)initializeExploration(island,worldMap,!!restored);
  if(island.exploration)refreshVisibility(island,worldMap);
  reserveEntityIds(island);
  localCommandSequence = 0;

  // Era 0: no starting resources — must gather manually
  if (!restored && !serverSessionClient) {
    island.wood  = 0;
    island.stone = 0;
    island.sharedFood = config.startPop * 5; // just enough to survive first days
    const adults = island.npcs.filter(n => n.age >= 18);
    const foodWorkers = adults.length <= 3 ? Math.ceil(adults.length * .5) : Math.min(adults.length - 2, Math.ceil(adults.length * .75));
    adults.forEach((n, i) => { n.laborRole = i < foodWorkers ? 'food' : (i - foodWorkers) % 2 === 0 ? 'wood' : 'stone'; });
  }

  if (serverSessionClient) {
    serverPollTimer = window.setInterval(() => { void pollServerSnapshot(); }, 400);
  }

  tilemapRenderer = new TilemapRenderer(worldMap);
  npcRenderer     = new NPCRenderer(worldMap);
  animalRenderer  = new AnimalRenderer(worldMap);
  if (serverSessionClient || restored) npcRenderer.syncPositions(island.npcs);
  minimap         = new Minimap(worldMap, tilemapRenderer);
  worldConfig     = config;

  // Joining clients continue only with residents the server has not placed.
  npcsToPlace = island.npcs.filter(npc => npc.isAlive && !npc.position);
  creaturePlacement = null;
  gameState.phase = npcsToPlace.length ? 'ENTITY_PLACE' : 'PLAYING';
  tutorialStep = restored ? Math.max(0, Math.min(4, restored.tutorialStep)) as 0|1|2|3|4 : joinedServerClient && npcsToPlace.length === 0 ? 1 : 0;
  
  syncCivilization();
  setPaused(Boolean(restored));
  // Show HUD
  setHUDVisibility(true);
  const missionCard = document.getElementById('mission-card');
  if (missionCard) missionCard.style.display = 'block';

  input.map = worldMap;
  input.onSelect(id => {
    if (explorationPlacementNpcId || creaturePlacement || buildPanel.active || gameState.phase === 'ENTITY_PLACE') {
      input.selectedNpcId = null;
      inspector.hide();
      actionMenu.hide();
      return;
    }
    if (!id) { inspector.hide(); return; }
    const npc = island.npcs.find(n => n.id === id);
    if (!npc) return;

    // Close building inspector when selecting NPC
    buildingInspector.hide();

    // Era 0: show action menu near the NPC
    if (gameState.autoLevel === 0 && npc.isAlive) {
      const rect  = canvas.getBoundingClientRect();
      const TILE  = 16;
      // Get ACTUAL world position from NPCRenderer state
      const state = npcRenderer.getState(npc.id);
      const wx    = state ? state.currWx : 0;
      const wy    = state ? state.currWy : 0;
      const sx    = (wx - camera.x) * camera.zoom + canvas.width  / 2;
      const sy    = (wy - camera.y) * camera.zoom + canvas.height / 2;
      const tx    = state ? state.tx : Math.floor(wx / TILE + worldMap.width  / 2);
      const ty    = state ? state.ty : Math.floor(wy / TILE + worldMap.height / 2);
      actionMenu.showAt(npc, rect.left + sx, rect.top + sy, worldMap, tx, ty);
    }

    inspector.show(npc, island);
  });

  // Update island name display
  const nameEl = document.querySelector('#island-name');
  if (nameEl) nameEl.textContent = island.name;

  updateManualBadge();

  // Start at ×1
  setSpeed(1);
  setPaused(Boolean(restored));
  const speedControls = document.getElementById('speed-buttons');
  if (speedControls) speedControls.style.display = serverSessionClient ? 'none' : 'flex';
  document.getElementById('btn-save-local')!.style.display = serverSessionClient ? 'none' : '';
  document.getElementById('save-status')!.textContent = restored ? 'Đã tải · đang tạm dừng' : '';
  actionMenu.hide();
  if (npcsToPlace.length) showPanel('creatures');
}

// ── Game speed / pause controls ───────────────────────────────────────────────
const camera = createCamera();

function setPaused(p: boolean): void {
  lastTime=performance.now();
  isPaused = p;
  document.getElementById('btn-pause')?.classList.toggle('active', isPaused);
}
function setSpeed(s: 1|2|4): void {
  lastTime=performance.now();
  speed = s; isPaused = false;
  document.querySelectorAll<HTMLElement>('.speed-btn').forEach(btn => {
    btn.classList.toggle('active', Number(btn.dataset.speed) === s);
  });
}

document.getElementById('btn-pause')?.addEventListener('click', () => setPaused(!isPaused));
document.querySelectorAll<HTMLElement>('.speed-btn[data-speed]').forEach(btn => {
  btn.addEventListener('click', () => setSpeed((Number(btn.dataset.speed) || 1) as 1|2|4));
});

// ── Keyboard shortcuts ────────────────────────────────────────────────────────
window.addEventListener('keydown', e => {
  if (e.code === 'Space' && (e.target === document.body || e.target === canvas)) {
    e.preventDefault(); setPaused(!isPaused);
  }
  if (e.code === 'KeyM') {
    const mm = document.getElementById('minimap-container');
    if (mm) mm.style.display = mm.style.display === 'none' ? '' : 'none';
  }
  if (e.code === 'Escape') {
    creaturePlacement = null;
    creatureMessage = '';
    updateManualBadge();
    input?.selectedNpcId && (input.selectedNpcId = null);
    inspector.hide();
    actionMenu.hide();
    buildingInspector.hide();
    buildPanel.deactivate();
    clearBuildCursor();
    document.getElementById('panel-overlay')?.classList.remove('open');
  }
});

// ── Toolbar panels ────────────────────────────────────────────────────────────
document.querySelectorAll<HTMLElement>('.tb-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tb-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    showPanel(btn.dataset.panel ?? '');
  });
});

document.querySelectorAll<HTMLElement>('.sidebar-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    showPanel(btn.dataset.view ?? '');
  });
});

function showPanel(panel: string): void {
  if (!island) return;
  const overlay = document.getElementById('panel-overlay')!;
  const title   = document.getElementById('panel-title')!;
  const body    = document.getElementById('panel-body')!;
  activePanel = panel;
  body.onclick = null;
  body.onchange = null;
  creaturePlacement = null;
  clearBuildCursor();
  updateManualBadge();

  const labels: Record<string, string> = {
    build:      '🏗️ Xây dựng',
    creatures:  '🐾 Sinh vật & Cư dân',
    decree:     '📜 Sắc lệnh — Phase 5',
    research:   '🔬 Nghiên cứu',
    trade:      '🚢 Giao thương — Phase 4',
    journal:    '📖 Nhật ký',
    military:   '🛡️ Phòng vệ làng',
    genealogy:  '🧬 Phả hệ — Đang phát triển',
    faith: 'Niềm tin & Thần lực',
    settings: '⚙️ Lưu & tiếp tục',
    population: '👥 Dân cư & Phân công',
    terrain:    '🏔️ Địa hình — Đang phát triển',
    resources: 'Điều hành làng & Dự trữ',
    quests:     '🧭 Lộ trình & Nhiệm vụ',
  };
  title.textContent = labels[panel] ?? panel;

  const serverUnsupportedPanels = new Set(['build', 'research', 'military', 'genealogy', 'trade', 'decree', 'resources', 'terrain', 'faith']);
  if (serverSessionClient && serverUnsupportedPanels.has(panel)) {
    body.innerHTML = '<div class="placeholder-msg">☁️ Đảo đang chạy trên server thử nghiệm. Bảng này chưa được chuyển sang xử lý server nên đang khóa để tránh trạng thái giữa trình duyệt và server bị lệch.<br><br>Hiện có thể đặt dân, xem Dân cư, phân công lao động, thu thập tài nguyên và dùng lệnh nghỉ ngơi/trò chuyện.</div>';
    overlay.classList.add('open');
    return;
  }

  if (panel === 'map') {
    overlay.classList.remove('open');
    return;
  }

  if (panel === 'population' && tutorialStep === 1) {
    tutorialStep = 2;
    updateMissionCard();
  }

  if (panel === 'research' && tutorialStep === 3) {
    tutorialStep = 4;
    updateMissionCard();
  }

  if (panel === 'creatures') {
    renderCreaturesPanel();
  } else if (panel === 'journal') {
    body.innerHTML = buildJournalHTML();
  } else if (panel === 'build') {
    body.innerHTML = buildPanel.renderHTML(island);
    body.onclick = (e) => {
      const button = (e.target as HTMLElement).closest<HTMLElement>('[data-inspect-building]');
      if (button) {
        const b = island.buildings.find(b => b.id === button.dataset.inspectBuilding);
        if (b) { overlay.classList.remove('open'); buildingInspector.show(b, island); }
        return;
      }
      if (buildPanel.handlePanelClick(e)) {
        overlay.classList.remove('open');
        showBuildCursor();
      }
    };
  } else if (panel === 'research') {
    const stats = buildIslandStats();
    lastResearchMarkup = researchPanel.renderHTML(island, gameState, stats, activeResearch);
    body.innerHTML = lastResearchMarkup;
    researchPanel.bindEvents(body, island, gameState, stats, activeResearch);
  } else if(panel==='military'){
    body.innerHTML=militaryPanelHTML(island);updateMilitaryPanel(body,island);body.onclick=event=>{const button=(event.target as HTMLElement).closest<HTMLButtonElement>('button');if(!button)return;let command:PlayerCommand|undefined;if(button.dataset.clinicRequest){const n=island.npcs.find(n=>n.id===button.dataset.clinicRequest),clinicId=body.querySelector<HTMLSelectElement>('#clinic-choice')?.value;if(n?.clinicalCare)command={type:'cancel_clinic',npcId:n.id};else if(clinicId)command={type:'request_clinic',npcId:button.dataset.clinicRequest,clinicId};}if(button.id==='cast-incite')command={type:'cast_incite'};if(button.dataset.treat){const n=island.npcs.find(n=>n.id===button.dataset.treat);command={type:n?.treatment?'cancel_treatment':'treat_npc',npcId:button.dataset.treat};}if(button.dataset.craftDefense)command={type:'craft_defense',kind:button.dataset.craftDefense as 'spear'|'padded_vest'};if(button.id==='cancel-defense')command={type:'cancel_defense'};if(button.dataset.gearNpc&&button.dataset.defenseKind){const kind=button.dataset.defenseKind as 'spear'|'padded_vest',n=island.npcs.find(n=>n.id===button.dataset.gearNpc);command={type:'choose_defense',npcId:button.dataset.gearNpc,kind,equip:!(kind==='spear'?n?.weapon:n?.armor)};}if(command){const reason=submitLocal(command);updateMilitaryPanel(body,island,reason??'Đã nhận yêu cầu. Cư dân sẽ tới kho khi có thể.');saveLocalWorld();return;}if((event.target as HTMLElement).closest('#cast-shield')){const reason=submitLocal({type:'cast_shield'});updateMilitaryPanel(body,island,reason??'Đã dựng Khiên Thần bảo vệ kho.');saveLocalWorld();}};body.onchange=event=>{const el=event.target as HTMLInputElement;if(el.dataset.guard){const reason=submitLocal({type:'set_guard',npcId:el.dataset.guard,enabled:el.checked});if(reason)el.checked=!el.checked;updateMilitaryPanel(body,island,reason??'Đã cập nhật người bảo vệ.');saveLocalWorld();}};
  } else if(panel==='faith'){
    body.innerHTML=faithPanelHTML(island);updateFaithPanel(body,island);body.onclick=event=>{const rain=(event.target as HTMLElement).closest('#cast-rainfall'),blessing=(event.target as HTMLElement).closest('#cast-blessing'),shield=(event.target as HTMLElement).closest('#cast-shield'),incite=(event.target as HTMLElement).closest('#cast-incite');if(rain||blessing||shield||incite){const reason=submitLocal({type:incite?'cast_incite':shield?'cast_shield':rain?'cast_rainfall':'cast_blessing'});updateFaithPanel(body,island,reason??(incite?'Đã Khích Lệ người bảo vệ.':shield?'Đã dựng Khiên Thần bảo vệ kho.':rain?'Đã Cầu Mưa: dập cháy và tăng năng suất ruộng.':'Đã Ban Phước cho toàn bộ lao động.'));saveLocalWorld();}};
  } else if (panel === 'population') {
    const refreshPop = () => {
      body.innerHTML = populationPanel.renderHTML(island!, Boolean(serverSessionClient))+(['hightech','mystic','eldritch'].includes(island.civilization?.anomalyBranch??'')?'<button id="open-adaptation">Thích nghi tự nguyện · xem trước và bảo dưỡng</button>':'');body.querySelector('#open-adaptation')?.addEventListener('click',()=>showPanel('quests'));
      populationPanel.bindEvents(body, island!, refreshPop, (npcId, role) => {
        if (serverSessionClient) {
          const npc = island.npcs.find(item => item.id === npcId);
          return serverSessionClient.assignLabor(npcId, role).then(accepted => {
            if (accepted && npc) npc.laborRole = role;
            return accepted;
          });
        }
        const result = simulationSession.submit({
          playerId: LOCAL_PLAYER_ID,
          sequence: ++localCommandSequence,
          expectedRevision: simulationSession.revision,
          command: { type: 'assign_labor', npcId, role },
        });
        return result.accepted;
      }, Boolean(serverSessionClient), command => !submitLocal(command));
    };
    refreshPop();
  } else if (panel === 'settings') {
    body.innerHTML = '<p>Thế giới tự lưu mỗi ngày mô phỏng và khi rời trang. Bản lưu nằm trên trình duyệt này.</p><button id="settings-save">Lưu ngay</button><p id="settings-save-result"></p>';
    body.onclick = e => { if ((e.target as HTMLElement).closest('#settings-save')) document.getElementById('settings-save-result')!.textContent = saveLocalWorld() ? 'Đã lưu thế giới và tiến trình.' : 'Không lưu được.'; };
  } else if(panel==='resources'){
    body.innerHTML=managementPanelHTML(island);updateManagementPanel(body,island);
    body.onclick=event=>{const button=(event.target as HTMLElement).closest<HTMLButtonElement>('button');if(!button)return;
      if(button.id==='manage-population'){showPanel('population');return;}if(button.id==='manage-roadmap'){showPanel('quests');return;}
      if(button.dataset.manageBuilding){const b=island.buildings.find(b=>b.id===button.dataset.manageBuilding);if(b){overlay.classList.remove('open');camera.targetX=(b.tileX-worldMap.width/2+.5)*16;camera.targetY=(b.tileY-worldMap.height/2+.5)*16;buildingInspector.show(b,island);}return;}
      if(button.id==='manage-apply'){const inputs=Array.from(body.querySelectorAll<HTMLInputElement>('[data-reserve-good]'));if(inputs.some(i=>i.value.trim()===''||!i.checkValidity())){body.querySelector('#management-feedback')!.textContent='Nhập số nguyên từ 0 đến 10.000 cho mỗi mục tiêu.';return;}const targets=Object.fromEntries(inputs.map(i=>[i.dataset.reserveGood!,Number(i.value)]));const reason=submitLocal({type:'set_reserve_targets',targets});body.querySelector('#management-feedback')!.textContent=reason??'Đã áp dụng; dân tự động điều chỉnh khi xong mẻ/chuyến.';updateManagementPanel(body,island);saveLocalWorld();}
      if(button.id==='manage-reset'){const reason=submitLocal({type:'reset_reserve_targets'});body.innerHTML=managementPanelHTML(island);updateManagementPanel(body,island);body.querySelector('#management-feedback')!.textContent=reason??'Đã trở về mục tiêu mặc định.';saveLocalWorld();}
    };
  } else if (panel === 'quests') {
    body.innerHTML = buildProgressionHTML();
    bindEraPanel();
  } else {
    body.innerHTML = `
      <div class="placeholder-msg">
        🚧 Tính năng <strong>${labels[panel] ?? panel}</strong> sẽ mở khoá sau.<br><br>
        Theo dõi Nhật ký để cập nhật tiến độ!
      </div>`;
  }
  overlay.classList.add('open');
}

function renderCreaturesPanel(): void {
  const body = document.getElementById('panel-body')!;
  body.innerHTML = (worldMap.archipelago?'<div class="archipelago-navigation"><p>Đặt dân trên Thiên Nguyên, gần bãi định cư được đánh dấu.</p><button data-region-focus="primary">Đến Thiên Nguyên</button><button data-region-focus="overview">Xem ba đảo</button></div>':'') + creaturesPanel.renderHTML(island, gameState, Boolean(serverSessionClient)) +
    (creatureMessage ? `<p class="creature-feedback" role="status">${creatureMessage}</p>` : '');
  body.onclick = event => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button');
    if (!button || button.disabled) return;
    if (button.dataset.feed && !serverSessionClient) {
      feedAnimal(island, button.dataset.feed, 10);
      renderCreaturesPanel();
      return;
    }
    if (!button.dataset.creature) return;
    creaturePlacement = button.dataset.creature as NonNullable<typeof creaturePlacement>;
    buildPanel.deactivate();
    inspector.hide();
    actionMenu.hide();
    document.getElementById('panel-overlay')?.classList.remove('open');
    canvas.style.cursor = 'crosshair';
    creatureMessage = '';
    updateManualBadge();
  };
}

async function placeCreature(tx: number, ty: number): Promise<void> {
  if (!creaturePlacement || pendingServerPlacement) return;
  const kind = creaturePlacement;
  if(worldMap.archipelago&&['founder','settler'].includes(kind)&&regionAt(worldMap,tx,ty)?.id!=='thien-nguyen'){const badge=document.getElementById('manual-badge');if(badge)badge.textContent='Dân định cư trên Thiên Nguyên; chưa có đường vượt biển. Bạn chưa mất tài nguyên.';return;}
  const tile = worldMap.tiles[ty]?.[tx];
  if (!['grass', 'sand', 'forest'].includes(tile) || getBuildingAt(island, tx, ty) ||
      island.npcs.some(n => n.isAlive && n.position?.tileX === tx && n.position?.tileY === ty) ||
      island.animals.some(a => a.isAlive && a.tileX === tx && a.tileY === ty)) {
    const badge = document.getElementById('manual-badge');
    if (badge) badge.textContent = '⚠ Chọn một ô cỏ, cát hoặc rừng trống. Bạn chưa mất tài nguyên.';
    return;
  }
  pendingServerPlacement = true;
  try {
    if (kind === 'founder') {
      const npc = npcsToPlace[0];
      if (!npc) return;
      const accepted = serverSessionClient
        ? await serverSessionClient.placeNPC(npc.id, tx, ty)
        : simulationSession.submit({ playerId: LOCAL_PLAYER_ID, sequence: ++localCommandSequence, command: { type: 'place_npc', npcId: npc.id, tileX: tx, tileY: ty } }).accepted;
      if (!accepted) throw new Error('Vị trí đã thay đổi. Hãy mở Sinh vật và chọn lại.');
      const placed = island.npcs.find(current => current.id === npc.id);
      if (placed) placed.position = { tileX: tx, tileY: ty };
      npcRenderer.syncPositions(island.npcs);
      npcsToPlace = island.npcs.filter(current => current.isAlive && !current.position);
      if (!npcsToPlace.length) {
        gameState.phase = 'PLAYING';
        tutorialStep = 1;
        creaturePlacement = null;
      }
    } else if (kind === 'settler') {
      const reason = canInviteSettler(island);
      if (reason) throw new Error(reason);
      const accepted = serverSessionClient
        ? await serverSessionClient.inviteSettler(tx, ty)
        : simulationSession.submit({ playerId: LOCAL_PLAYER_ID, sequence: ++localCommandSequence, command: { type: 'invite_settler', tileX: tx, tileY: ty } }).accepted;
      if (!accepted) throw new Error('Chưa thể đón cư dân. Kiểm tra tài nguyên và chỗ ở trong tab Sinh vật.');
      if (serverSessionClient) await pollServerSnapshot();
      else npcRenderer.syncPositions(island.npcs);
      creaturePlacement = null;
    } else {
      if (serverSessionClient || !gameState.unlocks.has(`domesticate_${kind}`)) return;
      const count = island.animals.filter(a => a.isAlive && a.species === kind).length;
      if (count >= ANIMAL_CONFIG[kind].maxHerd) throw new Error('Đàn đã đạt giới hạn.');
      island.animals.push(createAnimal(kind, tx, ty));
      animalRenderer.onTick(island.animals);
      creaturePlacement = null;
    }
    if (!creaturePlacement) clearBuildCursor();
    updateManualBadge();
  } catch (error) {
    creatureMessage = error instanceof Error ? error.message : 'Không thể đặt sinh vật. Hãy thử lại.';
    showPanel('creatures');
  } finally {
    pendingServerPlacement = false;
  }
}

function showBuildCursor(): void {
  canvas.style.cursor = 'crosshair';
  if (buildPanel.selected) canvas.title = `🏗️ Đặt: ${BUILD_LABELS[buildPanel.selected as import('./core/types').BuildingType]} — Click ô đất phù hợp`;
}
function clearBuildCursor(): void {
  canvas.style.cursor = 'grab';
  canvas.title = '';
}

function buildJournalHTML(): string {
  const entries = island.chronicle.slice(-80).reverse();
  if (entries.length === 0) return '<div class="placeholder-msg">Chưa có sự kiện nào.</div>';
  return entries.map(e => {
    const cls = `log-entry log-${e.importance}`;
    return `<div class="${cls}">[Ngày ${e.day}] ${e.message}</div>`;
  }).join('');
}

function foodReserveTarget(): number {
  return (island?.npcs ?? []).filter(npc => npc.isAlive).reduce((total, npc) => {
    if (npc.occupation === 'child' || npc.age < 18) return total + 10;
    return total + (npc.isPregnant ? 25 : 20);
  }, 0);
}

function buildProgressionHTML(): string { return archipelagoPanelHTML(worldMap,island)+eraPanelHTML(island); }
function bindEraPanel(): void {
  const body = document.getElementById('panel-body')!;
  body.onchange=e=>{const input=e.target as HTMLSelectElement;if(input.id==='tidal-scout-choice'){selectTidalScout(input.value);return;}if(input.id==='explorer-choice'){selectExplorer(input.value);body.innerHTML=buildProgressionHTML();bindEraPanel();return;}if(input.id==='adapt-lab'){selectAdaptationLab(input.value);const scroll=body.scrollTop;body.innerHTML=buildProgressionHTML();bindEraPanel();body.scrollTop=scroll;return;}const select=(e.target as HTMLElement).closest<HTMLSelectElement>('select[data-power-priority]');if(!select)return;const b=island.buildings.find(b=>b.id===select.dataset.powerPriority);if(b){
    submitLocal({type:'set_power',buildingId:b.id,enabled:b.powerEnabled!==false,priority:Number(select.value)});
    // Commit feedback immediately even while paused; retain the selected control and scroll.
    const scroll=body.scrollTop;body.innerHTML=buildProgressionHTML();bindEraPanel();body.scrollTop=scroll;
    body.querySelector<HTMLSelectElement>(`[data-power-priority="${CSS.escape(b.id)}"]`)?.focus({preventScroll:true});
  }};
  body.onclick = e => {
    const target = (e.target as HTMLElement).closest<HTMLElement>('button');
    if(target?.id==='send-tidal-scout'||target?.id==='recall-tidal-scout'){const id=body.querySelector<HTMLSelectElement>('#tidal-scout-choice')?.value;const reason=target.id==='recall-tidal-scout'?submitLocal({type:'recall_tidal_scout'}):id?submitLocal({type:'tidal_scout',npcId:id}):'Chọn trinh sát.';if(reason&&island.tides)island.tides.message=reason;body.innerHTML=buildProgressionHTML();bindEraPanel();saveLocalWorld();return;}
    if(target?.id==='wildlife-care'){showPanel('military');return;}
    if(target?.id==='place-explore-marker'){const id=body.querySelector<HTMLSelectElement>('#explorer-choice')?.value;if(id){explorationPlacementNpcId=id;document.getElementById('panel-overlay')?.classList.remove('open');inspector.hide();buildPanel.deactivate();creaturePlacement=null;const badge=document.getElementById('manual-badge');if(badge){badge.textContent='Chọn mốc đất ở rìa sương mù · Esc để hủy';badge.style.display='block';}}return;}
    if(target&&(['recall-explorer','craft-exploration-torch','cancel-exploration-torch','take-exploration-torch','refill-exploration-torch','toggle-patrol'].includes(target.id)||target.dataset.visitDiscovery)){
      const id=body.querySelector<HTMLSelectElement>('#explorer-choice')?.value,n=island.npcs.find(n=>n.id===id);let command:PlayerCommand|undefined;
      if(n&&target.id==='toggle-patrol')command={type:'set_patrol',npcId:n.id,enabled:!island.exploration?.patrol?.enabled};
      if(n&&target.dataset.visitDiscovery)command={type:'visit_discovery',npcId:n.id,pointId:target.dataset.visitDiscovery};
      if(target.id==='recall-explorer')command={type:'recall_explorer'};
      if(target.id==='cancel-exploration-torch')command={type:'cancel_torch'};
      if(n&&target.id==='craft-exploration-torch')command={type:'craft_torch',npcId:n.id};
      if(n&&target.id==='take-exploration-torch')command={type:'choose_torch',npcId:n.id,equip:!n.torch};
      if(n&&target.id==='refill-exploration-torch')command={type:'choose_torch',npcId:n.id,equip:true,refill:true};
      if(command){const reason=submitLocal(command);if(reason&&island.exploration)island.exploration.message=reason;body.innerHTML=buildProgressionHTML();bindEraPanel();saveLocalWorld();}return;
    }
    if(target?.dataset.adaptManage){const b=island.buildings.find(b=>b.id===target.dataset.adaptManage);if(b){document.getElementById('panel-overlay')?.classList.remove('open');camera.targetX=(b.tileX-worldMap.width/2+.5)*16;camera.targetY=(b.tileY-worldMap.height/2+.5)*16;buildingInspector.show(b,island);}return;}
    if(target?.id==='adapt-lab-toggle'||target?.id==='adapt-generator-toggle'){const id=target.id==='adapt-lab-toggle'?body.querySelector<HTMLSelectElement>('#adapt-lab')?.value:island.buildings.find(b=>b.type==='steam_generator'&&b.complete&&!b.upgrade)?.id;const b=island.buildings.find(b=>b.id===id);if(b){submitLocal({type:'set_power',buildingId:b.id,enabled:b.powerEnabled===false,priority:b.powerPriority??1});body.innerHTML=buildProgressionHTML();bindEraPanel();}return;}
    if(target?.dataset.adaptStart){const labId=body.querySelector<HTMLSelectElement>('#adapt-lab')?.value;const reason=labId?submitLocal({type:'start_adaptation',npcId:target.dataset.adaptStart,labId,mode:target.dataset.adaptMode as 'apply'|'service'|'remove'}):'Chọn viện trước.';body.innerHTML=eraPanelHTML(island,reason??'Đã nhận dự án hỗ trợ cư dân.');bindEraPanel();return;}
    if(target?.id==='cancel-adaptation'){const reason=submitLocal({type:'cancel_adaptation'});body.innerHTML=eraPanelHTML(island,reason??'Đã hủy và hoàn vật tư một lần.');bindEraPanel();return;}
    if(target?.dataset.relicToggle){const b=island.buildings.find(b=>b.id===target.dataset.relicToggle);if(b){const reason=submitLocal({type:'set_relic_extraction',buildingId:b.id,enabled:b.relicEnabled===false});body.innerHTML=eraPanelHTML(island,reason??'Đã đổi chế độ thu mẫu.');bindEraPanel();}return;}
    if(target?.dataset.spiritToggle){const b=island.buildings.find(b=>b.id===target.dataset.spiritToggle);if(b){const reason=submitLocal({type:'set_spirit_extraction',buildingId:b.id,enabled:b.spiritEnabled===false});body.innerHTML=eraPanelHTML(island,reason??'Đã đổi chế độ khai thác.');bindEraPanel();}return;}
    if(target?.dataset.startBranch){const labId=body.querySelector<HTMLSelectElement>('#branch-lab')?.value;const reason=labId?submitLocal({type:'start_branch',branch:target.dataset.startBranch,labId}):'Chọn viện trước.';body.innerHTML=eraPanelHTML(island,reason??'Đã trả phí và bắt đầu dự án.');bindEraPanel();return;}
    if(target?.id==='cancel-branch'){const reason=submitLocal({type:'cancel_branch'});body.innerHTML=eraPanelHTML(island,reason??'Đã hủy và hoàn phí một lần.');bindEraPanel();return;}
    if(target?.dataset.startAnalysis){const labId=body.querySelector<HTMLSelectElement>('#analysis-lab')?.value;const reason=labId?submitLocal({type:'start_analysis',siteId:target.dataset.startAnalysis,labId}):'Chọn cơ sở trước.';body.innerHTML=eraPanelHTML(island,reason??'Đã bắt đầu phân tích.');bindEraPanel();return;}
    if(target?.dataset.siteDecision){const decision=target.dataset.siteDecision as 'research'|'contain'|'ignore',labId=body.querySelector<HTMLSelectElement>('#analysis-lab')?.value;const reason=submitLocal({type:'decide_site',siteId:target.dataset.site!,decision,labId});body.innerHTML=eraPanelHTML(island,reason??'Đã ghi quyết định.');bindEraPanel();return;}
    if(target?.id==='cancel-foundation'){const reason=submitLocal({type:'cancel_foundation'});body.innerHTML=eraPanelHTML(island,reason??'Đã hủy dự án nền tảng.');bindEraPanel();return;}
    if(target?.id==='cancel-analysis'){const reason=submitLocal({type:'cancel_analysis'});body.innerHTML=eraPanelHTML(island,reason??'Đã hủy và hoàn vật tư.');bindEraPanel();return;}
    if(target?.dataset.startSurvey){
      const npcId=body.querySelector<HTMLSelectElement>('#survey-worker')?.value;
      const reason=npcId?submitLocal({type:'start_survey',siteId:target.dataset.startSurvey,npcId}):'Chọn cư dân trước khi khởi hành.';
      body.innerHTML=eraPanelHTML(island,reason??'Đội đã khởi hành, phí đã trả.');bindEraPanel();return;
    }
    if(target?.id==='cancel-survey'){const reason=submitLocal({type:'cancel_survey'});body.innerHTML=eraPanelHTML(island,reason??'Đã hủy chuyến và hoàn vật tư.');bindEraPanel();return;}
    if(target?.dataset.powerToggle){const b=island.buildings.find(b=>b.id===target.dataset.powerToggle);if(b){submitLocal({type:'set_power',buildingId:b.id,enabled:b.powerEnabled===false,priority:b.powerPriority??1});body.innerHTML=buildProgressionHTML();bindEraPanel();}return;}
    if (target?.dataset.eraPanel) { showPanel(target.dataset.eraPanel); return; }
    if (target?.id === 'btn-develop-era') {
      const reason = submitLocal({type:'develop_era'});
      body.innerHTML = eraPanelHTML(island, reason ?? 'Đã bắt đầu; dân vẫn làm việc trong thời gian phát triển.'); bindEraPanel();
    }
  };
}
function updateMissionCard(): void {
  const description = document.getElementById('mc-desc');
  const fill = document.getElementById('mc-progress');
  const fraction = document.getElementById('mc-fraction');
  if (!description || !fill || !fraction || !island) return;

  if (gameState.phase === 'ENTITY_PLACE') {
    const total = island.npcs.length;
    const placed = total - npcsToPlace.length;
    const joinCode = serverSessionClient ? ` Mã đảo để tham gia cùng: ${serverSessionClient.islandId}.` : '';
    description.textContent = `Mở tab Sinh vật → Đặt cư dân khởi đầu, rồi click đất trống để đặt đủ ${total} người. Ưu tiên gần rừng và bờ biển.${joinCode}`;
    fraction.textContent = `${placed} / ${total} đã đặt`;
    fill.style.width = `${total ? Math.round(placed / total * 100) : 0}%`;
    return;
  }

  if (!island.npcs.some(npc => npc.isAlive)) {
    description.textContent = 'Nền văn minh đã sụp đổ vì không còn cư dân sống. Hãy khởi tạo một thế giới mới và dự trữ thức ăn trước khi kho cạn.';
    fraction.textContent = 'Đảo sụp đổ';
    fill.style.width = '100%';
    fill.style.background = 'var(--c-red)';
    return;
  }

  if (serverSessionClient) {
    description.textContent = `Đảo test đang chạy trong bộ nhớ. Chia sẻ mã này để mở cùng đảo ở cửa sổ khác: ${serverSessionClient.islandId}. Có thể phân công và gửi lệnh dân cư; xây dựng, nghiên cứu và chiến đấu chưa bật.`;
    fraction.textContent = `Ngày ${Math.floor(island.tick / TICKS_PER_DAY) + 1} · trạng thái đồng bộ từ server`;
    fill.style.width = '100%';
    return;
  }

  if(island.exploration?.active){description.textContent=island.exploration.message;fraction.textContent='Khám phá · gọi về trong Nhiệm vụ';fill.style.width='50%';return;}
  if(island.dailyLife?.settlementVersion===1&&tutorialStep>0&&island.civilization?.era==='stone'){
    const beds=island.buildings.reduce((sum,b)=>sum+shelterBeds(b),0),placed=island.npcs.filter(n=>n.isAlive&&n.position).length;
    const tent=island.buildings.some(b=>b.complete&&['tent','house'].includes(b.type));
    const storage=island.buildings.some(b=>b.complete&&['stockpile','storehouse'].includes(b.type));
    const fuel=island.dailyLife.campfire?.fuel??0;
    let step=1,text='Phân công thực phẩm, gỗ và đá. Hàng khai thác chỉ vào kho sau khi dân mang về lửa trại hoặc bãi chứa.';
    if(island.wood>=8||island.buildings.some(b=>b.type==='tent')){step=2;text='Mở Xây dựng và đặt Lều sơ khai (8 gỗ). Phân công một thợ xây; mỗi lều có ba chỗ ngủ.';}
    if(tent){step=3;text='Dựng Bãi chứa sơ khai (6 gỗ, 2 đá) gần tài nguyên để rút ngắn đường giao hàng và thêm 100 chỗ thức ăn.';}
    if(tent&&storage){step=4;text=`Chuẩn bị ${Math.ceil(placed/3)} lều hoặc nhà cho ${placed} dân (${beds} chỗ hiện có). Giữ người kiếm gỗ: lửa cần 4 củi/đêm, người rảnh tự tiếp củi.`;}
    if(tent&&storage&&beds>=placed&&fuel>4){step=5;text='Chặng Khởi nguyên: đã đủ chỗ ngủ, bãi chứa và củi. Xây Bến câu sát nguồn cá và Bàn nghiên cứu sơ khai (6 gỗ, 2 đá), rồi nghiên cứu Lửa.';}
    if(tent&&storage&&beds>=placed&&fuel>4&&island.buildings.some(b=>b.complete&&b.type==='study_table')&&island.civilization?.unlocks.includes('fire'))text='Khởi nguyên hoàn tất. Tiếp tục Công cụ đá → Tổ chức nghiên cứu → Nông nghiệp; mở lộ trình Đồ Đồng để theo dõi điều kiện.';
    if(island.tick>=(island.dailyLife.campfire?.graceUntil??Infinity)&&fuel<=4)text=`⚠ ${campfireSummary(island)}. Phân công người kiếm gỗ; giữ một người rảnh để đi tiếp củi. ${text}`;
    const milestones=openingMilestones(island),done=milestones.filter(m=>m.met).length;
    if(step===5)text=`Khởi nguyên ${done}/6. Còn: ${milestones.filter(m=>!m.met).map(m=>m.label).join(', ')}. Xem các mốc trong tab Xây dựng.`;
    if(done===milestones.length)text='Khởi nguyên hoàn tất. Tiếp tục Công cụ đá → Tổ chức nghiên cứu → Nông nghiệp; mở lộ trình Đồ Đồng để theo dõi điều kiện.';
    description.textContent=text;fraction.textContent=done===milestones.length?'Khởi nguyên hoàn tất':`Bước ${step} / 5`;fill.style.width=`${step*20}%`;return;
  }
  if (tutorialStep > 0 && tutorialStep < 4) {
    const steps = [
      '',
      'Mở bảng Dân cư để chọn ưu tiên và theo dõi dân đi đến tài nguyên, thu hoạch rồi chuyển vào kho.',
      'Kiểm tra số người làm thực phẩm, gỗ và đá. Đổi ưu tiên để dân tìm nơi làm việc; kho tăng sau khi họ đến nơi và thu hoạch xong.',
      'Chọn một cư dân trên bản đồ và dùng Hái lượm để hiểu lệnh trực tiếp: +20 thức ăn ngoài sản lượng lao động thường ngày.',
      'Mở “Nghiên cứu” để xem công nghệ, chi phí và điều kiện mở khóa. Những mục đang khóa sẽ ghi rõ lý do.',
    ];
    description.textContent = steps[tutorialStep];
    fraction.textContent = `Bước ${tutorialStep} / 3`;
    fill.style.width = `${Math.round(tutorialStep / 3 * 100)}%`;
    return;
  }

  if (tutorialStep === 4) {
    const target = foodReserveTarget();
    if (island.sharedFood < target) {
      description.textContent = `⚠ Kho còn ${Math.floor(island.sharedFood)} / ${target} thức ăn cho một bữa toàn đảo. Ra lệnh hái lượm hoặc câu cá trước khi kho cạn.`;
      fraction.textContent = 'Cần tiếp tế';
      fill.style.width = `${Math.min(100, Math.round(island.sharedFood / Math.max(1, target) * 100))}%`;
      return;
    }
    description.textContent = 'Đã hoàn tất hướng dẫn cơ bản. Theo dõi điều kiện kỷ nguyên và cân bằng thức ăn với nhu cầu dân cư.';
    fraction.textContent = island.civilization?.era === 'bronze' ? 'Đồ Đồng đã mở' : 'Click tên kỷ nguyên để tiến cấp';
    if(island.civilization?.era==='iron'){ description.textContent='Đồ Sắt: luyện sắt, dệt vải, giao thương và kiến trúc cấp 3. Mở lộ trình để xem kho hàng.'; fraction.textContent='Đồ Sắt đã mở'; }
    if(island.civilization?.era==='modern'){description.textContent='Hiện Đại: thép, đồng và điện tạo linh kiện. Nâng cấp nhà máy bằng sản phẩm; mở Lộ trình để xem mục tiêu.';fraction.textContent='Hiện Đại đã mở';}
    if(island.civilization?.transition?.target==='modern'){
      const transition=island.civilization.transition;
      description.textContent='Đang phát triển lên Hiện Đại trong 5 ngày; đã trả phí, cư dân vẫn làm việc. Tiến độ được lưu.';
      fraction.textContent=`${Math.floor(100*transition.workTicks/transition.ticksNeeded)}%`;
      fill.style.width=fraction.textContent;return;
    }
    fill.style.width = '100%';
    return;
  }

  const c = island.civilization;
  if (c?.transition) {
    description.textContent = 'Đang phát triển lên Đồ Đồng; cư dân vẫn làm việc. Tiến độ được lưu.';
    if(c.transition.target==='iron')description.textContent='Đang phát triển lên Đồ Sắt; cư dân vẫn làm việc. Tiến độ được lưu.';
    if(c.transition.target==='modern')description.textContent='Đang phát triển lên Hiện Đại trong 5 ngày; đã trả phí, cư dân vẫn làm việc. Tiến độ được lưu.';
    fraction.textContent = `${Math.floor(100*c.transition.workTicks/c.transition.ticksNeeded)}%`;
    fill.style.width = fraction.textContent; return;
  }
  description.textContent = c?.era === 'bronze' ? 'Đồ Đồng: khai thác quặng, luyện đồng và chế biến gỗ xẻ. Mở lộ trình để xem kho hàng.' : 'Mục tiêu Đồ Đồng: phát triển dân cư, nghiên cứu và sản xuất thực tế. Click tên kỷ nguyên để xem điều kiện.';
  fraction.textContent = c?.era === 'bronze' ? 'Đồ Đồng đã mở' : 'Xem lộ trình';
  fill.style.width = '100%';
}

document.getElementById('panel-close')?.addEventListener('click', () => {
  document.getElementById('panel-overlay')?.classList.remove('open');
});
document.getElementById('panel-overlay')?.addEventListener('click', e => {
  if (e.target === document.getElementById('panel-overlay'))
    document.getElementById('panel-overlay')?.classList.remove('open');
});

// ── Hover tooltip ─────────────────────────────────────────────────────────────
canvas.addEventListener('mousemove', (e: MouseEvent) => {
  if (!input) return;
  const rect = canvas.getBoundingClientRect();
  const sx   = e.clientX - rect.left;
  const sy   = e.clientY - rect.top;
  const hid  = input.getHoveredNpcId(sx, sy, canvas.width, canvas.height, camera);
  const tip  = document.getElementById('tooltip')!;
  if (hid) {
    const npc = island?.npcs.find(n => n.id === hid);
    if (npc?.isAlive) {
      const cmd = npcCommands.get(npc.id);
      tip.textContent = `${npc.name.split('#')[0]} · ${npc.occupation}${cmd ? ` · [${cmd}]` : ''} · Đói ${Math.round(npc.needs.hunger)}%`;
      tip.style.left  = `${e.clientX + 12}px`;
      tip.style.top   = `${e.clientY - 8}px`;
      tip.classList.remove('hidden');
      canvas.style.cursor = buildPanel.active || creaturePlacement ? 'crosshair' : 'pointer';
      return;
    }
  }
  tip.classList.add('hidden');
  canvas.style.cursor = buildPanel.active || creaturePlacement ? 'crosshair' : 'grab';
});
canvas.addEventListener('mouseleave', () => {
  document.getElementById('tooltip')?.classList.add('hidden');
  if (!buildPanel.active && !creaturePlacement) canvas.style.cursor = 'grab';
});

// ── Minimap click ─────────────────────────────────────────────────────────────
document.getElementById('minimap-canvas')?.addEventListener('click', (e) => {
  minimap?.onMinimapClick(e as MouseEvent, camera, canvas.width, canvas.height);
});
for (const [id, direction] of [['btn-zoom-in', 1], ['btn-zoom-out', -1]] as const) {
  document.getElementById(id)?.addEventListener('click', () => {
    zoomAt(camera, canvas.width / 2, canvas.height / 2, direction, canvas.width, canvas.height);
  });
}

// ── Map click & drag: placement, build mode, paint mode ─────────────────────
let isPainting = false;
let paintMoved = false; // track if mouse actually moved (to distinguish click vs stroke)

canvas.addEventListener('mousedown', (e: MouseEvent) => {
  if (gameState.phase === 'MAP_PAINT' && e.button === 0) {
    isPainting = true;
    paintMoved = false;
    paintPanel.beginBatch();
    handlePaint(e);
  }
});

canvas.addEventListener('mousemove', (e: MouseEvent) => {
  if (gameState.phase === 'MAP_PAINT') {
    // Always update cursor position display
    const rect2 = canvas.getBoundingClientRect();
    const sx2 = e.clientX - rect2.left;
    const sy2 = e.clientY - rect2.top;
    const wx2 = (sx2 - canvas.width  / 2) / camera.zoom + camera.x;
    const wy2 = (sy2 - canvas.height / 2) / camera.zoom + camera.y;
    const TILE2 = 16;
    const tx2 = Math.floor(wx2 / TILE2 + worldMap.width  / 2);
    const ty2 = Math.floor(wy2 / TILE2 + worldMap.height / 2);
    if (tx2 >= 0 && ty2 >= 0 && tx2 < worldMap.width && ty2 < worldMap.height) {
      paintPanel.updateCursor(tx2, ty2, worldMap.tiles[ty2][tx2]);
      // Hover cursor: show ruler preview
      if (paintPanel.showDistanceRuler && paintPanel.rulerStart) {
        paintPanel.updateCursor(tx2, ty2, worldMap.tiles[ty2][tx2]);
      }
    }
    if (isPainting) {
      paintMoved = true;
      handlePaint(e);
    }
  }
});

canvas.addEventListener('mouseup', (e: MouseEvent) => {
  if (isPainting && gameState.phase === 'MAP_PAINT') {
    paintPanel.commitBatch();
    updatePaintStats();
    // Ruler: click (not drag) sets start point
    if (!paintMoved && paintPanel.showDistanceRuler) {
      const rect3 = canvas.getBoundingClientRect();
      const sx3 = e.clientX - rect3.left;
      const sy3 = e.clientY - rect3.top;
      const wx3 = (sx3 - canvas.width  / 2) / camera.zoom + camera.x;
      const wy3 = (sy3 - canvas.height / 2) / camera.zoom + camera.y;
      const TILE3 = 16;
      const tx3 = Math.floor(wx3 / TILE3 + worldMap.width  / 2);
      const ty3 = Math.floor(wy3 / TILE3 + worldMap.height / 2);
      paintPanel.rulerStart = { tx: tx3, ty: ty3 };
    }
  }
  isPainting = false;
});

canvas.addEventListener('mouseleave', () => {
  if (isPainting && gameState.phase === 'MAP_PAINT') {
    paintPanel.commitBatch();
    updatePaintStats();
  }
  isPainting = false;
  document.getElementById('tooltip')?.classList.add('hidden');
  if (!buildPanel.active && gameState.phase !== 'MAP_PAINT') canvas.style.cursor = 'grab';
});

// ── Undo / Redo callbacks ─────────────────────────────────────────────────────
paintPanel.onUndo((batch) => {
  for (const snap of batch) {
    tilemapRenderer.updateTile(snap.tileX, snap.tileY, snap.oldTile);
  }
  updatePaintStats();
});
paintPanel.onRedo((batch) => {
  for (const snap of batch) {
    tilemapRenderer.updateTile(snap.tileX, snap.tileY, snap.newTile);
  }
  updatePaintStats();
});

// Count tile distribution for stats
function updatePaintStats(): void {
  if (!worldMap) return;
  const counts: Record<string, number> = {};
  let total = 0;
  for (const row of worldMap.tiles) {
    for (const tile of row) {
      counts[tile] = (counts[tile] ?? 0) + 1;
      total++;
    }
  }
  paintPanel.updateStats(counts as any, total);
}

function handlePaint(e: MouseEvent) {
  const rect = canvas.getBoundingClientRect();
  const sx   = e.clientX - rect.left;
  const sy   = e.clientY - rect.top;
  const wx   = (sx - canvas.width  / 2) / camera.zoom + camera.x;
  const wy   = (sy - canvas.height / 2) / camera.zoom + camera.y;
  const TILE = 16;
  const tx   = Math.floor(wx / TILE + worldMap.width  / 2);
  const ty   = Math.floor(wy / TILE + worldMap.height / 2);

  if (!tilemapRenderer) return;

  const half = Math.floor(paintPanel.brushSize / 2);
  const radiusSq = (paintPanel.brushSize === 1) ? 0 : (half + 0.5) ** 2;

  if (paintPanel.mode === 'terrain') {
    for (let dy = -half; dy <= half; dy++) {
      for (let dx = -half; dx <= half; dx++) {
        // Circle brush for sizes > 1
        if (paintPanel.brushSize > 1 && dx*dx + dy*dy > radiusSq) continue;
        const nx = tx + dx, ny = ty + dy;
        if (nx < 0 || ny < 0 || nx >= worldMap.width || ny >= worldMap.height) continue;
        if (island?.dailyLife?.campfire?.tileX === nx && island.dailyLife.campfire.tileY === ny && !['grass','sand','forest'].includes(paintPanel.selectedBrush)) continue;
        const oldTile = worldMap.tiles[ny][nx];
        paintPanel.recordTile(nx, ny, oldTile, paintPanel.selectedBrush);
        tilemapRenderer.updateTile(nx, ny, paintPanel.selectedBrush);
      }
    }
  } else if (paintPanel.mode === 'resource') {
    // Place resource node on the center tile (only if terrain allows)
    const node = resources?.get(`${tx},${ty}`);
    if (!node) {
      // Use import() to access ResourceType - amount config from game design
      const RESOURCE_AMOUNTS: Record<string, [number, number, number]> = {
        wood_tree:     [40, 120, 0.5],
        stone_deposit: [80, 200, 0],
        herb_patch:    [20,  60, 1.0],
        fish_spot:     [50, 150, 2.0],
        copper_vein:   [100,300, 0],
        clay_deposit: [120,240, 0],
        iron_vein:[150,300,0],coal_deposit:[150,300,0],
        fertile_soil:  [1,    1, 0],
      };
      const [minA, maxA, regen] = RESOURCE_AMOUNTS[paintPanel.selectedResource] ?? [10, 50, 0];
      const amount = minA + Math.floor(Math.random() * (maxA - minA + 1));
      resources?.set(`${tx},${ty}`, {
        type: paintPanel.selectedResource as import('./core/types').ResourceType,
        amount,
        maxAmount: amount,
        regenRate: regen,
      });
    }
  } else if (paintPanel.mode === 'erase') {
    // Erase: remove resource, or paint deep_water
    if (resources?.has(`${tx},${ty}`)) {
      resources.delete(`${tx},${ty}`);
    } else {
      for (let dy = -half; dy <= half; dy++) {
        for (let dx = -half; dx <= half; dx++) {
          if (paintPanel.brushSize > 1 && dx*dx + dy*dy > radiusSq) continue;
          const nx = tx + dx, ny = ty + dy;
          if (nx < 0 || ny < 0 || nx >= worldMap.width || ny >= worldMap.height) continue;
          if (island?.dailyLife?.campfire?.tileX === nx && island.dailyLife.campfire.tileY === ny) continue;
          const oldTile = worldMap.tiles[ny][nx];
          paintPanel.recordTile(nx, ny, oldTile, 'deep_water');
          tilemapRenderer.updateTile(nx, ny, 'deep_water');
        }
      }
    }
  }
}

// ── Draw overlay: grid, ruler, brush preview ──────────────────────────────────
function drawPaintOverlay(W: number, H: number): void {
  if (gameState.phase !== 'MAP_PAINT') return;
  const TILE = 16;

  // Grid
  if (paintPanel.showGrid) {
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0.5;
    const mapW = worldMap.width * TILE;
    const mapH = worldMap.height * TILE;
    const topLeftWx = -(worldMap.width  * TILE) / 2;
    const topLeftWy = -(worldMap.height * TILE) / 2;

    // Draw vertical lines every tile
    for (let col = 0; col <= worldMap.width; col++) {
      const wx = topLeftWx + col * TILE;
      const sx = (wx - camera.x) * camera.zoom + W / 2;
      if (sx < -1 || sx > W + 1) continue;
      const sy0 = (-mapH / 2 - camera.y) * camera.zoom + H / 2;
      const sy1 = ( mapH / 2 - camera.y) * camera.zoom + H / 2;
      ctx.beginPath();
      ctx.moveTo(sx, sy0);
      ctx.lineTo(sx, sy1);
      ctx.stroke();
    }
    // Draw horizontal lines every tile
    for (let row = 0; row <= worldMap.height; row++) {
      const wy = topLeftWy + row * TILE;
      const sy = (wy - camera.y) * camera.zoom + H / 2;
      if (sy < -1 || sy > H + 1) continue;
      const sx0 = (-mapW / 2 - camera.x) * camera.zoom + W / 2;
      const sx1 = ( mapW / 2 - camera.x) * camera.zoom + W / 2;
      ctx.beginPath();
      ctx.moveTo(sx0, sy);
      ctx.lineTo(sx1, sy);
      ctx.stroke();
    }

    // Grid labels every 10 tiles (only when zoomed in enough)
    if (camera.zoom >= 0.5) {
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = '#ffffff';
      ctx.font = `${Math.max(8, Math.min(11, 9 * camera.zoom))}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      for (let col = 0; col < worldMap.width; col += 10) {
        const wx = topLeftWx + (col + 0.5) * TILE;
        const sx = (wx - camera.x) * camera.zoom + W / 2;
        const sy = (-mapH / 2 - camera.y) * camera.zoom + H / 2 + 2;
        if (sx >= 0 && sx <= W) ctx.fillText(String(col), sx, sy);
      }
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      for (let row = 0; row < worldMap.height; row += 10) {
        const wy = topLeftWy + (row + 0.5) * TILE;
        const sy = (wy - camera.y) * camera.zoom + H / 2;
        const sx = (-mapW / 2 - camera.x) * camera.zoom + W / 2 + 2;
        if (sy >= 0 && sy <= H) ctx.fillText(String(row), sx, sy);
      }
    }
    ctx.restore();
  }

  // Ruler line from rulerStart to current mouse
  if (paintPanel.showDistanceRuler && paintPanel.rulerStart) {
    // We draw from rulerStart to last known hover tile (updated via coordEl)
    const rs = paintPanel.rulerStart;
    const rsWx = (rs.tx - worldMap.width  / 2 + 0.5) * TILE;
    const rsWy = (rs.ty - worldMap.height / 2 + 0.5) * TILE;
    const rsSx = (rsWx - camera.x) * camera.zoom + W / 2;
    const rsSy = (rsWy - camera.y) * camera.zoom + H / 2;

    ctx.save();
    // Draw point marker at ruler start
    ctx.fillStyle = '#00c896';
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.arc(rsSx, rsSy, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.7;
    ctx.strokeStyle = '#00c896';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 4]);
    // Ruler end will be drawn when we have cursor position — we draw to last hover
    // (stored in rulerEndSx/Sy which we track in mousemove)
    if (_rulerEndSx !== null && _rulerEndSy !== null) {
      ctx.beginPath();
      ctx.moveTo(rsSx, rsSy);
      ctx.lineTo(_rulerEndSx, _rulerEndSy);
      ctx.stroke();
      // Distance label
      const midX = (rsSx + _rulerEndSx) / 2;
      const midY = (rsSy + _rulerEndSy) / 2;
      const dx = Math.round((_rulerEndSx - rsSx) / (TILE * camera.zoom));
      const dy = Math.round((_rulerEndSy - rsSy) / (TILE * camera.zoom));
      const distTiles = Math.round(Math.sqrt(dx*dx + dy*dy));
      const distMeters = distTiles * 10; // 1 tile = 10m per GDD
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillStyle = '#000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const labelW = 80, labelH = 20;
      ctx.fillRect(midX - labelW/2, midY - labelH/2, labelW, labelH);
      ctx.fillStyle = '#00c896';
      ctx.fillText(`${distTiles} tile ≈ ${distMeters}m`, midX, midY);
    }
    ctx.restore();
  }
}

let _rulerEndSx: number | null = null;
let _rulerEndSy: number | null = null;

// Track ruler endpoint via mousemove (supplement to existing handler above)
canvas.addEventListener('mousemove', (e: MouseEvent) => {
  if (gameState.phase === 'MAP_PAINT' && paintPanel.showDistanceRuler) {
    const rect4 = canvas.getBoundingClientRect();
    _rulerEndSx = e.clientX - rect4.left;
    _rulerEndSy = e.clientY - rect4.top;
  }
});

canvas.addEventListener('click', (e: MouseEvent) => {
  if (gameState.phase === 'MAP_PAINT') return;

  const rect = canvas.getBoundingClientRect();
  const sx   = e.clientX - rect.left;
  const sy   = e.clientY - rect.top;
  const wx   = (sx - canvas.width  / 2) / camera.zoom + camera.x;
  const wy   = (sy - canvas.height / 2) / camera.zoom + camera.y;
  const TILE = 16;
  const tx   = Math.floor(wx / TILE + worldMap.width  / 2);
  const ty   = Math.floor(wy / TILE + worldMap.height / 2);

  if(explorationPlacementNpcId){const reason=submitLocal({type:'explore',npcId:explorationPlacementNpcId,tileX:tx,tileY:ty});if(reason){if(island.exploration)island.exploration.message=reason;const badge=document.getElementById('manual-badge');if(badge)badge.textContent=reason;}else{explorationPlacementNpcId=null;saveLocalWorld();showPanel('quests');}return;}
  if (creaturePlacement) {
    void placeCreature(tx, ty);
    return;
  }
  if (gameState.phase === 'ENTITY_PLACE') return;
  // 2) Build Mode — place new building
  if (buildPanel.active && buildPanel.selected) {
    if (buildPanel.tryPlace(island, worldMap, tx, ty)) {
      clearBuildCursor(); buildPanel.deactivate();
      buildingInspector.show(island.buildings[island.buildings.length - 1], island);
    } else {
      const badge = document.getElementById('manual-badge');
      if (badge) badge.textContent = 'Chọn đúng loại đất và ô trống. Kiểm tra chi phí trong bảng Xây dựng.';
    }
    return;
  }

  if(!knownTile(island,tx,ty))return;
  // 3) Click on existing building → open Building Inspector
  if (island) {
    const existingBuilding = getBuildingAt(island, tx, ty);
    if (existingBuilding) {
      inspector.hide();
      actionMenu.hide();
      if (input) input.selectedNpcId = null;
      buildingInspector.show(existingBuilding, island);
      return;
    }
  }
});

// ── Expose island npcs globally for NPCRenderer → Minimap pos tracking ────────
function syncGlobalNpcs(): void {
  if (island) (globalThis as any).__islandNpcs = island.npcs;
}

// ── Main game loop ────────────────────────────────────────────────────────────
function gameLoop(now: number): void {
  const elapsed=Math.max(0,now-lastTime);
  const dt = Math.min(elapsed, 200);
  lastTime = now;

  if (!isPaused && island && gameState.phase==='PLAYING') {
    if (serverSessionClient) tickAccumulator = 0;
    else tickAccumulator += elapsed * speed;
    while (tickAccumulator >= BASE_MS_TICK) {
      tickAccumulator -= BASE_MS_TICK;
      if(island.clock)island.clock.progressMs=tickAccumulator%BASE_MS_TICK;
      // Only tick AI if playing and autoLevel >= 3
      if (gameState.phase === 'PLAYING') {
        if (gameState.autoLevel >= 3) simulationSession.advanceTicks(1, true);
        else tickManual();

        npcRenderer.syncPositions(island.npcs);
        tickAnimals(island, worldMap);
        applyDogGuardBonus(island);
        animalRenderer.onTick(island.animals);
        island.sharedFood = Math.min(island.sharedFood, foodCapacity(island));
        if (island.buildings.some(b => b.complete && b.type === 'temple')) gameState.unlocks.add('temple_built');

        // Research tick
        const day = getCurrentDay();
        syncCivilization();

        // Era advance check every 10 ticks (1 day)
        if (island.tick % TICKS_PER_DAY === 0) {
          saveLocalWorld();
          gameState.daysPassed = day;
        }
        updateMissionCard();
      }


      // Live-update journal if open
      const overlay = document.getElementById('panel-overlay');
      const panelTitle = document.getElementById('panel-title');
      if (overlay?.classList.contains('open') && panelTitle?.textContent?.includes('Nhật ký')) {
        document.getElementById('panel-body')!.innerHTML = buildJournalHTML();
      }
      if (overlay?.classList.contains('open') && activePanel === 'research' && document.activeElement?.id !== 'research-worker') {
        const body = document.getElementById('panel-body')!;
        const stats = buildIslandStats();
        const markup = researchPanel.renderHTML(island, gameState, stats, activeResearch);
        if (markup !== lastResearchMarkup) {
          const scrollTop = body.scrollTop;
          body.innerHTML = markup;
          lastResearchMarkup = markup;
          body.scrollTop = scrollTop;
          researchPanel.bindEvents(body, island, gameState, stats, activeResearch);
        }
      }
      if (overlay?.classList.contains('open') && activePanel==='quests' && !(document.activeElement instanceof HTMLSelectElement)) {
        const body=document.getElementById('panel-body')!,scroll=body.scrollTop,opened=Array.from(body.querySelectorAll<HTMLDetailsElement>('details[data-decision-key][open]')).map(e=>e.dataset.decisionKey),lab=body.querySelector<HTMLSelectElement>('#analysis-lab')?.value,branchLab=body.querySelector<HTMLSelectElement>('#branch-lab')?.value;
        body.innerHTML=buildProgressionHTML();bindEraPanel();
        body.querySelectorAll<HTMLDetailsElement>('details[data-decision-key]').forEach(e=>e.open=opened.includes(e.dataset.decisionKey));
        const selected=body.querySelector<HTMLSelectElement>('#analysis-lab');if(selected&&lab&&Array.from(selected.options).some(o=>o.value===lab))selected.value=lab;
        const branchSelect=body.querySelector<HTMLSelectElement>('#branch-lab');if(branchSelect&&branchLab&&Array.from(branchSelect.options).some(o=>o.value===branchLab))branchSelect.value=branchLab;
        body.scrollTop=scroll;
      }
      if (overlay?.classList.contains('open') && activePanel === 'creatures') renderCreaturesPanel();
      if(overlay?.classList.contains('open')&&activePanel==='resources')updateManagementPanel(document.getElementById('panel-body')!,island);
      if (overlay?.classList.contains('open') && activePanel === 'military') updateMilitaryPanel(document.getElementById('panel-body')!,island);
      if (overlay?.classList.contains('open') && activePanel === 'faith') updateFaithPanel(document.getElementById('panel-body')!,island);
      if (overlay?.classList.contains('open') && activePanel === 'population') populationPanel.updateStatuses(document.getElementById('panel-body')!, island);
    }
  }

  updateCamera(camera, dt);
  resizeCanvas();
  const W = canvas.width, H = canvas.height;

  ctx.fillStyle = '#269abc';
  ctx.fillRect(0, 0, W, H);

  if (tilemapRenderer && worldMap) {
    tilemapRenderer.draw(ctx, camera, W, H);
    drawResourceMarkers(W, H);
    drawPaintOverlay(W, H);
  }

  drawTidalGround(ctx,worldMap,camera,W,H,gameState.phase==='ENTITY_PLACE'||gameState.phase==='MAP_PAINT'?undefined:island);
  if (npcRenderer && island) {
    const lerpT = isPaused ? 1 : Math.min(tickAccumulator / EFFECT_STEP_MS, 1);
    npcRenderer.draw(ctx, camera, W, H, lerpT, input?.selectedNpcId ?? null, island.npcs,island.civilization?.era??'stone',island.tick*BASE_MS_TICK+tickAccumulator);
    animalRenderer.draw(ctx, island.animals, camera, W, H, lerpT, null);
  }

  // Draw building icons on tiles
  if (island) drawBuildingMarkers(W, H);
  if (island?.dailyLife && (worldMinutes(island.tick) >= 1200 || worldMinutes(island.tick) < 360)) {
    ctx.fillStyle = 'rgba(15,28,65,.22)'; ctx.fillRect(0,0,W,H);
  }
  if (island?.dailyLife?.campfire) {
    const fire = island.dailyLife.campfire;
    const x = W / 2 + ((fire.tileX - worldMap.width / 2 + .5) * 16 - camera.x) * camera.zoom;
    const y = H / 2 + ((fire.tileY - worldMap.height / 2 + .5) * 16 - camera.y) * camera.zoom;
    ctx.save(); ctx.textAlign = 'center'; ctx.font = `${Math.max(16, 20 * camera.zoom)}px sans-serif`;
    ctx.shadowColor = '#ffb44d'; ctx.shadowBlur = fire.lit===false?0:14; ctx.globalAlpha=fire.lit===false?.4:1; drawGameIcon(ctx, 'fire', x, y - 6, Math.max(20, 25 * camera.zoom)); ctx.globalAlpha=1;
    ctx.shadowBlur = 0; ctx.font = '11px sans-serif'; ctx.fillStyle = '#fff4d1';
    ctx.fillText(fire.lit===false?'Lửa đã tắt':'Lửa trại',x,y+15);
    ctx.restore();
  }
  if(island?.weather){
    for(const fire of island.weather.fires){const [tx,ty]=fire.key.split(',').map(Number),x=W/2+((tx-worldMap.width/2+.5)*16-camera.x)*camera.zoom,y=H/2+((ty-worldMap.height/2+.5)*16-camera.y)*camera.zoom;ctx.save();ctx.shadowColor='#f57622';ctx.shadowBlur=14;drawGameIcon(ctx,'fire',x,y-8,Math.max(18,24*camera.zoom));ctx.restore();}
    if(isRaining(island)){ctx.save();ctx.fillStyle='rgba(40,80,130,.08)';ctx.fillRect(0,0,W,H);ctx.strokeStyle='rgba(170,220,245,.45)';ctx.lineWidth=1;ctx.beginPath();const phase=island.weather.clockMs/10;for(let i=0;i<75;i++){const x=(i*137+phase)%W,y=(i*97+phase*2)%H;ctx.moveTo(x,y);ctx.lineTo(x-4,y+12);}ctx.stroke();ctx.restore();}
  }
  if(island?.raids){const r=island.raids;ctx.save();
    for(const e of r.enemies){const x=W/2+((e.x-worldMap.width/2+.5)*16-camera.x)*camera.zoom,y=H/2+((e.y-worldMap.height/2+.5)*16-camera.y)*camera.zoom;ctx.fillStyle='#b23b32';ctx.strokeStyle='#f8dc97';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,Math.max(6,7*camera.zoom),0,Math.PI*2);ctx.fill();ctx.stroke();drawGameIcon(ctx,'raider',x,y,Math.max(16,20*camera.zoom));ctx.fillStyle='#ffdf95';ctx.fillRect(x-8,y-15,16*e.health/36,3);}
    if(r.clockMs<r.shieldUntilMs){for(const t of island.buildings.filter(b=>b.complete&&['stockpile','storehouse'].includes(b.type)).map(b=>({x:b.tileX,y:b.tileY})).concat(island.dailyLife?.campfire?[{x:island.dailyLife.campfire.tileX,y:island.dailyLife.campfire.tileY}]:[])){const x=W/2+((t.x-worldMap.width/2+.5)*16-camera.x)*camera.zoom,y=H/2+((t.y-worldMap.height/2+.5)*16-camera.y)*camera.zoom;ctx.strokeStyle='#8de4ff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,22*camera.zoom,0,Math.PI*2);ctx.stroke();drawGameIcon(ctx,'shield',x,y-25*camera.zoom,20*camera.zoom);}}
    if(r.phase!=='peace'){ctx.fillStyle='#51291d';ctx.fillRect(W/2-190,120,380,38);ctx.fillStyle='#ffe1a0';ctx.font='14px sans-serif';ctx.textAlign='center';ctx.fillText(raidSummary(island),W/2,144,360);}ctx.restore();
  }
  if (island) drawTradeRoutes(W,H);

  if (island) {
    if(!serverSessionClient&&island.clock)island.clock.progressMs=tickAccumulator;
    hud.update(island, isPaused, speed);
    lastChronicleIdx = updateChronicle(island.chronicle, lastChronicleIdx);
    if(gameState.phase!=='ENTITY_PLACE'&&gameState.phase!=='MAP_PAINT')drawFog(ctx,island,worldMap,camera,W,H);
    drawIslandRegions(ctx,worldMap,camera,W,H,gameState.phase==='ENTITY_PLACE'||gameState.phase==='MAP_PAINT'?undefined:island);
    minimap?.draw(island.npcs, camera, W, H,gameState.phase==='ENTITY_PLACE'||gameState.phase==='MAP_PAINT'?undefined:island);
    syncGlobalNpcs();

    // Refresh building inspector if open
    if (buildingInspector.isVisible()) {
      buildingInspector.refresh(island);
    }

    if (input?.selectedNpcId && inspector.isVisible()) {
      const npc = island.npcs.find(n => n.id === input.selectedNpcId);
      if (npc?.isAlive) inspector.show(npc, island);
      else { inspector.hide(); input.selectedNpcId = null; }
    }
  }

  requestAnimationFrame(gameLoop);
}

// ── Manual tick: only process needs, not AI decisions ────────────────────────
function tickManual(): void {
  simulationSession.advanceTicks(1, false);
}
// ── Draw resource markers on canvas ──────────────────────────────────────────
function drawTradeRoutes(W:number,H:number):void {
  if(!island||!worldMap)return;
  const point=(x:number,y:number)=>({x:((x-worldMap.width/2+.5)*16-camera.x)*camera.zoom+W/2,y:((y-worldMap.height/2+.5)*16-camera.y)*camera.zoom+H/2});
  ctx.save();
  for(const b of island.buildings){
    const s=b.shipment;if(!s)continue;
    const from=point(b.tileX,b.tileY),to=point(s.destination.x,s.destination.y),npc=island.npcs.find(n=>n.id===s.workerId);
    ctx.strokeStyle='#f1df9a';ctx.lineWidth=2;ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(from.x,from.y);ctx.lineTo(to.x,to.y);ctx.stroke();ctx.setLineDash([]);
    drawGameIcon(ctx,'trade',to.x+14,to.y-12,Math.max(16,10*camera.zoom));
    if(npc?.position){const p=point(npc.position.tileX,npc.position.tileY);drawGameIcon(ctx,'trade',p.x-15,p.y-12,Math.max(16,10*camera.zoom));}
  }
  ctx.restore();
}
function drawResourceMarkers(W: number, H: number): void {
  // The render loop runs on the empty-ocean start screen, before resources exist.
  if (!resources) return;

  const TILE = 16;
  resources.forEach((node, key) => {
    if (node.amount <= 0) return;
    const parts = key.split(',');
    const tx = Number(parts[0]);
    const ty = Number(parts[1]);
    const wx = (tx - worldMap.width  / 2 + 0.5) * TILE;
    const wy = (ty - worldMap.height / 2 + 0.5) * TILE;
    const sx = (wx - camera.x) * camera.zoom + W / 2;
    const sy = (wy - camera.y) * camera.zoom + H / 2;

    if (sx < -20 || sy < -20 || sx > W + 20 || sy > H + 20) return;

    const size = Math.max(6, 9 * camera.zoom);
    ctx.font = `${size}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = 0.58; // resource markers stay legible without overpowering terrain
    drawSymbolIcon(ctx,RESOURCE_ICONS[node.type] ?? '',sx,sy,size * 1.35);
    ctx.globalAlpha = 1.0;
  });
}

// ── Draw building markers on canvas ──────────────────────────────────────────
function drawBuildingMarkers(W: number, H: number): void {
  const TILE = 16;
  for (const b of island.buildings) {
    const wx = (b.tileX - worldMap.width  / 2 + 0.5) * TILE;
    const wy = (b.tileY - worldMap.height / 2 + 0.5) * TILE;
    const sx = (wx - camera.x) * camera.zoom + W / 2;
    const sy = (wy - camera.y) * camera.zoom + H / 2;

    if (sx < -20 || sy < -20 || sx > W + 20 || sy > H + 20) continue;

    const size = Math.max(24, 30 * camera.zoom);
    ctx.save();
    ctx.globalAlpha = b.complete ? 1 : .55;
    drawBuildingTexture(ctx, b.type, buildingLevel(b), sx, sy, size, b.technology);
    ctx.restore();
    if (!b.complete || b.upgrade) {
      ctx.strokeStyle = '#e2ba6a'; ctx.lineWidth = 2;
      ctx.strokeRect(sx - size * .36, sy - size * .47, size * .72, size * .58);
    }
    ctx.font = `bold ${Math.max(9, size * .24)}px sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#394a3c'; ctx.fillRect(sx + size * .22, sy - size * .58, 14, 12);
    ctx.fillStyle = '#fff2cc'; ctx.fillText(String(buildingLevel(b)), sx + size * .22 + 7, sy - size * .58 + 6);

    // Progress bar if under construction
    if (!b.complete || b.upgrade) {
      const bw = size * 1.4;
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(sx - bw/2, sy + size/2, bw, 4);
      ctx.fillStyle = '#00c896';
      ctx.fillRect(sx - bw/2, sy + size/2, bw * ((b.upgrade?.progress ?? b.progress)/100), 4);
    }
  }
}

// ── BOOT: Show start screen first ─────────────────────────────────────────────
gameState = createGameState();
setLoadingMsg('Khởi tạo...', 100);

// Hide HUD initially
setHUDVisibility(false);

// Create an initial empty ocean map before starting
const emptyTiles = Array.from({ length: 60 }, () => Array(100).fill('deep_water'));
worldMap = { width: 100, height: 60, tiles: emptyTiles, landTiles: [] };
tilemapRenderer = new TilemapRenderer(worldMap);

// Instantiate input early so player can pan the ocean
input = new InputHandler(canvas, camera, worldMap, () => npcRenderer, () => island ? island.npcs : []);

setTimeout(() => {
  hideLoadingScreen();

  // Start the background render loop (so we see the ocean)
  requestAnimationFrame(gameLoop);

  const startScreen = new StartScreen();
  showStartScreenAgain = () => startScreen.show();
  startScreen.onResume(() => {
    try {
      const saved = readLocalSave(); if (!saved) return;
      startScreen.hide();
      void initWorld(saved.map, saved.config, undefined, saved).then(() => showPanel('quests'));
    } catch (error) { window.alert(error instanceof Error ? error.message : 'Không đọc được bản lưu.'); }
  });
  startScreen.show();

  let paintConfig: any = null;

  startScreen.onStart((map, config) => {
    const previous = localStorage.getItem(LOCAL_SAVE_KEY);
    if (previous) localStorage.setItem(LOCAL_SAVE_KEY + '_backup', previous);
    // Transition: start screen → game
    void initWorld(map, config).then(() => console.log('🏝️ Island session initialized'));
  });

  startScreen.onJoin(islandId => {
    void (async () => {
      try {
        const { client, config } = await ServerSessionClient.join(islandId);
        const dimensions = { small: [50, 35], medium: [80, 50], large: [120, 80] } as const;
        const [width, height] = dimensions[config.size];
        const map = generateWorldMap(width, height, config.seed, config.shape);
        await initWorld(map, config, client);
      } catch (error) {
        console.error('[server-session] join failed:', error);
        gameState.phase = 'MENU';
        showStartScreenAgain?.();
        window.alert(`Không thể tham gia đảo tại 127.0.0.1:3001. Kiểm tra mã đảo và đảm bảo server còn chạy.\n\n${error instanceof Error ? error.message : 'Lỗi kết nối'}`);
      }
    })();
  });

  startScreen.onPaint(() => {
    gameState.phase = 'MAP_PAINT';
    // Start with a blank medium map for painting
    const paintMap = generateWorldMap(80, 50, Math.floor(Math.random() * 99999), 'circle');
    worldMap = paintMap;
    tilemapRenderer = new TilemapRenderer(worldMap);
    if (input) input.map = worldMap;
    resources = new Map();
    paintPanel.show();
    // Initialize stats display
    updatePaintStats();
    paintConfig = { startPop: 8, seed: Math.floor(Math.random() * 99999) };
    canvas.style.cursor = 'crosshair';
    console.log('🖌️ Paint Mode activated');
  });

  paintPanel.onDone(() => {
    gameState.phase = 'PLAYING';
    canvas.style.cursor = 'grab';
    initWorld(worldMap, paintConfig);
  });
}, 300);

window.addEventListener('keydown',e=>{if(e.key==='Escape'){explorationPlacementNpcId=null;updateManualBadge();}});

document.addEventListener('click',event=>{const button=(event.target as HTMLElement).closest<HTMLElement>('[data-open-explorer]');if(button?.dataset.openExplorer){selectExplorer(button.dataset.openExplorer);inspector.hide();showPanel('quests');}});

// Camera navigation does not reveal tiles or move inhabitants.
document.addEventListener('click',event=>{const button=(event.target as HTMLElement).closest<HTMLElement>('[data-region-focus]');if(!button||!worldMap.archipelago)return;const region=worldMap.archipelago.islands.find(r=>r.id==='thien-nguyen')!;if(button.dataset.regionFocus==='causeway'&&worldMap.causeway){const c=worldMap.causeway;camera.targetX=((c.main.x+c.fang.x)/2-worldMap.width/2+.5)*16;camera.targetY=((c.main.y+c.fang.y)/2-worldMap.height/2+.5)*16;camera.targetZoom=Math.min(canvas.width/(32*16),canvas.height/(28*16));}else if(button.dataset.regionFocus==='primary'){camera.targetX=(region.center.x-worldMap.width/2+.5)*16;camera.targetY=(region.center.y-worldMap.height/2+.5)*16;camera.targetZoom=Math.min(canvas.width/(region.bounds.width*16),canvas.height/(region.bounds.height*16))*.8;}else{camera.targetX=camera.targetY=0;camera.targetZoom=Math.min(canvas.width/(worldMap.width*16),canvas.height/(worldMap.height*16))*.88;}document.getElementById('panel-overlay')?.classList.remove('open');});
