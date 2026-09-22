// ============================================================
// chronicle.ts — Narrative logging system (biên niên sử)
// ============================================================

import type { ChronicleEntry, Island } from './types';
import { tickToDay } from './utils';

let _island: Island | null = null;

export function setChronicleIsland(island: Island): void {
  _island = island;
}

export function addEntry(
  island: Island,
  message: string,
  importance: ChronicleEntry['importance'] = 'medium',
): void {
  const entry: ChronicleEntry = {
    tick: island.tick,
    day: tickToDay(island.tick),
    message,
    importance,
  };
  island.chronicle.push(entry);
}

// Importance colors for terminal output
const IMPORTANCE_COLOR = {
  low: '\x1b[90m',      // dim gray
  medium: '\x1b[37m',   // white
  high: '\x1b[93m',     // bright yellow
} as const;
const RESET = '\x1b[0m';

export function printEntry(entry: ChronicleEntry): void {
  const color = IMPORTANCE_COLOR[entry.importance];
  const prefix = entry.importance === 'high' ? '⚡ ' : entry.importance === 'medium' ? '  ' : '  ';
  console.log(`${color}${prefix}[Ngày ${entry.day}] ${entry.message}${RESET}`);
}

export function printAllEntries(island: Island): void {
  island.chronicle.forEach(printEntry);
}

/** Print only new entries since a given index */
export function printNewEntries(island: Island, sinceIndex: number): void {
  island.chronicle.slice(sinceIndex).forEach(printEntry);
}
