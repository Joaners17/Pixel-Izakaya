// Animaciones de reacción del cliente. Misma cara según gusto/disgusto,
// efecto aleatorio entre varias variantes según la gravedad.
const HEART = ['.XX.XX.', 'XXXXXXX', 'XXXXXXX', '.XXXXX.', '..XXX..', '...X...'];
const STAR  = ['..X..', '..X..', 'XXXXX', '..X..', '..X..'];
const DROP  = ['..X..', '.XXX.', 'XXXXX', 'XXXXX', '.XXX.'];
const VEIN  = ['XX..XX', 'X....X', '..XX..', '..XX..', 'X....X', 'XX..XX'];
const FLAME = ['...X...', '..XX...', '..XXX..', '.XXXXX.', 'XXXXXXX', 'XXXXXXX', '.XXXXX.'];
const GHOST = ['.XXXXX.', 'XXXXXXX', 'XX.X.XX', 'XXXXXXX', 'XXXXXXX', 'X.XX.XX'];

function bmp(ctx, rows, x, y, s, color) {
  ctx.fillStyle = color;
  rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] === 'X') ctx.fillRect(Math.round(x + i * s), Math.round(y + j * s), s, s); });
}
const puff = (ctx, x, y, r, a = 0.8) => { ctx.fillStyle = `rgba(229,231,235,${Math.max(0, a)})`; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); };
function text(ctx, str, x, y, color, size = 18) {
  ctx.textAlign = 'center'; ctx.font = `${size}px VT323, monospace`;
  ctx.fillStyle = '#1c1917'; ctx.fillText(str, x + 1, y + 1);
  ctx.fillStyle = color; ctx.fillText(str, x, y); ctx.textAlign = 'left';
}

function drawFace(ctx, x, y, type, level) {
  const skin = type === 'like' ? '#fde68a' : level === 1 ? '#e5e7eb' : level === 2 ? '#fca5a5' : '#ef4444';
  ctx.fillStyle = '#1c1917'; ctx.fillRect(x - 15, y - 15, 30, 30);
  ctx.fillStyle = skin;      ctx.fillRect(x - 13, y - 13, 26, 26);
  ctx.fillStyle = '#1c1917';
  if (type === 'like') {
    [-8, 2].forEach(dx => { ctx.fillRect(x + dx, y - 4, 2, 2); ctx.fillRect(x + dx + 2, y - 6, 2, 2); ctx.fillRect(x + dx + 4, y - 4, 2, 2); });
    ctx.fillRect(x - 7, y + 4, 2, 2); ctx.fillRect(x - 5, y + 6, 10, 2); ctx.fillRect(x + 5, y + 4, 2, 2);
    ctx.fillStyle = '#fb7185'; ctx.fillRect(x - 12, y + 2, 4, 3); ctx.fillRect(x + 8, y + 2, 4, 3);
  } else if (level === 1) {
    ctx.fillRect(x - 8, y - 4, 3, 3); ctx.fillRect(x + 5, y - 4, 3, 3); ctx.fillRect(x - 5, y + 7, 10, 2);
  } else {
    [[-10, 1], [7, -1]].forEach(([bx, d]) => { // cejas enojadas
      ctx.fillRect(bx, y - 9, 3, 2); ctx.fillRect(bx + 3 * d, y - 7, 3, 2); ctx.fillRect(bx + 6 * d, y - 5, 2, 2);
    });
    if (level === 2) {
      ctx.fillRect(x - 8, y - 3, 3, 3); ctx.fillRect(x + 5, y - 3, 3, 3);
      ctx.fillRect(x - 5, y + 8, 10, 2); ctx.fillRect(x - 7, y + 10, 2, 2); ctx.fillRect(x + 5, y + 10, 2, 2);
    } else {
      ctx.fillRect(x - 8, y - 3, 4, 2); ctx.fillRect(x + 4, y - 3, 4, 2);
      ctx.fillRect(x - 6, y + 4, 12, 8); ctx.fillStyle = '#fff'; ctx.fillRect(x - 5, y + 4, 10, 2);
    }
  }
}

