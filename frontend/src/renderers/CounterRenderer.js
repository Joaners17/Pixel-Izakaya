/**
 * CounterRenderer: perspectiva de COCINA.
 * Tarjetas de pedidos (clic para servir), tabla de picar con el plato actual,
 * nevera, caja, bandeja de entregas y ventanilla.
 */
import { hashColor } from '../game/layout.js';

export class CounterRenderer {
  constructor(ctx) {
    this.ctx = ctx;
    this.cardRects = [];       // zonas clicables {id,x,y,w,h}
    this.cardPos = new Map();  // dónde mostrar reacciones por cliente
  }

  render(s, now, helpers) {
    const c = this.ctx, w = 750, h = 320;
    c.fillStyle = '#1a0f0a'; c.fillRect(0, 0, w, h);
    c.fillStyle = '#2c1810'; c.fillRect(20, 15, 710, 135);
    c.strokeStyle = '#3d2216'; c.lineWidth = 2; c.strokeRect(20, 15, 710, 135);

    // --- tarjetas de pedidos ---
    const waiting = s.customers.filter(x => x.state === 'waiting').slice(0, 3);
    this.cardRects = [];
    waiting.forEach((cu, i) => {
      const x = 28 + i * 236, y = 25, bw = 222, bh = 115;
      this.cardRects.push({ id: cu.id, x, y, w: bw, h: bh });
      this.cardPos.set(cu.id, { x: x + 30, y: y + 28 });

      c.fillStyle = '#f4ebd0'; c.fillRect(x, y, bw, bh);
      c.strokeStyle = '#8b5a2b'; c.lineWidth = 3; c.strokeRect(x, y, bw, bh);

      c.fillStyle = hashColor(cu.id); c.fillRect(x + 10, y + 28, 40, 48);       // cuerpo
      c.fillStyle = '#f5d0a9'; c.fillRect(x + 14, y + 10, 32, 22);              // cabeza
      c.fillStyle = '#1c1917'; c.fillRect(x + 20, y + 18, 4, 4); c.fillRect(x + 36, y + 18, 4, 4);
      c.fillStyle = '#331a00'; c.font = '16px VT323'; c.fillText(cu.name, x + 12, y + 92);

      const dish = s.catalog.dishes[cu.order];
      c.fillStyle = '#331a00'; c.font = '16px VT323'; c.fillText('Pedido:', x + 62, y + 30);
      c.fillStyle = '#b91c1c'; c.font = 'bold 19px VT323';
      c.fillText(`${dish?.icon || ''} ${cu.order}`, x + 62, y + 52);

      const ratio = Math.max(0, cu.patience / cu.maxPatience);
      c.fillStyle = '#d1d5db'; c.fillRect(x + 62, y + 66, 150, 12);
      c.fillStyle = ratio > 0.5 ? '#10b981' : ratio > 0.25 ? '#f59e0b' : '#ef4444';
      c.fillRect(x + 62, y + 66, ratio * 150, 12);
      c.strokeStyle = '#1c1917'; c.lineWidth = 2; c.strokeRect(x + 62, y + 66, 150, 12);

      c.fillStyle = cu.cooking ? '#92400e' : '#1e3a8a'; c.font = '14px VT323';
      c.fillText(cu.cooking ? '👨‍🍳 El cocinero lo está preparando...' : '[ Clic para servir el plato ]', cu.cooking ? x + 14 : x + 52, y + 104);
    });
    if (!waiting.length) {
      c.fillStyle = '#9ca3af'; c.font = '22px VT323';
      c.fillText('Esperando clientes... (¡mantén limpio el salón!)', 190, 90);
    }

    // --- barra de trabajo ---
    c.fillStyle = '#4a2511'; c.fillRect(0, 150, w, 170);
    c.fillStyle = '#5c3a21'; c.fillRect(0, 150, w, 15);

    // Tabla de picar con el plato actual
    c.fillStyle = '#c29b61'; c.fillRect(30, 180, 150, 120);
    c.strokeStyle = '#8c6239'; c.lineWidth = 3; c.strokeRect(30, 180, 150, 120);
    c.fillStyle = '#2b1705'; c.font = '17px VT323'; c.fillText('Tabla de picar', 40, 200);
    c.fillStyle = '#f8f1dc'; c.beginPath(); c.ellipse(105, 255, 55, 30, 0, 0, Math.PI * 2); c.fill();
    c.strokeStyle = '#8c6239'; c.lineWidth = 2; c.stroke();
    c.font = '16px VT323';
    s.currentPlate.forEach((n, i) => {
      const ing = s.catalog.ingredients[n];
      c.fillStyle = '#2b1705';
      c.fillText(`${ing?.icon || ''}${n}`.slice(0, 14), 62, 226 + i * 12);
    });
    if (!s.currentPlate.length) { c.fillStyle = '#8c6239'; c.fillText('(plato vacío)', 62, 258); }

    // Nevera
    c.fillStyle = '#94a3b8'; c.fillRect(200, 170, 96, 130);
    c.fillStyle = '#cbd5e1'; c.fillRect(204, 174, 88, 58); c.fillRect(204, 236, 88, 60);
    c.fillStyle = '#475569'; c.fillRect(280, 190, 4, 24); c.fillRect(280, 252, 4, 24);
    c.fillStyle = '#0f172a'; c.font = '17px VT323'; c.fillText('❄ NEVERA', 212, 200);
    c.fillStyle = s.usage.fridge >= s.capacity.fridge ? '#b91c1c' : '#0f172a';
    c.fillText(`${s.usage.fridge}/${s.capacity.fridge}`, 226, 222);

    // Caja de cartón
    c.fillStyle = '#b9854f'; c.fillRect(312, 215, 110, 85);
    c.fillStyle = '#a0713f'; c.fillRect(312, 215, 110, 14);
    c.fillStyle = '#d6b27a'; c.fillRect(358, 215, 18, 85);
    c.strokeStyle = '#6b4423'; c.lineWidth = 3; c.strokeRect(312, 215, 110, 85);
    c.fillStyle = '#2b1705'; c.font = '17px VT323'; c.fillText('📦 CAJA', 322, 248);
    c.fillText(`${s.usage.box}/${s.capacity.box}`, 322, 270);

    // Entregas pendientes (compras del ordenador)
    const pending = Object.values(s.delivery).reduce((a, b) => a + b, 0);
    c.fillStyle = '#d6b27a'; c.fillRect(440, 245, 60, 55); c.fillRect(470, 215, 50, 30);
    c.strokeStyle = '#6b4423'; c.lineWidth = 3; c.strokeRect(440, 245, 60, 55); c.strokeRect(470, 215, 50, 30);
    c.fillStyle = '#2b1705'; c.font = '16px VT323'; c.fillText('Entregas', 445, 200);
    if (pending > 0) {
      const pulse = Math.sin(now / 200) > 0;
      c.fillStyle = pulse ? '#ef4444' : '#b91c1c'; c.beginPath(); c.arc(512, 222, 13, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#fff'; c.font = '16px VT323'; c.fillText(String(pending), pending > 9 ? 504 : 508, 228);
      c.fillStyle = '#fbbf24'; c.fillText('¡Guárdalas!', 440, 316);
    }

    // Ventanilla de salida
    c.fillStyle = '#9a3412'; c.fillRect(545, 180, 175, 120);
    c.strokeStyle = '#7c2d12'; c.lineWidth = 3; c.strokeRect(545, 180, 175, 120);
    c.fillStyle = '#fef3c7'; c.font = '17px VT323'; c.fillText('🍱 Ventanilla', 557, 202);
    c.font = '15px VT323'; c.fillText('Arma el plato y haz clic', 557, 226); c.fillText('en la tarjeta del cliente.', 557, 242);
    c.fillStyle = '#fbbf24'; c.fillText(`Nivel ${s.level}`, 557, 275);

    helpers?.drawCounter(s, now);
  }
}
