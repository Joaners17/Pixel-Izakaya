import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SaveManager } from './logic/SaveManager.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// ALLOWED_ORIGIN (opcional): dominio(s) de Vercel permitidos, separados por coma. Sin definir = cualquiera.
const origins = process.env.ALLOWED_ORIGIN ? process.env.ALLOWED_ORIGIN.split(',').map(s => s.trim()) : undefined;
app.use(cors({ origin: origins ?? true, maxAge: 600 }));
app.use(express.json());

// Sirve también el frontend (local, o todo junto en Render)
app.use(express.static(path.join(__dirname, '../../frontend')));
app.get('/health', (req, res) => res.send('ok'));

// ---- Un jugador = un id (header X-Player) = su propia sesión en memoria ----
const IDLE_MS = 30 * 60 * 1000;
const players = new Map(); // id -> { saves: SaveManager, last }

function player(req) {
  let id = String(req.get('x-player') || '');
  if (!/^[a-zA-Z0-9-]{8,64}$/.test(id)) id = 'local';
  let p = players.get(id);
  if (!p) { p = { saves: new SaveManager(), last: 0 }; players.set(id, p); }
  p.last = Date.now();
  return { id, saves: p.saves };
}

const num = (v) => Number(v);
const NO_GAME = { success: false, noGame: true, error: 'No hay partida activa' };

// Ejecuta una acción sobre la partida activa del jugador (o responde "no hay partida")
const withGame = (fn) => (req, res) => {
  const { id, saves } = player(req);
  if (!saves.game) return res.status(409).json(NO_GAME);
  res.json(fn(saves.game, req.body || {}, id));
};

// ---- Partidas (los slots viven en el navegador; aquí solo se crean/cargan/firman) ----
app.post('/api/slots/new',  (req, res) => res.json(player(req).saves.create(num(req.body.slot), req.body.name)));
app.post('/api/slots/load', (req, res) => res.json(player(req).saves.load(req.body.save)));
app.get('/api/game/snapshot', (req, res) => {
  const save = player(req).saves.pack();
  save ? res.json({ success: true, save }) : res.status(409).json(NO_GAME);
});

// ---- Control de la partida ----
app.get('/api/state',         (req, res) => { const { saves } = player(req); res.json(saves.game ? saves.game.getState() : { noGame: true }); });
app.post('/api/game/pause',   withGame((g, b) => g.setPaused(!!b.paused)));
app.post('/api/game/restart', (req, res) => {
  const { saves } = player(req);
  if (!saves.game) return res.status(409).json(NO_GAME);
  const r = saves.game.restart();
  res.json({ ...r, save: saves.pack() });
});
app.post('/api/game/exit',    (req, res) => res.json(player(req).saves.exit()));

// ---- Cocina ----
app.post('/api/ingredient',   withGame((g, b, id) => g.addIngredient(id, b.ingredient)));
app.post('/api/clear',        withGame((g, b, id) => g.clearPlate(id)));
app.post('/api/serve',        withGame((g, b, id) => g.serveOrder(id, num(b.customerId))));
app.post('/api/store',        withGame((g, b, id) => g.storeDelivery(id, b.ingredient, b.place)));

// ---- Salón ----
app.post('/api/interact',     withGame((g, b, id) => g.interact(id, num(b.tableId), num(b.px), num(b.py))));

// ---- Ayudantes ----
app.post('/api/helpers/hire', withGame((g, b, id) => g.hireHelper(id, b.helper)));

// ---- Ordenador ----
app.post('/api/buy/ingredient', withGame((g, b, id) => g.buyIngredient(id, b.ingredient, b.qty)));
app.post('/api/buy/table',      withGame((g, b, id) => g.buyTable(id)));
app.post('/api/buy/chair',      withGame((g, b, id) => g.buyChair(id, num(b.tableId))));
app.post('/api/expand',         withGame((g, b, id) => g.expand(id)));
app.post('/api/customize',      withGame((g, b, id) => g.customize(id, b)));

app.use((err, req, res, next) => res.status(400).json({ success: false, error: 'Petición inválida' }));

// Los jugadores inactivos (30 min) salen de memoria; su partida sigue guardada en su navegador
setInterval(() => {
  for (const [id, p] of players) if (Date.now() - p.last > IDLE_MS) players.delete(id);
}, 60000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Izakaya Backend Autoritativo corriendo en http://localhost:${PORT}`);
});
