// ============================================================
// GenealogyPanel.ts — Phase 4: Canvas-based Family Tree viewer
// Renders generational tree with NPC nodes and parent lines
// ============================================================

import type { FamilyNode, Occupation } from '../core/types';
import type { Island } from '../core/types';
import { buildFamilyTree } from '../core/AnimalSystem';

const OCC_COLOR: Record<string, string> = {
  farmer:   '#f4d03f', gatherer: '#a8d5a2', warrior: '#e74c3c',
  elder:    '#bb8fce', craftsman:'#f39c12', child:    '#85c1e9',
};

const OCC_ICON: Record<string, string> = {
  farmer: '🌾', gatherer: '🍄', warrior: '⚔️',
  elder: '📜', craftsman: '🔨', child: '👶',
};

export class GenealogyPanel {
  private overlay: HTMLElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private visible = false;

  // Pan & zoom
  private panX = 0;
  private panY = 0;
  private zoom = 1.0;
  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private dragStartPanX = 0;
  private dragStartPanY = 0;

  // Layout
  private nodes: FamilyNode[] = [];
  private nodePositions = new Map<string, { x: number; y: number }>();
  private hoveredId: string | null = null;
  private onSelectCallback: ((npcId: string) => void) | null = null;

  constructor() {
    this.overlay = document.createElement('div');
    this.overlay.id = 'genealogy-overlay';
    Object.assign(this.overlay.style, {
      position: 'fixed',
      inset: '0',
      background: 'rgba(0,0,0,0.92)',
      zIndex: '2000',
      display: 'none',
      flexDirection: 'column',
    });

    // Header
    const header = document.createElement('div');
    Object.assign(header.style, {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 20px',
      borderBottom: '1px solid rgba(0,200,150,0.25)',
      background: 'rgba(10,18,30,0.98)',
      flexShrink: '0',
    });
    header.innerHTML = `
      <div style="font-size:18px;font-weight:bold;color:#00c896;">🧬 Cây Phả Hệ</div>
      <div style="font-size:11px;color:#666;">Kéo để di chuyển · Cuộn để zoom · Click NPC để xem chi tiết</div>
      <div style="display:flex;gap:8px;align-items:center;">
        <button id="gen-reset" style="padding:5px 12px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);
          border-radius:6px;color:#aaa;cursor:pointer;font-size:12px;">⊕ Reset View</button>
        <button id="gen-close" style="padding:5px 14px;background:rgba(200,0,0,0.2);border:1px solid rgba(200,0,0,0.4);
          border-radius:6px;color:#ff6666;cursor:pointer;font-size:12px;">✕ Đóng</button>
      </div>
    `;

    // Legend
    const legend = document.createElement('div');
    Object.assign(legend.style, {
      display: 'flex', gap: '16px', padding: '6px 20px',
      background: 'rgba(10,18,30,0.9)', fontSize: '11px',
      borderBottom: '1px solid rgba(255,255,255,0.07)', flexWrap: 'wrap',
    });
    legend.innerHTML = Object.entries(OCC_COLOR).map(([occ, color]) =>
      `<span style="color:${color};">${OCC_ICON[occ] ?? ''} ${occ}</span>`
    ).join('');

    // Canvas
    this.canvas = document.createElement('canvas');
    Object.assign(this.canvas.style, {
      flex: '1', cursor: 'grab', touchAction: 'none',
    });
    this.ctx = this.canvas.getContext('2d')!;

    this.overlay.appendChild(header);
    this.overlay.appendChild(legend);
    this.overlay.appendChild(this.canvas);
    document.body.appendChild(this.overlay);

    this.bindEvents(header);
    this.startRenderLoop();
  }

  onSelect(cb: (npcId: string) => void): void { this.onSelectCallback = cb; }

  show(island: Island): void {
    this.visible = true;
    this.overlay.style.display = 'flex';
    this.nodes = buildFamilyTree(island);
    this.layoutNodes();
    this.resetView();
  }

  hide(): void {
    this.visible = false;
    this.overlay.style.display = 'none';
  }

  isVisible(): boolean { return this.visible; }

