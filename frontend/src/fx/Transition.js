// Cinemática de cambio de escena: cortinas "noren" que se cierran, título, y se abren
const ease = (t) => t * t * (3 - 2 * t);

export class Transition {
  constructor() { this.active = false; }

  start(kanji, title, subtitle, onMid) {
    this.active = true;
    this.t0 = performance.now();
    this.dur = 1700;
    this.kanji = kanji; this.title = title; this.sub = subtitle;
    this.onMid = onMid; this.midDone = false;
    this.petals = Array.from({ length: 28 }, () => ({
      x: Math.random() * 750, y: Math.random() * 320, s: 2 + Math.floor(Math.random() * 3),
      v: 50 + Math.random() * 70, ph: Math.random() * 6
    }));
  }

  draw(ctx, w, h) {
    if (!this.active) return;
    const now = performance.now();
    const p = (now - this.t0) / this.dur;
    if (p >= 1) { this.active = false; return; }

    let cover;
    if (p < 0.35) cover = ease(p / 0.35);
    else if (p < 0.65) cover = 1;
    else cover = 1 - ease((p - 0.65) / 0.35);
    if (p >= 0.5 && !this.midDone) { this.midDone = true; this.onMid?.(); }

    const pw = Math.ceil((w / 2) * cover);
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(0, 0, pw, h);
    ctx.fillRect(w - pw, 0, pw, h);
    ctx.fillStyle = '#5b1212';
    for (let x = 0; x < pw; x += 30) { ctx.fillRect(x, 0, 3, h); ctx.fillRect(w - x - 3, 0, 3, h); }
    ctx.fillStyle = '#f5d98b';
    ctx.fillRect(0, 0, pw, 6); ctx.fillRect(w - pw, 0, pw, 6);
    ctx.fillRect(0, h - 6, pw, 6); ctx.fillRect(w - pw, h - 6, pw, 6);

    if (cover > 0.95) {
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fde68a';
      ctx.font = '56px serif';
      ctx.fillText(this.kanji, w / 2, h / 2 - 8);
      ctx.font = '18px "Press Start 2P", monospace';
      ctx.fillText(this.title, w / 2, h / 2 + 32);
      ctx.fillStyle = '#fecaca';
      ctx.font = '22px VT323, monospace';
      ctx.fillText(this.sub, w / 2, h / 2 + 62);
      ctx.textAlign = 'left';
      // pétalos de sakura cayendo
      ctx.fillStyle = '#f9a8d4';
      for (const pt of this.petals) {
        const y = (pt.y + (now - this.t0) / 1000 * pt.v) % h;
        const x = pt.x + Math.sin((now - this.t0) / 400 + pt.ph) * 14;
        ctx.fillRect(Math.round(x), Math.round(y), pt.s, pt.s);
      }
    }
  }
}
