// ============================================================
// Camera.ts — Pan & zoom camera for 2D canvas
// ============================================================

export interface Camera {
  /** World-space X coordinate at the screen center */
  x: number;
  /** World-space Y coordinate at the screen center */
  y: number;
  /** Scale multiplier (pixels-per-world-pixel) */
  zoom: number;
  /** Target zoom for smooth interpolation */
  targetZoom: number;
  /** Target pan for smooth interpolation */
  targetX: number;
  targetY: number;
  // Drag state
  isDragging: boolean;
  dragStartScreenX: number;
  dragStartScreenY: number;
  dragStartCamX: number;
  dragStartCamY: number;
}

export const ZOOM_MIN = 0.4;
export const ZOOM_MAX = 5.0;
export const ZOOM_DEFAULT = 1.8;

export function createCamera(startX = 0, startY = 0): Camera {
  return {
    x: startX,
    y: startY,
    zoom: ZOOM_DEFAULT,
    targetZoom: ZOOM_DEFAULT,
    targetX: startX,
    targetY: startY,
    isDragging: false,
    dragStartScreenX: 0,
    dragStartScreenY: 0,
    dragStartCamX: 0,
    dragStartCamY: 0,
  };
}

/** Convert a world-space point to screen-space (pixels from top-left of canvas) */
export function worldToScreen(
  wx: number, wy: number,
  cam: Camera, canvasW: number, canvasH: number,
): { sx: number; sy: number } {
  return {
    sx: (wx - cam.x) * cam.zoom + canvasW / 2,
    sy: (wy - cam.y) * cam.zoom + canvasH / 2,
  };
}

/** Convert screen-space pixel to world-space coordinate */
export function screenToWorld(
  sx: number, sy: number,
  cam: Camera, canvasW: number, canvasH: number,
): { wx: number; wy: number } {
  return {
    wx: (sx - canvasW / 2) / cam.zoom + cam.x,
    wy: (sy - canvasH / 2) / cam.zoom + cam.y,
  };
}

/** Clamp camera so it never goes far outside the world bounds */
export function clampCamera(cam: Camera, worldPixelW: number, worldPixelH: number): void {
  const margin = 200;
  const halfW = worldPixelW / 2 + margin;
  const halfH = worldPixelH / 2 + margin;
  cam.targetX = Math.max(-halfW, Math.min(halfW, cam.targetX));
  cam.targetY = Math.max(-halfH, Math.min(halfH, cam.targetY));
}

/** Smooth update — call once per frame */
export function updateCamera(cam: Camera, dt: number): void {
  const speed = Math.min(1, dt * 0.014);
  cam.x  += (cam.targetX    - cam.x)    * speed;
  cam.y  += (cam.targetY    - cam.y)    * speed;
  cam.zoom += (cam.targetZoom - cam.zoom) * speed;
}

/** Zoom toward a screen-space point (e.g. mouse cursor) */
export function zoomAt(
  cam: Camera,
  screenX: number, screenY: number,
  delta: number,
  canvasW: number, canvasH: number,
): void {
  const factor = delta > 0 ? 1.12 : 0.88;
  const newZoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, cam.targetZoom * factor));

  // Keep the world point under the cursor stationary
  const { wx, wy } = screenToWorld(screenX, screenY, { ...cam, zoom: cam.targetZoom }, canvasW, canvasH);
  cam.targetZoom = newZoom;
  cam.targetX = wx - (screenX - canvasW / 2) / newZoom;
  cam.targetY = wy - (screenY - canvasH / 2) / newZoom;
}
