/**
 * HelperRenderer: dibuja a los ayudantes contratados.
 * Limpiador y comprador se ven en el salón; el cocinero, en la cocina.
 */
import { REGION_W, TABLE_W, TABLE_H, PC } from '../game/layout.js';

export class HelperRenderer {
  constructor(ctx) { this.ctx = ctx; this.pos = {}; this.tDining = null; }

  move(key, dest, dt, speed) {
    const p = (this.pos[key] ||= { x: dest.x, y: dest.y, face: 1, moving: false });
    const dx = dest.x - p.x, dy = dest.y - p.y, d = Math.hypot(dx, dy);
    if (d < 2) { p.moving = false; return p; }
    const s = Math.min(d, speed * dt);
    p.x += dx / d * s; p.y += dy / d * s;
    if (Math.abs(dx) > 1) p.face = dx > 0 ? 1 : -1;
    p.moving = true;
    return p;
  }

  // sprite pequeño: coat/hat/accent en colores; hat = 'toque' dibuja gorro de cocinero
  sprite(x, y, o, now) {
    const c = this.ctx, step = o.moving ? Math.sin(now / 90) * 3 : 0;
    c.fillStyle = '#1f2937'; c.fillRect(x + 3, y + 19 + step, 4, 5); c.fillRect(x + 9, y + 19 - step, 4, 5);
    c.fillStyle = o.coat; c.fillRect(x + 2, y + 9, 12, 11);
    c.fillStyle = o.accent; c.fillRect(x + 2, y + 13, 12, 2);
    c.fillStyle = '#f5d0a9'; c.fillRect(x + 4, y + 2, 8, 8);
    c.fillStyle = '#1c1917';
    if (o.sleeping) { c.fillRect(x + 5, y + 6, 2, 1); c.fillRect(x + 9, y + 6, 2, 1); }
    else { c.fillRect(x + 5, y + 5, 2, 2); c.fillRect(x + 9, y + 5, 2, 2); }
    if (o.hat === 'toque') {
      c.fillStyle = '#fff'; c.fillRect(x + 2, y - 8, 12, 7); c.fillRect(x + 4, y - 11, 8, 4); c.fillRect(x + 3, y - 2, 10, 3);
    } else {
      c.fillStyle = o.accent; c.fillRect(x + 3, y - 1, 10, 4);
    }
  }

  bubble(x, y, text) {
    const c = this.ctx;
    c.font = '16px VT323';
    const w = c.measureText(text).width + 10;
    c.fillStyle = '#fff'; c.fillRect(x - w / 2, y - 18, w, 18);
    c.strokeStyle = '#1c1917'; c.lineWidth = 2; c.strokeRect(x - w / 2, y - 18, w, 18);
    c.fillStyle = '#1c1917'; c.fillText(text, x - w / 2 + 5, y - 5);
  }

  // ----- salón -----
  drawDining(s, now) {
    const dt = Math.min(0.05, (now - (this.tDining ?? now)) / 1000);
    this.tDining = now;
    const H = s.helpers;

    if (H.cleaner.hired) {
      let dest = { x: REGION_W[s.expansion] - 40, y: 285 };
      if (H.cleaner.phase === 'walk') {
        const t = s.tables.find(x => x.id === H.cleaner.target);
        if (t) dest = { x: t.x + TABLE_W / 2 - 8, y: t.y + TABLE_H + 6 };
      }
      const p = this.move('cleaner', dest, dt, 130);
      this.sprite(p.x, p.y, { coat: '#2563eb', accent: '#fbbf24', moving: p.moving }, now);
      if (H.cleaner.phase === 'walk' && !p.moving) this.bubble(p.x + 8, p.y - 6, '🧹');
    }
    if (H.buyer.hired) {
      const p = this.move('buyer', { x: PC.x + PC.w + 18, y: 86 }, dt, 100);
      this.sprite(p.x, p.y, { coat: '#16a34a', accent: '#f8fafc', moving: p.moving }, now);
      if (H.buyer.phase === 'shop') this.bubble(p.x + 8, p.y - 6, '🛒 ...');
    }
  }

  // ----- cocina -----
  drawCounter(s, now) {
    const ck = s.helpers.cook;
    if (!ck.hired) return;
    const c = this.ctx, x = 330, y = 160;
    const sleeping = ck.resting;
    const bob = sleeping ? 0 : (ck.phase === 'cook' ? Math.sin(now / 120) * 2 : 0);
    this.sprite(x, y + bob + (sleeping ? 4 : 0), { coat: '#f8fafc', accent: '#ef4444', hat: 'toque', sleeping }, now);

    if (sleeping) {
      c.fillStyle = '#93c5fd'; c.font = '18px VT323';
      const f = (now / 500) % 3;
      c.fillText('Z', x + 22, y - 2 - f * 3); c.fillText('z', x + 32, y - 12 - f * 3);
      this.bubble(x + 8, y - 16, 'Descansando');
    } else if (ck.phase === 'cook') {
      c.fillStyle = '#d1d5db'; c.fillRect(x - 24, y - 32, 56, 8);
      c.fillStyle = '#10b981'; c.fillRect(x - 24, y - 32, 56 * ck.p, 8);
      c.strokeStyle = '#1c1917'; c.lineWidth = 2; c.strokeRect(x - 24, y - 32, 56, 8);
      c.font = '16px VT323'; c.fillStyle = '#fef3c7'; c.fillText(ck.dish || '', x + 36, y - 25);
    }
  }
}
