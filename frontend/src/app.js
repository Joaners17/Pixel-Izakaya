import { SoundEngine } from './audio/SoundEngine.js';
import { MusicEngine } from './audio/MusicEngine.js';
import { CounterRenderer } from './renderers/CounterRenderer.js';
import { DiningRenderer } from './renderers/DiningRenderer.js';
import { HelperRenderer } from './renderers/HelperRenderer.js';
import { Player } from './game/Player.js';
import { findTarget, seatPos, REGION_W, W, H } from './game/layout.js';
import { Transition } from './fx/Transition.js';
import { ReactionFX } from './fx/ReactionFX.js';
import { EndFX } from './fx/EndFX.js';
import { KitchenUI } from './ui/KitchenUI.js';
import { ComputerUI } from './ui/ComputerUI.js';
import { MenuUI } from './ui/MenuUI.js';
import { api, wake } from './net.js';
import { readSaves, writeSave, deleteSave, getSave } from './saves.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const sound = new SoundEngine();
const music = new MusicEngine([1, 2, 3, 4, 5].map(n => `assets/audio/track${n}.mp3`));
const counterRenderer = new CounterRenderer(ctx);
const diningRenderer = new DiningRenderer(ctx);
const helperRenderer = new HelperRenderer(ctx);
const player = new Player();
const fx = new ReactionFX();
const endFx = new EndFX();
const transition = new Transition();

let phase = 'title';      // 'title' | 'playing'
let state = null;
let view = 'counter';     // 'counter' | 'dining'
let pauseOpen = false;
let endShown = false;
let currentSlot = null;
let resuming = false;
const seen = { reaction: 0, notice: 0, first: true };

const startMusic = () => music.start();
window.addEventListener('pointerdown', startMusic, { once: true });
window.addEventListener('keydown', startMusic, { once: true });

const canPlay = () => phase === 'playing' && state && state.status === 'playing' && !state.paused && !pauseOpen;

// ---------- avisos ----------
function toast(text, kind = 'ok') {
  if (!text) return;
  const el = document.createElement('div');
  const colors = { ok: '#065f46', error: '#7f1d1d', bad: '#7f1d1d', levelup: '#92400e' };
  el.textContent = text;
  el.style.cssText = `background:${colors[kind] || colors.ok};border:2px solid #fbbf24;color:#fef3c7;padding:6px 12px;font-size:20px;border-radius:4px;max-width:340px;`;
  document.getElementById('toasts').appendChild(el);
  setTimeout(() => el.remove(), kind === 'levelup' ? 5000 : 2800);
}

// ---------- estado ----------
function anchorsFor(r, s) {
  const a = {};
  const pos = counterRenderer.cardPos.get(r.customerId);
  if (pos) a.counter = pos;
  const t = s.tables.find(x => x.id === r.tableId);
  const i = t ? t.seats.findIndex(x => x.id === r.seatId) : -1;
  if (t && i >= 0) { const p = seatPos(t, i); a.dining = { x: p.x + 9, y: p.y - 4 }; }
  return a;
}

function handleEnd(s) {
  if (endShown) return;
  endShown = true;
  pauseOpen = false;
  menu.hidePause();
  computerUI.close();
  endFx.start(s.status, s.owner, s.stars);
  s.status === 'won' ? sound.playWin() : sound.playLose();
  setTimeout(() => { if (endShown && phase === 'playing') menu.showEnd(s.status, s.owner, s.stars); }, 3200);
}

function applyState(s) {
  if (phase !== 'playing' || !s || s.rev === undefined) return;
  if (state && s.rev < state.rev) return; // respuesta vieja
  state = s;

  document.getElementById('owner').textContent = s.owner;
  document.getElementById('coins').textContent = s.coins;
  const rEl = document.getElementById('rating');
  rEl.textContent = s.rating.toFixed(2);
  rEl.style.color = s.rating < 1 ? '#f87171' : s.rating < s.ratingGoal * 0.6 ? '#fbbf24' : '#34d399';
  document.getElementById('cap').textContent = s.ratingCap.toFixed(2);
  document.getElementById('stars').textContent = s.stars;
  document.getElementById('level').textContent = s.level;
  document.getElementById('xpbar').style.width = `${Math.min(100, (s.xp / s.xpToNext) * 100)}%`;

  for (const r of s.reactions) {
    if (r.id <= seen.reaction) continue;
    seen.reaction = r.id;
    if (seen.first) continue;
    fx.add(r, anchorsFor(r, s));
    r.type === 'like' ? sound.playLike() : sound.playDislike();
  }
  for (const n of s.notices) {
    if (n.id <= seen.notice) continue;
    seen.notice = n.id;
    if (seen.first) continue;
    toast(n.text, n.kind);
    if (n.kind === 'levelup' && s.status === 'playing') sound.playLevelUp();
  }
  seen.first = false;

  if (s.status !== 'playing') handleEnd(s);
  else if (endShown) { endShown = false; endFx.stop(); menu.hideEnd(); }

  kitchenUI.render(s);
  if (computerUI.isOpen) computerUI.render(s);
}

