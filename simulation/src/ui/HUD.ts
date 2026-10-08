import {TIME_SCALE} from '../core/WorldClock';
import {weatherSummary} from '../core/WeatherManager';
import {tideLabel} from '../core/TidalManager';
import {faithRate,FAITH_CAP,divinePhase,faithMorale} from '../core/FaithManager';
// ============================================================
// HUD.ts — Updates the DOM top bar (resources, gauge, time)
// ============================================================

import type { Island } from '../core/types';
import type { ChronicleEntry } from '../core/types';
import { estimateFoodDays } from '../core/labor';
import { foodCapacity } from '../renderer/BuildingManager';
import { worldMinutes, dayPhase } from '../core/dailyLife';
import { iconHTML } from './GameIcons';
import { campfireSummary, shelterBeds } from '../core/settlement';

export function computeHappiness(island:Island):number{return Math.round(faithMorale(island).happiness);}
export function computeFear(island:Island):number{return Math.round(faithMorale(island).fear);}

export class HUD {
  private happinessEl:  HTMLElement;
  private fearEl:       HTMLElement;
  private popEl:        HTMLElement;
  private foodEl:       HTMLElement;
  private foodDaysEl:   HTMLElement | null;
  private dayEl:        HTMLElement;
  private woodEl:       HTMLElement | null;
  private stoneEl:      HTMLElement | null;
  private herbsEl:      HTMLElement | null;
  private gaugeCanvas:  HTMLCanvasElement;
  private gaugeCtx:     CanvasRenderingContext2D | null;
  private speedBtns:    NodeListOf<HTMLElement>;
  private pauseBtn:     HTMLElement;
  private barHappiness: HTMLElement | null;
  private barFear:      HTMLElement | null;

  // Smooth display values
  private displayHappiness = 50;
  private displayFear      = 20;

  constructor() {
    this.happinessEl  = document.getElementById('stat-happiness')!;
    this.fearEl       = document.getElementById('stat-fear')!;
    this.popEl        = document.getElementById('stat-pop')!;
    this.foodEl       = document.getElementById('stat-food')!;
    this.foodDaysEl   = document.getElementById('stat-food-days');
    this.dayEl        = document.getElementById('stat-day')!;
    this.woodEl       = document.getElementById('stat-wood');
    this.stoneEl      = document.getElementById('stat-stone');
    this.herbsEl      = document.getElementById('stat-herbs');
    this.gaugeCanvas  = document.getElementById('dual-gauge') as HTMLCanvasElement;
    this.gaugeCtx     = this.gaugeCanvas?.getContext('2d') ?? null;
    this.speedBtns    = document.querySelectorAll<HTMLElement>('.speed-btn[data-speed]');
    this.pauseBtn     = document.getElementById('btn-pause')!;
    this.barHappiness = document.getElementById('bar-happiness');
    this.barFear      = document.getElementById('bar-fear');
  }