  // ── Layout: Sugiyama-lite (generation rows) ────────────────────────────────
  private layoutNodes(): void {
    this.nodePositions.clear();

    // Group by generation
    const maxGen = this.nodes.reduce((m, n) => Math.max(m, n.generation), 0);
    const rows: FamilyNode[][] = Array.from({ length: maxGen + 1 }, () => []);
    for (const node of this.nodes) rows[node.generation].push(node);

    const NODE_W = 110;
    const NODE_H = 60;
    const VERT_GAP = 100;
    const HORIZ_GAP = 20;

    // Try to center children under parents
    for (let gen = 0; gen <= maxGen; gen++) {
      const row = rows[gen];
      const rowW = row.length * NODE_W + (row.length - 1) * HORIZ_GAP;
      let startX = -rowW / 2;

      for (const node of row) {
        this.nodePositions.set(node.npcId, {
          x: startX + NODE_W / 2,
          y: gen * (NODE_H + VERT_GAP),
        });
        startX += NODE_W + HORIZ_GAP;
      }
    }
  }

  private resetView(): void {
    this.panX = 0;
    this.panY = 40;
    this.zoom = Math.min(1.0, 800 / Math.max(1, this.nodes.length * 60));
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  private startRenderLoop(): void {
    const loop = () => {
      if (this.visible) this.render();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  private render(): void {
    const W = this.canvas.width = this.canvas.offsetWidth;
    const H = this.canvas.height = this.canvas.offsetHeight;
    if (W === 0 || H === 0) return;

    const ctx = this.ctx;
    ctx.fillStyle = '#070d15';
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.translate(W / 2 + this.panX, H / 4 + this.panY);
    ctx.scale(this.zoom, this.zoom);

    // Draw edges (parent lines)
    for (const node of this.nodes) {
      const pos = this.nodePositions.get(node.npcId);
      if (!pos) continue;

      for (const parentId of [node.motherId, node.fatherId]) {
        if (!parentId) continue;
        const parentPos = this.nodePositions.get(parentId);
        if (!parentPos) continue;

        const isMother = parentId === node.motherId;
        ctx.strokeStyle = isMother ? 'rgba(255,160,200,0.35)' : 'rgba(130,170,255,0.35)';
        ctx.lineWidth = 1.5 / this.zoom;
        ctx.setLineDash([4 / this.zoom, 3 / this.zoom]);
        ctx.beginPath();
        ctx.moveTo(parentPos.x, parentPos.y + 30);
        // Bezier curve
        const midY = (parentPos.y + pos.y) / 2;
        ctx.bezierCurveTo(parentPos.x, midY, pos.x, midY, pos.x, pos.y - 30);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Draw partner lines
    const drawnPartners = new Set<string>();
    for (const node of this.nodes) {
      const pos = this.nodePositions.get(node.npcId);
      if (!pos) continue;
      // Check if partnerId exists
      const npc = (globalThis as any).__islandNpcs?.find?.((n: any) => n.id === node.npcId);
      if (!npc?.partnerId) continue;
      const pairKey = [node.npcId, npc.partnerId].sort().join('_');
      if (drawnPartners.has(pairKey)) continue;
      drawnPartners.add(pairKey);
      const partnerPos = this.nodePositions.get(npc.partnerId);
      if (!partnerPos) continue;

      ctx.strokeStyle = 'rgba(255,200,100,0.5)';
      ctx.lineWidth = 2 / this.zoom;
      ctx.beginPath();
      ctx.moveTo(pos.x + 55, pos.y);
      ctx.lineTo(partnerPos.x - 55, partnerPos.y);
      ctx.stroke();
      // Heart symbol
      const midX = (pos.x + partnerPos.x) / 2;
      const midY = (pos.y + partnerPos.y) / 2;
      ctx.font = `${12 / this.zoom}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('💕', midX, midY);
    }

    // Draw nodes
    for (const node of this.nodes) {
      const pos = this.nodePositions.get(node.npcId);
      if (!pos) continue;
      this.drawNode(ctx, node, pos.x, pos.y);
    }

    ctx.restore();
  }

  private drawNode(ctx: CanvasRenderingContext2D, node: FamilyNode, x: number, y: number): void {
    const W = 100, H = 54;
    const isHovered = node.npcId === this.hoveredId;
    const color = OCC_COLOR[node.occupation] ?? '#888';
    const alpha = node.isAlive ? 1.0 : 0.45;

    ctx.globalAlpha = alpha;

    // Shadow
    ctx.shadowColor = isHovered ? '#00c896' : 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = isHovered ? 12 / this.zoom : 5 / this.zoom;

    // Background
    ctx.fillStyle = node.isAlive ? 'rgba(15,25,40,0.96)' : 'rgba(10,15,25,0.7)';
    const corner = 8;
    ctx.beginPath();
    ctx.roundRect(x - W / 2, y - H / 2, W, H, corner);
    ctx.fill();

    // Color accent border
    ctx.strokeStyle = isHovered ? '#00c896' : (node.isAlive ? color : '#444');
    ctx.lineWidth = (isHovered ? 2.5 : 1.5) / this.zoom;
    ctx.beginPath();
    ctx.roundRect(x - W / 2, y - H / 2, W, H, corner);
    ctx.stroke();

    ctx.shadowBlur = 0;

    // Top accent stripe
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha * 0.5;
    ctx.beginPath();
    ctx.roundRect(x - W / 2, y - H / 2, W, 4, [corner, corner, 0, 0]);
    ctx.fill();
    ctx.globalAlpha = alpha;

    // Name
    ctx.font = `bold ${13 / this.zoom}px Inter, sans-serif`;
    ctx.fillStyle = node.isAlive ? '#fff' : '#888';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const shortName = node.name.length > 10 ? node.name.slice(0, 10) + '…' : node.name;
    ctx.fillText(shortName, x, y - H / 2 + 8);

    // Occupation icon + age
    ctx.font = `${10 / this.zoom}px Inter, sans-serif`;
    ctx.fillStyle = color;
    ctx.fillText(`${OCC_ICON[node.occupation] ?? ''} ${node.occupation} · ${Math.floor(node.age)}t`, x, y - H / 2 + 26);

    // Dead marker
    if (!node.isAlive) {
      ctx.font = `${16 / this.zoom}px serif`;
      ctx.fillStyle = 'rgba(255,80,80,0.6)';
      ctx.fillText('✝', x, y - H / 2 + 5);
    }

    // Generation badge
    const genText = `G${node.generation}`;
    ctx.font = `bold ${9 / this.zoom}px monospace`;
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.textAlign = 'right';
    ctx.fillText(genText, x + W / 2 - 4, y - H / 2 + 4);

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.globalAlpha = 1.0;
  }

  // ── Event handling ─────────────────────────────────────────────────────────
  private bindEvents(header: HTMLElement): void {
    header.querySelector('#gen-close')?.addEventListener('click', () => this.hide());
    header.querySelector('#gen-reset')?.addEventListener('click', () => this.resetView());

    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.canvas.style.cursor = 'grabbing';
      this.dragStartX = e.clientX;
      this.dragStartY = e.clientY;
      this.dragStartPanX = this.panX;
      this.dragStartPanY = this.panY;
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        this.panX = this.dragStartPanX + (e.clientX - this.dragStartX);
        this.panY = this.dragStartPanY + (e.clientY - this.dragStartY);
      } else {
        // Hover detection
        this.hoveredId = this.hitTest(e.clientX, e.clientY);
        this.canvas.style.cursor = this.hoveredId ? 'pointer' : 'grab';
      }
    });

    this.canvas.addEventListener('mouseup', (e) => {
      if (this.isDragging) {
        const moved = Math.abs(e.clientX - this.dragStartX) + Math.abs(e.clientY - this.dragStartY);
        if (moved < 5) {
          const id = this.hitTest(e.clientX, e.clientY);
          if (id) this.onSelectCallback?.(id);
        }
      }
      this.isDragging = false;
      this.canvas.style.cursor = 'grab';
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.isDragging = false;
      this.hoveredId = null;
    });

    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      this.zoom = Math.max(0.2, Math.min(4.0, this.zoom * delta));
    }, { passive: false });
  }

  private hitTest(cx: number, cy: number): string | null {
    const W = this.canvas.offsetWidth;
    const H = this.canvas.offsetHeight;
    // Transform from screen to canvas space
    const x = (cx - W / 2 - this.panX) / this.zoom;
    const y = (cy - H / 4 - this.panY) / this.zoom;

    const NODE_W = 100, NODE_H = 54;
    for (const [id, pos] of this.nodePositions) {
      if (
        x >= pos.x - NODE_W / 2 && x <= pos.x + NODE_W / 2 &&
        y >= pos.y - NODE_H / 2 && y <= pos.y + NODE_H / 2
      ) return id;
    }
    return null;
  }
}
