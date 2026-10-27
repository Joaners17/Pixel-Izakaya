import { esc } from '../net.js';
import { drawKitten } from './Kitten.js';

const AUTHOR_NAME = 'Magochix';

const show = (el) => { el.style.display = 'flex'; };
const hide = (el) => { el.style.display = 'none'; };

// Pantallas HTML: inicio (3 slots), pausa, fin de partida y confirmaciones.
export class MenuUI {
  constructor(h) {
    this.h = h; this.slots = []; this.creating = null; this.muted = false; this.fs = false; this.hue = 25; this.hueTimer = null; this.labelName = false; this.ticks = 0;
    this.title = document.getElementById('title-screen');
    this.pause = document.getElementById('pause-modal');
    this.end = document.getElementById('end-modal');
    this.confirmEl = document.getElementById('confirm-modal');

    this.title.addEventListener('click', (e) => this.onTitle(e));
    this.title.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.id === 'name-input') this.submitName(); });
    this.pause.addEventListener('click', (e) => { const b = e.target.closest('[data-act]'); if (b) this.h[b.dataset.act]?.(); });
    this.end.addEventListener('click', (e) => { const b = e.target.closest('[data-act]'); if (b) this.h[b.dataset.act]?.(); });
  }

  // ---------- inicio ----------
  showTitle(slots) { this.slots = slots; this.creating = null; show(this.title); this.renderTitle(); this.startHue(); }
  hideTitle() { hide(this.title); this.stopHue(); }

  // El tono naranja del menú va rotando por todos los colores
  startHue() {
    if (this.hueTimer) return;
    this.hueTimer = setInterval(() => {
      this.hue = (this.hue + 0.7) % 360;
      this.title.style.setProperty('--h', this.hue.toFixed(1));
      if (++this.ticks % 50 === 0) { // cada ~2.5 s la etiqueta alterna entre AUTOR y el nombre
        this.labelName = !this.labelName;
        const el = document.getElementById('credit-label');
        if (el) el.textContent = this.labelName ? AUTHOR_NAME : 'AUTOR';
      }
    }, 50);
  }
  stopHue() { clearInterval(this.hueTimer); this.hueTimer = null; }

  setFs(on) { this.fs = on; if (this.title.style.display === 'flex') this.renderTitle(); }

  renderTitle() {
    const cards = this.slots.map((s) => {
      if (!s.empty) {
        return `<div class="slot"><div class="slot-n">Slot ${s.slot}</div>
          <div class="slot-owner">Izakaya de<br><b>${esc(s.owner)}</b></div>
          <div class="muted">Nv. ${s.level} · ★ ${s.stars}</div>
          <div class="muted">Valoración ${Number(s.rating).toFixed(2)}% · ¥${s.coins}</div>
          <button class="kbtn big" data-act="load" data-slot="${s.slot}">▶ Continuar</button>
          <button class="kbtn" data-act="del" data-slot="${s.slot}">🗑 Borrar</button></div>`;
      }
      if (this.creating === s.slot) {
        return `<div class="slot empty"><div class="slot-n">Slot ${s.slot}</div>
          <div>Nombre del dueño:</div>
          <input id="name-input" maxlength="16" placeholder="Tu nombre" autocomplete="off">
          <button class="kbtn big" data-act="start" data-slot="${s.slot}">Comenzar</button>
          <button class="kbtn" data-act="cancel">Cancelar</button></div>`;
      }
      return `<div class="slot empty"><div class="slot-n">Slot ${s.slot}</div><div class="muted">Vacío</div>
        <button class="kbtn big" data-act="new" data-slot="${s.slot}">＋ Nueva partida</button></div>`;
    }).join('');

    this.title.innerHTML = `<div class="title-wrap">
      <div class="sun-circle" style="margin:0 auto 10px"><span class="pixel-title text-xl">居酒屋</span></div>
      <h1 class="pixel-title accent" style="font-size:26px;margin-bottom:6px">PIXEL IZAKAYA</h1>
      <p class="muted" style="font-size:22px;margin-bottom:14px">Elige una partida (máximo 3)</p>
      <div class="slots">${cards}</div>
      <div style="margin-top:16px">
        <button class="kbtn" data-act="music">${this.muted ? '🔇 Música: no' : '🔊 Música: sí'}</button>
        <button class="kbtn" data-act="fs">${this.fs ? '🗗 Reducir pantalla' : '⛶ Pantalla completa'}</button>
      </div>
    </div>
    <div class="credit credit-author">
      <div class="frame"><img src="assets/author.png" alt="Autor"></div>
      <div class="credit-role" id="credit-label">${this.labelName ? esc(AUTHOR_NAME) : 'AUTOR'}</div>
    </div>
    <div class="credit credit-kitten">
      <div class="bubble">¡Miau!</div>
      <canvas id="kitten" width="16" height="16"></canvas>
      <div class="credit-role">COLABORADOR</div><div class="credit-name">Claude 🐾</div>
    </div>`;
    drawKitten(document.getElementById('kitten'));
    if (this.creating) document.getElementById('name-input')?.focus();
  }

  onTitle(e) {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const slot = Number(b.dataset.slot);
    switch (b.dataset.act) {
      case 'new': this.creating = slot; this.renderTitle(); break;
      case 'cancel': this.creating = null; this.renderTitle(); break;
      case 'start': this.submitName(); break;
      case 'load': this.h.load(slot); break;
      case 'del': this.h.remove(slot); break;
      case 'music': this.h.toggleMusic(); break;
      case 'fs': this.h.toggleFs(); break;
    }
  }

  submitName() {
    const input = document.getElementById('name-input');
    const v = input?.value.trim();
    if (!v) { input?.focus(); return; }
    this.h.create(this.creating, v);
  }

  setMuted(m) {
    this.muted = m;
    if (this.title.style.display === 'flex') this.renderTitle();
    const b = this.pause.querySelector('[data-act="toggleMusic"]');
    if (b) b.textContent = m ? '🔇 Música: no' : '🔊 Música: sí';
  }

  // ---------- pausa ----------
  showPause() {
    this.pause.innerHTML = `<div class="pausebox"><h2 class="pixel-title text-amber-400" style="font-size:18px">PAUSA</h2>
      <button class="kbtn big" data-act="resume">▶ Reanudar partida</button>
      <button class="kbtn big" data-act="restart">🔄 Reiniciar partida</button>
      <button class="kbtn big" data-act="toggleMusic">${this.muted ? '🔇 Música: no' : '🔊 Música: sí'}</button>
      <button class="kbtn big" data-act="exit">🚪 Salir al inicio</button></div>`;
    show(this.pause);
  }
  hidePause() { hide(this.pause); }

  // ---------- fin de partida ----------
  showEnd(status, owner, stars) {
    const won = status === 'won';
    this.end.innerHTML = `<div class="pausebox" style="flex-direction:row;align-items:center;gap:12px;padding:12px 18px">
      <span>${won ? `🎉 ¡Felicidades, ${esc(owner)}! ★ ${stars}` : `💀 ${esc(owner)}, tu local cerró`}</span>
      <button class="kbtn big" data-act="endContinue">${won ? '➕ Continuar (más difícil)' : '🔄 Reintentar'}</button>
      <button class="kbtn big" data-act="exit">🚪 Salir al inicio</button></div>`;
    show(this.end);
  }
  hideEnd() { hide(this.end); }

  hideAll() { hide(this.title); hide(this.pause); hide(this.end); hide(this.confirmEl); }

  // ---------- confirmación ----------
  ask(text) {
    return new Promise((resolve) => {
      const el = this.confirmEl;
      el.innerHTML = `<div class="pausebox"><p>${esc(text)}</p>
        <div style="display:flex;gap:10px;justify-content:center">
          <button class="kbtn big" data-v="1">Sí</button><button class="kbtn big" data-v="0">No</button></div></div>`;
      show(el);
      el.onclick = (e) => {
        const b = e.target.closest('[data-v]');
        if (!b) return;
        hide(el); el.onclick = null;
        resolve(b.dataset.v === '1');
      };
    });
  }
}