async function refresh() {
  if (phase !== 'playing') return;
  const s = await api('/state');
  if (s.noGame) { resumeFromLocal(); return; }
  applyState(s);
}

async function doAction(path, body = {}) {
  sound.playClick();
  const r = await api(path, body);
  if (r.state) applyState(r.state);
  if (r.error) toast(r.error, 'error');
  else if (r.message) toast(r.message, 'ok');
  if (r.sound === 'coin') sound.playCoin();
  return r;
}

// ---------- flujo de pantallas ----------
async function goTitle() {
  phase = 'title'; state = null; pauseOpen = false; endShown = false;
  endFx.stop(); computerUI.close(); menu.hideAll();
  menu.showTitle(readSaves());
}

async function enterGame() {
  phase = 'playing'; state = null; pauseOpen = false; endShown = false;
  seen.reaction = 0; seen.notice = 0; seen.first = true;
  endFx.stop(); view = 'counter'; toggleUI(); menu.hideAll();
  await refresh();
}

// Si el servidor tarda en responder (Render gratis se duerme), avisa al jugador
async function withWake(fn) {
  const t = setTimeout(() => toast('Despertando el servidor... puede tardar hasta 1 minuto'), 3000);
  try { return await fn(); } finally { clearTimeout(t); }
}

// Autoguardado: cada 5 s el servidor firma una foto de la partida y se guarda en el navegador
async function saveSnapshot() {
  if (phase !== 'playing' || !state) return;
  const r = await api('/game/snapshot');
  if (r.save) writeSave(r.save);
}

// Si el servidor se reinició o durmió, retoma la partida desde el último guardado local
async function resumeFromLocal() {
  if (resuming) return;
  resuming = true;
  try {
    const save = currentSlot ? getSave(currentSlot) : null;
    if (save) {
      state = null;
      const r = await api('/slots/load', { save });
      if (r.success) {
        if (pauseOpen) await api('/game/pause', { paused: true });
        return;
      }
    }
    goTitle();
  } finally { resuming = false; }
}

async function openPause() {
  if (!canPlay() || transition.active) return;
  pauseOpen = true;
  computerUI.close();
  const r = await api('/game/pause', { paused: true });
  if (r.state) applyState(r.state);
  menu.showPause();
}

async function resume() {
  if (!pauseOpen) return;
  const r = await api('/game/pause', { paused: false });
  if (r.state) applyState(r.state);
  pauseOpen = false;
  menu.hidePause();
}

async function exitToTitle() {
  const r = await api('/game/exit', {});
  if (r.save) writeSave(r.save);
  goTitle();
}

function updateMusicUI() {
  document.getElementById('music-btn').textContent = music.muted ? '🔇' : '🔊';
  menu.setMuted(music.muted);
}

const menu = new MenuUI({
  load: async (slot) => {
    const save = getSave(slot);
    if (!save) { toast('Ese slot está vacío', 'error'); return; }
    const r = await withWake(() => api('/slots/load', { save }));
    if (r.success) { writeSave(r.save); currentSlot = slot; enterGame(); } else toast(r.error, 'error');
  },
  create: async (slot, name) => {
    const r = await withWake(() => api('/slots/new', { slot, name }));
    if (r.success) { writeSave(r.save); currentSlot = slot; enterGame(); } else toast(r.error, 'error');
  },
  remove: async (slot) => {
    if (!(await menu.ask('¿Borrar esta partida? No se puede deshacer.'))) return;
    deleteSave(slot);
    menu.showTitle(readSaves());
  },
  resume,
  restart: async () => {
    if (!(await menu.ask('¿Reiniciar la partida? Pierdes el progreso de esta vuelta (conservas nombre y estrellas).'))) return;
    const r = await api('/game/restart', {});
    pauseOpen = false; menu.hidePause();
    if (r.save) writeSave(r.save);
    if (r.state) applyState(r.state);
  },
  exit: exitToTitle,
  toggleMusic: () => { music.toggle(); updateMusicUI(); },
  toggleFs: () => toggleFs(),
  endContinue: async () => {
    const r = await api('/game/restart', {});
    endShown = false; endFx.stop(); menu.hideEnd();
    if (r.save) writeSave(r.save);
    if (r.state) applyState(r.state);
  }
});

// ---------- UI de juego ----------
const kitchenUI = new KitchenUI(document.getElementById('kitchen-ui'), {
  add: (name) => doAction('/ingredient', { ingredient: name }),
  clear: () => doAction('/clear'),
  storeFridge: (name) => doAction('/store', { ingredient: name, place: 'fridge' }),
  storeBox: (name) => doAction('/store', { ingredient: name, place: 'box' })
});

const computerUI = new ComputerUI(document.getElementById('pc-modal'), {
  buyTable: () => doAction('/buy/table'),
  buyChair: (id) => doAction('/buy/chair', { tableId: id }),
  expand: () => doAction('/expand'),
  buyIng: (name, qty) => doAction('/buy/ingredient', { ingredient: name, qty }),
  theme: (key, val) => doAction('/customize', { [key]: val }),
  hire: (key) => doAction('/helpers/hire', { helper: key })
});