const EFFECTS = {
  hearts(ctx, x, y, p, s) { for (let i = 0; i < 4; i++) bmp(ctx, HEART, x - 22 + i * 12 + Math.sin(p * 6 + i + s) * 4, y - 20 - p * 40 - i * 6, 2, '#f43f5e'); },
  sparkles(ctx, x, y, p) { for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2 + p * 3, r = 26 + p * 10; if (Math.sin(p * 20 + i) > -0.3) bmp(ctx, STAR, x + Math.cos(a) * r - 5, y + Math.sin(a) * r - 5, 2, '#fde047'); } },
  jump(ctx, x, y, p) { text(ctx, '¡Oishii!', x, y - 24 - p * 10, '#fde047', 20); bmp(ctx, HEART, x + 16, y - 22, 2, '#f43f5e'); },
  sweat(ctx, x, y, p) { bmp(ctx, DROP, x + 16, y - 12 + p * 22, 2, '#38bdf8'); bmp(ctx, DROP, x - 24, y - 6 + p * 16, 2, '#38bdf8'); },
  sigh(ctx, x, y, p) { for (let i = 0; i < 3; i++) puff(ctx, x + 20 + i * 8, y - 4 - p * 30 - i * 5, 3 + i, 0.8 - p * 0.5); text(ctx, 'uf...', x, y - 24, '#e5e7eb', 18); },
  anger(ctx, x, y, p) { const sc = 3 + (Math.sin(p * 18) > 0 ? 1 : 0); bmp(ctx, VEIN, x + 8, y - 28, sc, '#dc2626'); },
  shake(ctx, x, y, p) { text(ctx, '¡¿?!', x, y - 22, '#fca5a5', 22); bmp(ctx, VEIN, x - 26, y - 22, 2, '#dc2626'); },
  storm(ctx, x, y, p) {
    ctx.fillStyle = '#374151'; ctx.fillRect(x - 22, y - 38, 44, 12); ctx.fillRect(x - 14, y - 46, 28, 10);
    if (Math.sin(p * 40) > 0.5) { ctx.fillStyle = '#fde047'; ctx.fillRect(x - 3, y - 26, 6, 8); ctx.fillRect(x - 6, y - 18, 6, 8); }
    ctx.fillStyle = '#60a5fa'; for (let i = 0; i < 5; i++) ctx.fillRect(x - 18 + i * 9, y - 24 + ((p * 120 + i * 13) % 14), 2, 5);
  },
  fire(ctx, x, y, p) { for (let i = -1; i <= 1; i++) { const h = 2 + Math.abs(Math.sin(p * 25 + i * 2)); bmp(ctx, FLAME, x - 10 + i * 12, y - 24 - h * 5, 2, '#f97316'); bmp(ctx, FLAME, x - 6 + i * 12, y - 20 - h * 4, 1, '#fde047'); } },
  rage(ctx, x, y, p) { text(ctx, '¡¡NO!!', x, y - 24, '#ef4444', 26); for (let i = 0; i < 3; i++) { puff(ctx, x - 22 - i * 5, y - 10 - p * 30 - i * 6, 3 + i); puff(ctx, x + 22 + i * 5, y - 10 - p * 30 - i * 6, 3 + i); } },
  ghost(ctx, x, y, p) { bmp(ctx, GHOST, x - 7 + Math.sin(p * 12) * 4, y - 20 - p * 46, 2, '#f5f5f4'); }
};

const VARIANTS = {
  like: ['hearts', 'sparkles', 'jump'],
  dislike1: ['sweat', 'sigh'],
  dislike2: ['anger', 'shake', 'storm'],
  dislike3: ['fire', 'rage', 'ghost']
};

export class ReactionFX {
  constructor() { this.list = []; }

  add(r, anchors) {
    const key = r.type === 'like' ? 'like' : `dislike${r.level}`;
    const arr = VARIANTS[key];
    this.list.push({ ...r, anchors, variant: arr[Math.floor(Math.random() * arr.length)], t0: performance.now(), dur: 2400, seed: Math.random() * 100 });
  }

  draw(ctx, view, now) {
    this.list = this.list.filter(r => now - r.t0 < r.dur);
    for (const r of this.list) {
      const a = r.anchors[view];
      if (!a) continue;
      const p = (now - r.t0) / r.dur;
      ctx.save();
      ctx.globalAlpha = p > 0.85 ? (1 - p) / 0.15 : 1;
      const bob = r.variant === 'jump' ? -Math.abs(Math.sin(p * Math.PI * 4)) * 10 : 0;
      const shake = (r.variant === 'shake' || r.variant === 'rage') ? Math.sin(p * 90) * 3 : 0;
      const fx = a.x + shake, fy = a.y - 30 + bob;
      drawFace(ctx, fx, fy, r.type, r.level);
      EFFECTS[r.variant](ctx, fx, fy, p, r.seed);
      ctx.restore();
    }
  }
}
