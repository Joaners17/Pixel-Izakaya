/**
 * DiningRenderer: perspectiva del SALÓN.
 * Piso/pared temáticos, ordenador, mesas y sillas (limpias/sucias), clientes,
 * dinero sobre las mesas, zona bloqueada por expansión y al jugador.
 */
import { W, H, TABLE_W, TABLE_H, WALL_H, PC, REGION_W, seatPos, hashColor } from '../game/layout.js';

const FLOORS = { tatami: ['#d4b572', '#b89750'], madera: ['#8a5a34', '#6e4526'], piedra: ['#8b8f98', '#6b7079'] };
const TABLES = { madera: ['#5c3a21', '#3d2514'], laca: ['#9b1c1c', '#6f1212'], negro: ['#292524', '#1c1917'] };
const LANTERNS = { rojo: '#ef4444', azul: '#38bdf8', verde: '#4ade80' };

export class DiningRenderer {
  constructor(ctx) { this.ctx = ctx; }

  render(s, player, now, target, helpers) {
    const limit = REGION_W[s.expansion];
    this.floor(s.theme.floor);
    this.wall(s.theme.lantern, limit);
    this.computer(now);
    s.tables.forEach(t => this.table(t, s, now));
    helpers?.drawDining(s, now);
    this.drawPlayer(player);
    this.locked(limit);
    if (target) this.hint(player, target);
  }

  floor(kind) {
    const c = this.ctx, [base, line] = FLOORS[kind] || FLOORS.tatami;
    c.fillStyle = base; c.fillRect(0, 0, W, H);
    c.strokeStyle = line; c.lineWidth = 2;
    c.beginPath();
    if (kind === 'madera') { for (let y = WALL_H; y < H; y += 20) { c.moveTo(0, y); c.lineTo(W, y); } }
    else if (kind === 'piedra') { for (let x = 0; x < W; x += 50) { c.moveTo(x, WALL_H); c.lineTo(x, H); } for (let y = WALL_H; y < H; y += 50) { c.moveTo(0, y); c.lineTo(W, y); } }
    else { for (let x = 0; x < W; x += 150) { c.moveTo(x, WALL_H); c.lineTo(x, H); } for (let y = WALL_H + 70; y < H; y += 140) { c.moveTo(0, y); c.lineTo(W, y); } }
    c.stroke();
  }