function toggleUI() {
  document.getElementById('kitchen-ui').classList.toggle('hidden', view !== 'counter');
  document.getElementById('dining-ui').classList.toggle('hidden', view !== 'dining');
}

window.switchView = function (v) {
  if (v === view || transition.active || !canPlay()) return;
  computerUI.close();
  sound.playWhoosh();
  const toKitchen = v === 'counter';
  transition.start(
    toKitchen ? '台所' : '客席',
    toKitchen ? 'COCINA' : 'SALÓN',
    toKitchen ? '¡A preparar los pedidos!' : 'Cobra, limpia y atiende el local',
    () => { view = v; toggleUI(); }
  );
};

// ---------- pantalla completa ----------
const stage = document.getElementById('stage');
function fitCanvas() {
  if (!document.body.classList.contains('fs')) { canvas.style.width = ''; canvas.style.height = ''; return; }
  const r = stage.getBoundingClientRect();
  const w = Math.min(r.width, r.height * W / H);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${w * H / W}px`;
}
function updateFsUI() {
  const on = document.body.classList.contains('fs');
  document.getElementById('fs-btn').textContent = on ? '🗗' : '⛶';
  menu.setFs(on);
}
async function setFs(on) {
  document.body.classList.toggle('fs', on);
  try {
    if (on && !document.fullscreenElement) await document.documentElement.requestFullscreen();
    else if (!on && document.fullscreenElement) await document.exitFullscreen();
  } catch { /* si el navegador lo niega, igual queda expandido dentro de la ventana */ }
  fitCanvas(); updateFsUI();
}
const toggleFs = () => setFs(!document.body.classList.contains('fs'));
new ResizeObserver(fitCanvas).observe(stage);
window.addEventListener('resize', fitCanvas);
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement && document.body.classList.contains('fs')) {
    document.body.classList.remove('fs'); fitCanvas(); updateFsUI();
  }
});
document.getElementById('fs-btn').addEventListener('click', toggleFs);

document.getElementById('menu-btn').addEventListener('click', openPause);
document.getElementById('music-btn').addEventListener('click', () => { music.start(); music.toggle(); updateMusicUI(); });

// ---------- interacción ----------
async function interact() {
  if (!canPlay() || view !== 'dining' || computerUI.isOpen || transition.active) return;
  const t = findTarget(state, player);
  if (!t) return;
  if (t.type === 'pc') { sound.playClick(); computerUI.open(state); return; }
  await doAction('/interact', { tableId: t.table.id, px: player.x + player.w / 2, py: player.y + player.h / 2 });
}

window.addEventListener('keydown', (e) => {
  if (phase !== 'playing') return;
  if (e.key === 'Escape') {
    if (computerUI.isOpen) computerUI.close();
    else if (pauseOpen) resume();
    else openPause();
    return;
  }
  const k = e.key.toLowerCase();
  if (e.repeat) return;
  if (k === 'f') toggleFs();
  else if (k === 'p') { if (pauseOpen) resume(); else openPause(); }
  else if (k === 'e') interact();
});

canvas.addEventListener('click', (e) => {
  if (!canPlay() || transition.active) return;
  const r = canvas.getBoundingClientRect();
  const x = (e.clientX - r.left) * (canvas.width / r.width);
  const y = (e.clientY - r.top) * (canvas.height / r.height);
  if (view === 'counter') {
    const card = counterRenderer.cardRects.find(c => x >= c.x && x <= c.x + c.w && y >= c.y && y <= c.y + c.h);
    if (card) doAction('/serve', { customerId: card.id });
  } else {
    interact();
  }
});

// ---------- bucle de dibujo ----------
let last = performance.now();
function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  if (phase === 'playing' && state) {
    if (view === 'counter') {
      counterRenderer.render(state, now, helperRenderer);
    } else {
      if (canPlay() && !computerUI.isOpen && !transition.active) {
        player.update(dt, state.tables, { minX: 0, maxX: REGION_W[state.expansion], minY: 85, maxY: H - 2 });
      }
      const target = computerUI.isOpen || !canPlay() ? null : findTarget(state, player);
      diningRenderer.render(state, player, now, target, helperRenderer);
    }
    fx.draw(ctx, view, now);
    transition.draw(ctx, W, H);
    endFx.draw(ctx, now, W, H);
  } else {
    ctx.fillStyle = '#1a0f0a'; ctx.fillRect(0, 0, W, H);
    if (phase === 'playing') {
      ctx.fillStyle = '#9ca3af'; ctx.font = '24px VT323';
      ctx.fillText('Conectando con el servidor (npm run start:backend)...', 120, 160);
    }
  }
  requestAnimationFrame(frame);
}

toggleUI();
updateMusicUI();
setInterval(refresh, 500);
setInterval(saveSnapshot, 5000);
wake();
requestAnimationFrame(frame);
goTitle();