  update(island: Island, isPaused: boolean, speed: number): void {
    const tide=document.getElementById('tide-status');if(tide){tide.style.display=island.tides?'':'none';tide.textContent=island.tides?tideLabel(island.tick,island.clock?.progressMs??0):'';tide.title=island.tides?.active?island.tides.message:'Bãi cạn Răng Nanh · xem Nhiệm vụ để cử trinh sát.';}
    const faithButton=document.getElementById('faith-hud'),faithValue=document.getElementById('faith-hud-value'),faithFill=document.getElementById('faith-hud-fill'),faithRegen=document.getElementById('faith-hud-rate');
    if(faithButton)faithButton.style.display=island.faith?'':'none';
    if(island.faith){if(faithValue)faithValue.textContent=`Niềm tin ${Math.floor(island.faith.amount)}/${FAITH_CAP}`;if(faithFill)faithFill.style.width=`${100*island.faith.amount/FAITH_CAP}%`;if(faithRegen)faithRegen.textContent=`+${(faithRate(island)/TIME_SCALE).toFixed(2)}/giây · ${divinePhase(island)==='blessed'?'Ban Phước':divinePhase(island)==='exhausted'?'Kiệt sức':'Thần lực'}`;}
    const weather=document.getElementById('weather-status');if(weather)weather.textContent=weatherSummary(island);
    const shelter=document.getElementById('settlement-shelter'),fire=document.getElementById('settlement-fire');
    if(shelter)shelter.textContent=`${island.buildings.reduce((sum,b)=>sum+shelterBeds(b),0)} chỗ ngủ / ${island.npcs.filter(n=>n.isAlive&&n.position).length} dân`;
    if(fire){fire.textContent=campfireSummary(island);fire.classList.toggle('warning',(island.dailyLife?.campfire?.fuel??0)<=4&&island.tick>=(island.dailyLife?.campfire?.graceUntil??Infinity));}
    const warning=document.getElementById('food-reserve-warning'),residents=island.npcs.filter(n=>n.isAlive&&n.position),reserve=estimateFoodDays(residents,island.sharedFood);if(warning){warning.style.display=residents.length>0&&reserve<2?'':'none';warning.textContent=`Lương thực còn ${reserve.toFixed(1)} ngày · thêm người trồng trọt/vận chuyển, rút đội xưởng đang tắt nếu cần`;warning.classList.add('warning');}
    const alive     = island.npcs.filter(n => n.isAlive).length;
    const happiness = computeHappiness(island);
    const fear      = computeFear(island);

    // Smooth towards real values
    this.displayHappiness += (happiness - this.displayHappiness) * 0.08;
    this.displayFear      += (fear      - this.displayFear)      * 0.08;

    const h = Math.round(this.displayHappiness);
    const f = Math.round(this.displayFear);

    this.happinessEl.textContent = `${h}%`;
    this.fearEl.textContent      = `${f}%`;
    this.popEl.textContent        = String(alive);
    this.foodEl.textContent       = String(Math.round(island.sharedFood));
    this.foodEl.parentElement?.setAttribute('title', `Lương thực: ${Math.round(island.sharedFood)} / ${foodCapacity(island)}. Xây hoặc nâng cấp kho để tăng sức chứa.`);
    if (this.foodDaysEl) {
      const days = estimateFoodDays(island.npcs, island.sharedFood);
      this.foodDaysEl.textContent = `≈ ${days.toFixed(1)} ngày`;
      this.foodDaysEl.style.color = days < 2 ? 'var(--c-red)' : days < 4 ? 'var(--c-amber)' : 'var(--t-lo)';
      this.foodDaysEl.title = 'Ước tính số ngày dự trữ, gồm kho chung và kho riêng';
    }
    this.dayEl.textContent        = String(Math.floor(island.tick / 10) + 1);
    const timeEl = document.getElementById('world-time');
    if (timeEl) {
      const minutes = Math.floor(worldMinutes(island.tick,island.clock?.progressMs??0));
      timeEl.textContent = `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
      timeEl.title = `1 ngày = 120 giây ở tốc độ 1× · 1 giờ = 5 giây. ${dayPhase(island.tick,island.clock?.progressMs??0)} · Một khẩu phần người lớn = 20 thức ăn; bữa tối ăn theo mức đói. Lửa trại đầu tiên chưa tiêu hao củi.`;
      timeEl.dataset.phase = dayPhase(island.tick,island.clock?.progressMs??0);
      const symbol = timeEl.parentElement?.querySelector('span');
      const icon = dayPhase(island.tick,island.clock?.progressMs??0) === 'Lao động' ? 'sun' : dayPhase(island.tick,island.clock?.progressMs??0) === 'Bữa tối' ? 'meal' : 'moon';
      if (symbol && symbol.dataset.icon !== icon) { symbol.innerHTML=iconHTML(icon); symbol.dataset.icon=icon; }
    }
    if (this.woodEl)  this.woodEl.textContent  = String(Math.round(island.wood));
    if (this.stoneEl) this.stoneEl.textContent = String(Math.round(island.stone));
    if (this.herbsEl) this.herbsEl.textContent = String(Math.round(island.herbs ?? 0));
    for (const kind of ['copperOre','copper','lumber','clay','bricks','pottery','wheat','ironOre','coal','iron','fiber','cloth'] as const) {
      const chip = document.getElementById(`chip-${kind}`), value = document.getElementById(`stat-${kind}`);
      if (chip) chip.style.display = island.civilization && island.civilization.era!=='stone' && (!['ironOre','coal','iron','fiber','cloth'].includes(kind)||island.civilization.era==='iron') ? 'flex' : 'none';
      if (value) value.textContent = String(Math.floor(island.civilization?.inventory[kind] ?? 0));
    }

    // Drive new inline mood bars
    if (this.barHappiness) this.barHappiness.style.width = `${h}%`;
    if (this.barFear)      this.barFear.style.width      = `${f}%`;

    // Pause / speed button states
    this.pauseBtn.classList.toggle('active', isPaused);
    this.pauseBtn.setAttribute('aria-pressed',String(isPaused));
    this.speedBtns.forEach(btn => {
      btn.classList.toggle('active', Number(btn.dataset.speed) === speed && !isPaused);
    });

    // Draw legacy canvas gauge (hidden via CSS)
    if (this.gaugeCtx) this.drawGauge(h / 100, f / 100);
  }

  private drawGauge(happinessFrac: number, fearFrac: number): void {
    const canvas = this.gaugeCanvas;
    const ctx    = this.gaugeCtx;
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H * 0.92;
    const outerR = Math.min(W / 2, H) - 4;
    const innerR = outerR * 0.58;
    const trackR = (outerR + innerR) / 2;
    const trackW = outerR - innerR;

    ctx.clearRect(0, 0, W, H);

    const startAngle = Math.PI;       // left (9 o'clock)
    const endAngle   = 2 * Math.PI;  // right (3 o'clock)
    const halfPi     = Math.PI;

    // ── Track (background arc) ───────────────────────────────
    ctx.lineWidth   = trackW;
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.beginPath();
    ctx.arc(cx, cy, trackR, startAngle, endAngle);
    ctx.stroke();

    // ── Happiness arc (left half, green, grows right from left edge) ──
    if (happinessFrac > 0.01) {
      const grad = ctx.createLinearGradient(0, cy, W/2, cy);
      grad.addColorStop(0, '#1e7c40');
      grad.addColorStop(1, '#2ecc71');
      ctx.lineWidth   = trackW;
      ctx.strokeStyle = grad;
      ctx.lineCap     = 'round';
      ctx.beginPath();
      // Left arc spans from π (left) to 2π (top-center); happiness fills from left
      ctx.arc(cx, cy, trackR, Math.PI, Math.PI + happinessFrac * halfPi);
      ctx.stroke();
    }

    // ── Fear arc (right half, red, grows left from right edge) ──
    if (fearFrac > 0.01) {
      const grad = ctx.createLinearGradient(W/2, cy, W, cy);
      grad.addColorStop(0, '#e74c3c');
      grad.addColorStop(1, '#922b21');
      ctx.lineWidth   = trackW;
      ctx.strokeStyle = grad;
      ctx.lineCap     = 'round';
      ctx.beginPath();
      // Right arc spans from 2π (top-center) back to π (right); fear fills from right
      ctx.arc(cx, cy, trackR, 2 * Math.PI - fearFrac * halfPi, 2 * Math.PI);
      ctx.stroke();
    }

    // ── Center divider tick ──────────────────────────────────
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth   = 2;
    ctx.lineCap     = 'square';
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerR);
    ctx.lineTo(cx, cy - innerR);
    ctx.stroke();

    // ── Labels ───────────────────────────────────────────────
    ctx.font      = `bold ${Math.round(H * 0.22)}px "Inter", sans-serif`;
    ctx.textAlign = 'center';

    // Happiness value
    ctx.fillStyle = '#2ecc71';
    ctx.fillText(`${Math.round(happinessFrac * 100)}`, cx * 0.45, cy - outerR * 0.2);

    // Fear value
    ctx.fillStyle = '#e74c3c';
    ctx.fillText(`${Math.round(fearFrac * 100)}`, cx * 1.55, cy - outerR * 0.2);
  }
}

// ── Chronicle log updater ─────────────────────────────────────────────────────
export function updateChronicle(entries: ChronicleEntry[], lastIdx: number): number {
  const log = document.getElementById('chronicle-log');
  if (!log) return lastIdx;

  const newEntries = entries.slice(lastIdx);
  if (newEntries.length === 0) return lastIdx;

  newEntries.forEach(entry => {
    if (entry.importance === 'low') return; // skip low in web view
    const div = document.createElement('div');
    div.className = `log-entry log-${entry.importance}`;
    div.textContent = `[Ngày ${entry.day}] ${entry.message}`;
    log.appendChild(div);
  });

  // Keep only last 80 entries visible
  while (log.children.length > 80) {
    log.removeChild(log.firstChild!);
  }
  log.scrollTop = log.scrollHeight;

  return entries.length;
}