  wall(lantern, limit) {
    const c = this.ctx;
    c.fillStyle = '#2c1810'; c.fillRect(0, 0, W, WALL_H);
    c.fillStyle = '#1a0f0a'; c.fillRect(0, WALL_H - 4, W, 4);
    for (let x = 110; x + 90 < limit; x += 110) { // paneles shoji
      c.fillStyle = '#e8dcb5'; c.fillRect(x, 14, 90, 52);
      c.strokeStyle = '#8b5a2b'; c.lineWidth = 2; c.strokeRect(x, 14, 90, 52);
      c.beginPath(); c.moveTo(x + 45, 14); c.lineTo(x + 45, 66); c.moveTo(x, 40); c.lineTo(x + 90, 40); c.stroke();
    }
    for (let x = 160; x < limit - 40; x += 160) { // farolillos
      c.fillStyle = 'rgba(255,200,120,0.12)'; c.beginPath(); c.arc(x, 44, 26, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#1c1917'; c.fillRect(x - 1, 0, 2, 26);
      c.fillStyle = LANTERNS[lantern] || LANTERNS.rojo; c.fillRect(x - 9, 26, 18, 22);
      c.fillStyle = '#1c1917'; c.fillRect(x - 9, 26, 18, 3); c.fillRect(x - 9, 45, 18, 3);
    }
  }

  computer(now) {
    const c = this.ctx;
    c.fillStyle = '#5c3a21'; c.fillRect(PC.x - 4, PC.y + 32, PC.w + 8, 18);
    c.fillStyle = '#111827'; c.fillRect(PC.x + 8, PC.y, 48, 34);
    c.fillStyle = Math.sin(now / 500) > 0 ? '#0ea5e9' : '#38bdf8'; c.fillRect(PC.x + 11, PC.y + 3, 42, 26);
    c.fillStyle = '#082f49'; c.font = '20px VT323'; c.fillText('¥ $', PC.x + 22, PC.y + 24);
    c.fillStyle = '#374151'; c.fillRect(PC.x + 28, PC.y + 34, 8, 4);
  }

  table(t, s, now) {
    const c = this.ctx, [top, inner] = TABLES[s.theme.table] || TABLES.madera;

    t.seats.forEach((seat, i) => { // sillas
      const p = seatPos(t, i);
      c.fillStyle = seat.dirty ? '#4a3a2a' : '#7c4a28'; c.fillRect(p.x, p.y, 18, 18);
      c.fillStyle = seat.dirty ? '#33261a' : '#5a3219'; c.fillRect(p.x, p.y, 18, 5);
      if (seat.dirty) { c.fillStyle = '#9ca3af'; c.fillRect(p.x + 4, p.y + 9, 3, 3); c.fillRect(p.x + 11, p.y + 12, 3, 3); }
    });

    c.fillStyle = top; c.fillRect(t.x, t.y, TABLE_W, TABLE_H);    // mesa
    c.fillStyle = inner; c.fillRect(t.x + 5, t.y + 5, TABLE_W - 10, TABLE_H - 10);
    if (t.dirty) {
      c.fillStyle = '#7f1d1d'; c.fillRect(t.x + 12, t.y + 12, 8, 6); c.fillRect(t.x + 30, t.y + 22, 10, 7);
      c.fillStyle = '#d1d5db'; c.fillRect(t.x + 22, t.y + 10, 5, 4); c.fillRect(t.x + 10, t.y + 28, 4, 4);
    }

    s.customers.forEach(cu => { // clientes sentados
      if (cu.tableId !== t.id) return;
      const i = t.seats.findIndex(x => x.id === cu.seatId);
      if (i < 0) return;
      const p = seatPos(t, i), cx = p.x + 9;
      c.fillStyle = hashColor(cu.id); c.fillRect(cx - 6, p.y + 6, 12, 12);
      c.fillStyle = '#f5d0a9'; c.fillRect(cx - 5, p.y - 4, 10, 9);
      c.fillStyle = '#1c1917'; c.fillRect(cx - 3, p.y, 2, 2); c.fillRect(cx + 1, p.y, 2, 2);
      if (cu.state === 'waiting') {
        c.fillStyle = '#fff'; c.fillRect(cx - 9, p.y - 18, 18, 11);
        c.fillStyle = '#1c1917'; c.font = '16px VT323'; c.fillText('...', cx - 6, p.y - 8);
      } else {
        c.fillStyle = '#f8f1dc'; c.fillRect(t.x + 20, t.y + 16, 16, 12);
        c.fillStyle = 'rgba(255,255,255,0.6)'; c.fillRect(t.x + 24 + Math.sin(now / 200) * 2, t.y + 8, 2, 6);
      }
    });

    if (t.money > 0) { // dinero para cobrar
      const by = Math.sin(now / 200) * 2;
      c.fillStyle = '#fbbf24'; c.beginPath(); c.arc(t.x + 28, t.y + 22 + by, 9, 0, Math.PI * 2); c.fill();
      c.strokeStyle = '#92400e'; c.lineWidth = 2; c.stroke();
      c.fillStyle = '#78350f'; c.font = '14px VT323'; c.fillText('¥', t.x + 24, t.y + 27 + by);
      c.fillStyle = '#fef3c7'; c.fillText(`¥${t.money}`, t.x + 14, t.y - 2 + by);
    }
  }

  drawPlayer(p) {
    const c = this.ctx, step = Math.sin(p.walk) * 3 * (p.moving ? 1 : 0);
    c.fillStyle = '#1f2937'; c.fillRect(p.x + 3, p.y + 19 + step, 4, 5); c.fillRect(p.x + 9, p.y + 19 - step, 4, 5);
    c.fillStyle = '#f8fafc'; c.fillRect(p.x + 2, p.y + 9, 12, 11);
    c.fillStyle = '#ef4444'; c.fillRect(p.x + 2, p.y + 13, 12, 2);
    c.fillStyle = '#f5d0a9'; c.fillRect(p.x + 4, p.y + 2, 8, 8);
    c.fillStyle = '#1c1917'; c.fillRect(p.x + (p.facing > 0 ? 8 : 5), p.y + 5, 2, 2);
    c.fillStyle = '#fff'; c.fillRect(p.x + 3, p.y - 4, 10, 6);
    c.fillStyle = '#ef4444'; c.fillRect(p.x + 3, p.y + 1, 10, 1);
  }

  locked(limit) {
    if (limit >= W) return;
    const c = this.ctx;
    c.fillStyle = 'rgba(12,10,9,0.88)'; c.fillRect(limit, 0, W - limit, H);
    c.fillStyle = '#b45309'; c.fillRect(limit - 3, WALL_H, 3, H - WALL_H);
    c.fillStyle = '#fbbf24'; c.font = '20px VT323'; c.textAlign = 'center';
    c.fillText('🔒 Zona sin expandir', limit + (W - limit) / 2, 190);
    c.fillStyle = '#9ca3af'; c.font = '16px VT323'; c.fillText('(ordenador → Tienda)', limit + (W - limit) / 2, 210);
    c.textAlign = 'left';
  }

  hint(p, target) {
    const c = this.ctx;
    const label = target.type === 'pc' ? '[E] Usar ordenador'
      : target.action === 'collect' ? `[E] Cobrar ¥${target.table.money}` : '[E] Limpiar';
    c.font = '18px VT323';
    const w = c.measureText(label).width + 12, x = Math.min(W - w - 4, Math.max(4, p.x + 8 - w / 2)), y = p.y - 30;
    c.fillStyle = 'rgba(0,0,0,0.75)'; c.fillRect(x, y, w, 22);
    c.strokeStyle = '#fbbf24'; c.lineWidth = 2; c.strokeRect(x, y, w, 22);
    c.fillStyle = '#fde68a'; c.fillText(label, x + 6, y + 16);
  }
}
