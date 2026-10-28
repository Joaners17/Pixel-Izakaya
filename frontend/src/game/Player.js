import { TABLE_W, TABLE_H } from './layout.js';

const MOVE_KEYS = ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'];

export class Player {
  constructor() {
    this.x = 300; this.y = 270; this.w = 16; this.h = 24;
    this.speed = 150; this.facing = 1; this.walk = 0; this.moving = false;
    this.keys = new Set();
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT') return;
      const k = e.key.toLowerCase();
      if (MOVE_KEYS.includes(k)) { this.keys.add(k); e.preventDefault(); }
    });
    window.addEventListener('keyup', (e) => this.keys.delete(e.key.toLowerCase()));
    window.addEventListener('blur', () => this.keys.clear());
  }

  hits(x, y, tables) { // colisión de los pies con las mesas
    return tables.some(t => x < t.x + TABLE_W + 2 && x + this.w > t.x - 2 && y + 12 < t.y + TABLE_H + 2 && y + this.h > t.y - 2);
  }

  update(dt, tables, b) {
    const k = this.keys;
    let dx = 0, dy = 0;
    if (k.has('a') || k.has('arrowleft')) dx -= 1;
    if (k.has('d') || k.has('arrowright')) dx += 1;
    if (k.has('w') || k.has('arrowup')) dy -= 1;
    if (k.has('s') || k.has('arrowdown')) dy += 1;
    if (dx && dy) { dx *= 0.7071; dy *= 0.7071; }
    if (dx) this.facing = dx > 0 ? 1 : -1;
    this.moving = !!(dx || dy);
    if (this.moving) this.walk += dt * 12;

    const nx = Math.min(b.maxX - this.w, Math.max(b.minX, this.x + dx * this.speed * dt));
    if (!this.hits(nx, this.y, tables)) this.x = nx;
    const ny = Math.min(b.maxY - this.h, Math.max(b.minY, this.y + dy * this.speed * dt));
    if (!this.hits(this.x, ny, tables)) this.y = ny;
  }
}
