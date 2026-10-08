// ============================================================
// run.ts — Entry point: initialize island, run simulation
// ============================================================
//
// Usage:
//   npm run sim           → real-time mode (50ms delay per tick)
//   npm run sim:fast      → fast mode (no delay, print all at end)
//   npm run sim:slow      → slow mode (200ms delay per tick, easy reading)
//
// ============================================================

import * as fs   from 'fs';
import * as path from 'path';
import { createIsland } from '../src/core/factory';
import { tick } from '../src/core/engine';
import { printNewEntries } from '../src/core/chronicle';
import { getLivingNPCs } from '../src/core/utils';
import type { Island, NPC } from '../src/core/types';

// ── Logger — writes to terminal (color) + plain-text file ────────────────────

/** Strip ANSI escape codes for clean plain-text output */
function stripAnsi(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1b\[[0-9;]*m/g, '');
}

let _logStream: fs.WriteStream | null = null;

function initLogger(): string {
  const logsDir = path.resolve(__dirname, '..', 'logs');
  if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

  const now = new Date();
  const stamp = now
    .toISOString()
    .replace(/[:.]/g, '-')
    .replace('T', '_')
    .slice(0, 19);
  const logPath = path.join(logsDir, `sim_${stamp}.txt`);

  _logStream = fs.createWriteStream(logPath, { encoding: 'utf8' });
  return logPath;
}

function log(line: string = ''): void {
  console.log(line);
  _logStream?.write(stripAnsi(line) + '\n');
}

/** Write a line to file only (not terminal) — used for 'low' importance entries */
function logFile(line: string = ''): void {
  _logStream?.write(line + '\n');
}

function closeLogger(): void {
  _logStream?.end();
  _logStream = null;
}

// ── Parse CLI args ────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const isFast = args.includes('--fast');
const isSlow = args.includes('--slow');

let totalTicks = 300;
const daysArg = args.find((a) => a.startsWith('--days='));
if (daysArg) {
  totalTicks = parseInt(daysArg.split('=')[1], 10) * 10;
} else {
  const daysIndex = args.indexOf('--days');
  if (daysIndex !== -1 && args[daysIndex + 1]) {
    totalTicks = parseInt(args[daysIndex + 1], 10) * 10;
  }
}
const ticksArg = args.find((a) => a.startsWith('--ticks='));
if (ticksArg) {
  totalTicks = parseInt(ticksArg.split('=')[1], 10);
} else {
  const ticksIndex = args.indexOf('--ticks');
  if (ticksIndex !== -1 && args[ticksIndex + 1]) {
    totalTicks = parseInt(args[ticksIndex + 1], 10);
  }
}

const TOTAL_TICKS = Math.max(1, totalTicks);
const NPC_COUNT = 30;

const TICK_DELAY_MS = isFast ? 0 : isSlow ? 200 : (TOTAL_TICKS > 1000 ? 0 : 50);
const PRINT_REALTIME = true;

// ── Sleep helper ──────────────────────────────────────────────────────────────
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Print header ──────────────────────────────────────────────────────────────
function printHeader(island: Island): void {
  log('\x1b[36m╔══════════════════════════════════════════════════╗\x1b[0m');
  log(`\x1b[36m║     🏝️  ${island.name.padEnd(40)}║\x1b[0m`);
  log('\x1b[36m╚══════════════════════════════════════════════════╝\x1b[0m');
  log(`\x1b[90mDân số: ${island.npcs.length} | Tick: ${TOTAL_TICKS} | Độ trễ: ${TICK_DELAY_MS}ms/tick\x1b[0m`);
  log();
  printNPCSummary(island);
  log();
  log('\x1b[36m── Biên niên sử ────────────────────────────────────\x1b[0m');
}

