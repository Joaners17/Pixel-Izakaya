// Animaciones de fin de partida: victoria (fuegos artificiales + estrella) y derrota (local cerrado).
const rnd = (a, b) => a + Math.random() * (b - a);

function star(ctx, cx, cy, R, r, rot, fill) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = rot + i * Math.PI / 5 - Math.PI / 2, rad = i % 2 ? r : R;
    ctx.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
  }
  ctx.closePath();
  ctx.fillStyle = fill; ctx.fill();
  ctx.strokeStyle = '#92400e'; ctx.lineWidth = 3; ctx.stroke();
}

export class EndFX {
  constructor() { this.mode = null; }
  get active() { return this.mode !== null; }
  stop() { this.mode = null; }

  start(mode, owner, stars) {
    this.mode = mode; this.owner = owner; this.stars = stars;
    this.t0 = performance.now(); this.last = this.t0;
    this.parts = []; this.nextBurst = 0;
    this.rain = Array.from({ length: 60 }, () => ({ x: rnd(0, 750), y: rnd(0, 320), v: rnd(220, 360) }));
  }

  draw(ctx, now, w, h) {
    if (!this.mode) return;
    const t = (now - this.t0) / 1000;
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    ctx.save();
    if (this.mode === 'won') this.win(ctx, t, dt, w, h); else this.lose(ctx, t, dt, w, h);
    ctx.restore();
  }

  win(ctx, t, dt, w, h) {
    ctx.fillStyle = `rgba(20,8,0,${Math.min(0.78, t * 0.8)})`; ctx.fillRect(0, 0, w, h);

    if (t >= this.nextBurst) { // fuegos artificiales
      this.nextBurst = t + 0.45;
      const cx = rnd(80, w - 80), cy = rnd(50, 170);
      const col = ['#fde047', '#f472b6', '#60a5fa', '#34d399', '#fb923c'][Math.floor(rnd(0, 5))];
      for (let i = 0; i < 26; i++) {
        const a = i / 26 * Math.PI * 2, sp = rnd(60, 130);
        this.parts.push({ x: cx, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1.4, col });
      }
    }
    this.parts = this.parts.filter(p => p.life > 0);
    for (const p of this.parts) {
      p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 90 * dt; p.life -= dt;
      ctx.globalAlpha = Math.max(0, p.life / 1.4);
      ctx.fillStyle = p.col; ctx.fillRect(Math.round(p.x), Math.round(p.y), 3, 3);
    }
    ctx.globalAlpha = 1;

    const sy = Math.min(120, -60 + t * 180), pulse = 1 + Math.sin(t * 6) * 0.06;
    star(ctx, w / 2, sy, 46 * pulse, 20 * pulse, Math.sin(t * 2) * 0.2, '#fbbf24');

    if (t > 0.9) {
      ctx.globalAlpha = Math.min(1, t - 0.9);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fde68a'; ctx.font = '22px "Press Start 2P", monospace'; ctx.fillText('¡FELICIDADES!', w / 2, 205);
      ctx.fillStyle = '#fff'; ctx.font = '28px VT323, monospace'; ctx.fillText(this.owner, w / 2, 238);
      ctx.fillStyle = '#fbbf24'; ctx.font = '22px VT323, monospace';
      ctx.fillText('Tu izakaya llegó al 10% de valoración y gana una estrella', w / 2, 264);
      if (this.stars <= 8) {
        const x0 = w / 2 - (this.stars - 1) * 13;
        for (let i = 0; i < this.stars; i++) star(ctx, x0 + i * 26, 292, 10, 4.5, 0, '#fbbf24');
      } else {
        ctx.fillText(`★ x ${this.stars}`, w / 2, 296);
      }
    }
  }

  lose(ctx, t, dt, w, h) {
    ctx.fillStyle = `rgba(0,0,0,${Math.min(0.82, t * 0.7)})`; ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(148,163,184,0.55)'; // lluvia
    for (const r of this.rain) {
      r.y += r.v * dt;
      if (r.y > h) { r.y = -10; r.x = rnd(0, w); }
      ctx.fillRect(Math.round(r.x), Math.round(r.y), 1, 8);
    }

    for (let i = 0; i < 6; i++) { // farolillos que se apagan uno a uno
      const x = 90 + i * 114, off = t > 0.4 + i * 0.35;
      ctx.fillStyle = '#1c1917'; ctx.fillRect(x - 1, 0, 2, 22);
      if (!off) { ctx.fillStyle = 'rgba(255,120,80,0.18)'; ctx.beginPath(); ctx.arc(x, 33, 26, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = off ? '#3f2a22' : '#ef4444'; ctx.fillRect(x - 9, 22, 18, 22);
      ctx.fillStyle = '#1c1917'; ctx.fillRect(x - 9, 22, 18, 3); ctx.fillRect(x - 9, 41, 18, 3);
    }

    // cartel "CERRADO" que cae y se balancea
    const drop = Math.min(1, t / 0.8), y = -60 + drop * 100, ang = Math.sin(t * 3) * 0.12 * Math.exp(-t * 0.4);
    ctx.save();
    ctx.translate(w / 2, 0); ctx.rotate(ang);
    ctx.strokeStyle = '#a16207'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-40, 0); ctx.lineTo(-40, y + 8); ctx.moveTo(40, 0); ctx.lineTo(40, y + 8); ctx.stroke();
    ctx.fillStyle = '#7c2d12'; ctx.fillRect(-70, y + 8, 140, 50);
    ctx.strokeStyle = '#fbbf24'; ctx.strokeRect(-70, y + 8, 140, 50);
    ctx.textAlign = 'center'; ctx.fillStyle = '#fde68a';
    ctx.font = '28px serif'; ctx.fillText('閉店', 0, y + 38);
    ctx.font = '18px VT323, monospace'; ctx.fillText('CERRADO', 0, y + 54);
    ctx.restore();

    if (t > 1) {
      ctx.globalAlpha = Math.min(1, t - 1);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#e5e7eb'; ctx.font = '18px "Press Start 2P", monospace'; ctx.fillText('FIN DE LA PARTIDA', w / 2, 190);
      ctx.fillStyle = '#fff'; ctx.font = '26px VT323, monospace'; ctx.fillText(`${this.owner}, tu izakaya cerró sus puertas`, w / 2, 224);
      ctx.fillStyle = '#fca5a5'; ctx.font = '22px VT323, monospace'; ctx.fillText('La valoración llegó a 0%', w / 2, 252);
    }
  }
}