function printNPCSummary(island: Island): void {
  log('\x1b[90m Tên               | G | Tuổi | Nghề       | Can đảm | L.Tham | T.Thành | S.Đạo | H.Đồng | Bạn đời\x1b[0m');
  log('\x1b[90m────────────────────────────────────────────────────────────────────────────────────────────────────\x1b[0m');
  island.npcs.forEach((n) => {
    const name = n.name.padEnd(18);
    const g = n.gender === 'male' ? 'Nam' : 'Nữ ';
    const age = String(n.age).padStart(4);
    const occ = n.occupation.padEnd(10);
    const c = String(n.personality.courage).padStart(7);
    const gr = String(n.personality.greed).padStart(6);
    const l = String(n.personality.loyalty).padStart(7);
    const p = String(n.personality.piety).padStart(5);
    const s = String(n.personality.sociability).padStart(6);
    const partner = n.partnerId
      ? (island.npcs.find((p) => p.id === n.partnerId)?.name ?? n.partnerId)
      : 'Độc thân';
    log(`\x1b[90m ${name} | ${g} | ${age} | ${occ} | ${c} | ${gr} | ${l} | ${p} | ${s} | ${partner}\x1b[0m`);
  });
}

function printFooter(island: Island): void {
  const alive = getLivingNPCs(island).length;
  const dead = island.npcs.length - alive;
  const born = island.npcs.filter((n) => n.motherId !== null).length;
  log();
  log('\x1b[36m── Kết thúc mô phỏng ───────────────────────────────\x1b[0m');
  log(`\x1b[32m✓ Tổng tick: ${island.tick} (30 ngày game) | Dân ban đầu: 30 | Sinh ra: ${born} | Hiện sống: ${alive} | Đã mất: ${dead}\x1b[0m`);
  log(`\x1b[32m✓ Kho lương thực cuối: ${Math.round(island.sharedFood)}\x1b[0m`);
  log(`\x1b[32m✓ Tổng sự kiện ghi nhận: ${island.chronicle.length}\x1b[0m`);

  // Print top relationships
  const rels = [...island.relationships.values()].sort((a, b) => Math.abs(b.score) - Math.abs(a.score));
  if (rels.length > 0) {
    log();
    log('\x1b[36m Quan hệ nổi bật:\x1b[0m');
    const top = rels.slice(0, 6);
    top.forEach((r) => {
      const npcA = island.npcs.find((n) => n.id === r.npcIdA)?.name ?? r.npcIdA;
      const npcB = island.npcs.find((n) => n.id === r.npcIdB)?.name ?? r.npcIdB;
      const label =
        r.score >= 60 ? '💛 gắn bó/thân thiết'
        : r.score >= 20 ? '🤝 quen biết'
        : r.score <= -60 ? '💢 thù địch'
        : r.score <= -20 ? '😠 căng thẳng'
        : '😐 trung lập';
      log(`  ${npcA} ↔ ${npcB}: ${Math.round(r.score)} (${label})`);
    });
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const logPath = initLogger();
  log(`\x1b[90m📄 Log file: ${logPath}\x1b[0m`);
  log();

  const island = createIsland('Đảo Thiên Nguyên', NPC_COUNT);

  printHeader(island);

  let lastChronicleIndex = 0;

  for (let t = 0; t < TOTAL_TICKS; t++) {
    tick(island);

    if (PRINT_REALTIME) {
      // Print high/medium to terminal; write ALL to file
      island.chronicle.slice(lastChronicleIndex).forEach((entry) => {
        const color = entry.importance === 'high' ? '\x1b[93m' : entry.importance === 'medium' ? '\x1b[37m' : '\x1b[90m';
        const prefix = entry.importance === 'high' ? '⚡ ' : '  ';
        const plain = `${prefix}[Ngày ${entry.day}] ${entry.message}`;
        logFile(plain);  // always write to file
        if (entry.importance !== 'low') {
          console.log(`${color}${plain}\x1b[0m`);  // terminal: high + medium only
        }
      });
      lastChronicleIndex = island.chronicle.length;

      if (TICK_DELAY_MS > 0) {
        await sleep(TICK_DELAY_MS);
      }

      // Stop early if everyone is dead
      if (getLivingNPCs(island).length === 0) {
        log('\x1b[31m💀 Toàn bộ dân số đã chết. Mô phỏng kết thúc sớm.\x1b[0m');
        break;
      }
    }
  }

  printFooter(island);

  // ── Death analysis ─────────────────────────────────────────────────────────────
  const deathEntries = island.chronicle.filter((e) => e.message.includes('💀'));
  const deathsByDay = new Map<number, number>();
  deathEntries.forEach((e) => {
    deathsByDay.set(e.day, (deathsByDay.get(e.day) ?? 0) + 1);
  });
  const massDeathDays = [...deathsByDay.entries()]
    .filter(([, count]) => count >= 2)
    .sort(([a], [b]) => a - b);

  log();
  log('\x1b[33m═'.repeat(50) + '\x1b[0m');
  log('\x1b[33m📊 PHÂN TÍCH TỬ VONG (300 tick)\x1b[0m');
  log('\x1b[33m═'.repeat(50) + '\x1b[0m');
  log(`  Tổng NPC chết : \x1b[31m${deathEntries.length}/${island.npcs.length}\x1b[0m`);
  log(`  NPC còn sống  : \x1b[32m${getLivingNPCs(island).length}/${island.npcs.length}\x1b[0m`);
  if (massDeathDays.length > 0) {
    log(`  \x1b[31m⚠️  Ngày sụp đổ dây chuyền (≥2 người/ngày):\x1b[0m`);
    massDeathDays.forEach(([day, count]) => {
      log(`     Ngày ${day}: \x1b[31m${count} người chết cùng ngày\x1b[0m`);
    });
  } else {
    log(`  \x1b[32m✅ Không có ngày nào chết từ 2+ người. Tỷ lệ sống ổn định.\x1b[0m`);
  }

  // ── Steal analysis ─────────────────────────────────────────────────────────────
  const stealRegex = /^(.+?) trộm (\d+) lương thực của (.+?) vì (.+?)\.$/;
  const stealEntries = island.chronicle
    .map((e) => {
      const m = e.message.match(stealRegex);
      return m ? { thief: m[1], amount: Number(m[2]), victim: m[3], reason: m[4], tick: e.tick, day: e.day } : null;
    })
    .filter((e): e is NonNullable<typeof e> => e !== null);

  const victimCounts = new Map<string, number>();
  const thiefCounts = new Map<string, number>();

  stealEntries.forEach((s) => {
    victimCounts.set(s.victim, (victimCounts.get(s.victim) ?? 0) + 1);
    thiefCounts.set(s.thief, (thiefCounts.get(s.thief) ?? 0) + 1);
  });

  log();
  log('\x1b[33m═'.repeat(50) + '\x1b[0m');
  log('\x1b[33m🕵️ PHÂN TÍCH TRỘM CẮP & AN NINH (300 tick)\x1b[0m');
  log('\x1b[33m═'.repeat(50) + '\x1b[0m');
  log(`  Tổng số vụ trộm : \x1b[33m${stealEntries.length}\x1b[0m | Nạn nhân khác nhau: \x1b[32m${victimCounts.size}\x1b[0m`);

  // ── Romance & Marriage analysis ────────────────────────────────────────────────
  const marriageEvents = island.chronicle.filter((e) => e.message.includes('kết đôi thành vợ chồng'));
  const couples: { npcA: NPC; npcB: NPC }[] = [];
  const seenPairIds = new Set<string>();

  island.npcs.forEach((n) => {
    if (n.partnerId && !seenPairIds.has(n.id)) {
      const partner = island.npcs.find((p) => p.id === n.partnerId);
      if (partner) {
        seenPairIds.add(n.id);
        seenPairIds.add(partner.id);
        couples.push({ npcA: n, npcB: partner });
      }
    }
  });

  log();
  log('\x1b[35m═'.repeat(50) + '\x1b[0m');
  log('\x1b[35m💍 PHÂN TÍCH TÌNH DUYÊN & HÔN NHÂN (300 tick)\x1b[0m');
  log('\x1b[35m═'.repeat(50) + '\x1b[0m');
  log(`  Tổng số lễ kết đôi đã diễn ra: \x1b[32m${marriageEvents.length}\x1b[0m`);
  log(`  Số cặp vợ chồng hiện tại: \x1b[32m${couples.length}\x1b[0m`);
  couples.forEach(({ npcA, npcB }, idx) => {
    log(`    ${idx + 1}. \x1b[36m${npcA.name}\x1b[0m (${npcA.gender === 'male' ? 'Nam' : 'Nữ'}, ${npcA.age}t) 💖 \x1b[36m${npcB.name}\x1b[0m (${npcB.gender === 'male' ? 'Nam' : 'Nữ'}, ${npcB.age}t)`);
  });

  // ── Reproduction & Genetics analysis ───────────────────────────────────────────
  const children = island.npcs.filter((n) => n.motherId !== null);
  const birthEvents = island.chronicle.filter((e) => e.message.includes('vừa sinh hạ một bé'));

  log();
  log('\x1b[32m═'.repeat(50) + '\x1b[0m');
  log('\x1b[32m👶 PHÂN TÍCH SINH ĐẺ & DI TRUYỀN TÍNH CÁCH (300 tick)\x1b[0m');
  log('\x1b[32m═'.repeat(50) + '\x1b[0m');
  log(`  Dân số ban đầu : \x1b[36m30\x1b[0m`);
  log(`  Số trẻ sinh ra : \x1b[32m${children.length}\x1b[0m`);
  log(`  Dân số cuối kỳ : \x1b[32m${island.npcs.length}\x1b[0m (Còn sống: ${getLivingNPCs(island).length})`);

  if (children.length > 0) {
    log();
    log('\x1b[32m  🧬 BẢNG SO SÁNH DI TRUYỀN 5 TRỤC TÍNH CÁCH:\x1b[0m');
    children.forEach((child, idx) => {
      const mother = island.npcs.find((n) => n.id === child.motherId);
      const father = island.npcs.find((n) => n.id === child.fatherId);
      const mName = mother?.name ?? 'Không rõ';
      const fName = father?.name ?? 'Không rõ';

      log(`\n  ┌── \x1b[33mBé #${idx + 1}: ${child.name}\x1b[0m (${child.gender === 'male' ? 'Nam' : 'Nữ'}, Tuổi: ${child.age}, Nghề: ${child.occupation})`);
      log(`  │   Mẹ: ${mName} | Bố: ${fName}`);
      log(`  │   ${'Trục tính cách'.padEnd(14)} | ${'Bố'.padStart(6)} | ${'Mẹ'.padStart(6)} | ${'T.Bình'.padStart(7)} | ${'Con nhận'.padStart(9)} | ${'Đột biến'.padStart(9)}`);
      log(`  │   ────────────────────────────────────────────────────────────`);

      const axes: Array<{ key: keyof typeof child.personality; name: string }> = [
        { key: 'courage', name: 'Can đảm' },
        { key: 'greed', name: 'Lòng tham' },
        { key: 'loyalty', name: 'Trung thành' },
        { key: 'piety', name: 'Sùng đạo' },
        { key: 'sociability', name: 'Hòa đồng' },
      ];

      axes.forEach((axis) => {
        const fVal = father ? father.personality[axis.key] : 0;
        const mVal = mother ? mother.personality[axis.key] : 0;
        const avg = Math.round((fVal + mVal) / 2);
        const cVal = child.personality[axis.key];
        const diff = cVal - avg;
        const diffStr = diff >= 0 ? `+${diff}` : `${diff}`;
        log(`  │   ${axis.name.padEnd(14)} | ${String(fVal).padStart(6)} | ${String(mVal).padStart(6)} | ${String(avg).padStart(7)} | ${String(cVal).padStart(9)} | ${diffStr.padStart(9)}`);
      });
      log(`  └───`);
    });
  }

  // ── Highlight chronicle stories around Romance & Birth ──────────────────────────
  log();
  log('\x1b[36m═'.repeat(50) + '\x1b[0m');
  log('\x1b[36m📜 TRÍCH ĐOẠN BIÊN NIÊN SỬ TIÊU BIỂU (Tình duyên & Sinh nở)\x1b[0m');
  log('\x1b[36m═'.repeat(50) + '\x1b[0m');

  const storyEntries = island.chronicle.filter((e) =>
    e.message.includes('kết đôi') ||
    e.message.includes('có thai') ||
    e.message.includes('sinh hạ') ||
    e.message.includes('trưởng thành') ||
    e.message.includes('ly hôn'),
  );

  storyEntries.slice(0, 12).forEach((e) => {
    const color = e.importance === 'high' ? '\x1b[93m' : '\x1b[37m';
    const prefix = e.importance === 'high' ? '⚡ ' : '  ';
    log(`${color}${prefix}[Ngày ${e.day}] ${e.message}\x1b[0m`);
  });

  closeLogger();
  console.log(`\x1b[32m\n✅ Log đã lưu tại: ${logPath}\x1b[0m`);
}

main().catch((err) => {
  console.error('Simulation error:', err);
  process.exit(1);
});

