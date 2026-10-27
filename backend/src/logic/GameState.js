import { SecureUtils } from '../security/SecureUtils.js';

export const MAX_LEVEL = 19;

// ===================== CATÁLOGOS =====================
// fridge: true = va en la nevera (si va a la caja se echa a perder). unlock = nivel que lo desbloquea.
export const INGREDIENTS = {
  'Caldo':          { icon: '🍲', fridge: true,  unlock: 1,  price: 30 },
  'Fideos':         { icon: '🍜', fridge: false, unlock: 1,  price: 20 },
  'Nori':           { icon: '🌿', fridge: false, unlock: 1,  price: 15 },
  'Arroz':          { icon: '🍚', fridge: false, unlock: 1,  price: 15 },
  'Pescado':        { icon: '🐟', fridge: true,  unlock: 2,  price: 50 },
  'Huevo':          { icon: '🥚', fridge: true,  unlock: 3,  price: 25 },
  'Pollo':          { icon: '🍗', fridge: true,  unlock: 4,  price: 45 },
  'Salsa Teriyaki': { icon: '🥫', fridge: false, unlock: 4,  price: 20 },
  'Pasta de Miso':  { icon: '🥣', fridge: true,  unlock: 5,  price: 30 },
  'Tofu':           { icon: '⬜', fridge: true,  unlock: 5,  price: 25 },
  'Cerdo':          { icon: '🥩', fridge: true,  unlock: 6,  price: 55 },
  'Masa de Gyoza':  { icon: '🥟', fridge: false, unlock: 6,  price: 25 },
  'Camarón':        { icon: '🦐', fridge: true,  unlock: 7,  price: 60 },
  'Harina Tempura': { icon: '🌾', fridge: false, unlock: 7,  price: 20 },
  'Pulpo':          { icon: '🐙', fridge: true,  unlock: 8,  price: 65 },
  'Col':            { icon: '🥬', fridge: true,  unlock: 9,  price: 18 },
  'Pan Panko':      { icon: '🍞', fridge: false, unlock: 10, price: 22 },
  'Fideos Udon':    { icon: '🍝', fridge: false, unlock: 11, price: 28 },
  'Cebollín':       { icon: '🧅', fridge: true,  unlock: 11, price: 15 },
  'Fideos Soba':    { icon: '🍜', fridge: false, unlock: 12, price: 28 },
  'Wasabi':         { icon: '🟢', fridge: false, unlock: 12, price: 35 },
  'Salsa de Soja':  { icon: '🍶', fridge: false, unlock: 14, price: 20 },
  'Anguila':        { icon: '🐟', fridge: true,  unlock: 15, price: 85 },
  'Atún':           { icon: '🐟', fridge: true,  unlock: 16, price: 80 },
  'Salmón':         { icon: '🍣', fridge: true,  unlock: 16, price: 75 },
  'Res':            { icon: '🥩', fridge: true,  unlock: 17, price: 90 }
};

// Un plato nuevo por nivel desde el 5 hasta el 19 (el orden del objeto = orden de desbloqueo)
export const DISHES = {
  'Onigiri':           { icon: '🍙', ing: ['Arroz', 'Nori'],                                              price: 120,  unlock: 1 },
  'Ramen Tradicional': { icon: '🍜', ing: ['Caldo', 'Fideos', 'Nori'],                                    price: 220,  unlock: 1 },
  'Sushi':             { icon: '🍣', ing: ['Arroz', 'Pescado', 'Nori'],                                   price: 260,  unlock: 2 },
  'Ramen Especial':    { icon: '🍥', ing: ['Caldo', 'Fideos', 'Huevo', 'Nori'],                           price: 380,  unlock: 3 },
  'Yakitori':          { icon: '🍢', ing: ['Pollo', 'Salsa Teriyaki'],                                    price: 320,  unlock: 4 },
  'Sopa Miso':         { icon: '🥣', ing: ['Caldo', 'Pasta de Miso', 'Tofu'],                             price: 280,  unlock: 5 },
  'Gyoza':             { icon: '🥟', ing: ['Cerdo', 'Masa de Gyoza'],                                     price: 300,  unlock: 6 },
  'Tempura':           { icon: '🍤', ing: ['Camarón', 'Harina Tempura'],                                  price: 340,  unlock: 7 },
  'Takoyaki':          { icon: '🐙', ing: ['Pulpo', 'Harina Tempura', 'Huevo'],                           price: 360,  unlock: 8 },
  'Okonomiyaki':       { icon: '🥞', ing: ['Col', 'Harina Tempura', 'Huevo', 'Cerdo'],                    price: 420,  unlock: 9 },
  'Katsudon':          { icon: '🍛', ing: ['Cerdo', 'Huevo', 'Arroz', 'Pan Panko'],                       price: 450,  unlock: 10 },
  'Udon':              { icon: '🍜', ing: ['Fideos Udon', 'Caldo', 'Cebollín'],                           price: 430,  unlock: 11 },
  'Soba Frío':         { icon: '🥢', ing: ['Fideos Soba', 'Nori', 'Wasabi'],                              price: 460,  unlock: 12 },
  'Tonkatsu':          { icon: '🍖', ing: ['Cerdo', 'Pan Panko', 'Huevo', 'Col'],                         price: 520,  unlock: 13 },
  'Oyakodon':          { icon: '🍳', ing: ['Pollo', 'Huevo', 'Arroz', 'Salsa de Soja'],                   price: 540,  unlock: 14 },
  'Unagi Don':         { icon: '🍱', ing: ['Anguila', 'Arroz', 'Salsa Teriyaki', 'Nori'],                 price: 620,  unlock: 15 },
  'Sashimi':           { icon: '🍣', ing: ['Atún', 'Salmón', 'Wasabi'],                                   price: 700,  unlock: 16 },
  'Sukiyaki':          { icon: '🍲', ing: ['Res', 'Tofu', 'Col', 'Huevo', 'Salsa de Soja'],               price: 780,  unlock: 17 },
  'Chirashi':          { icon: '🍱', ing: ['Arroz', 'Salmón', 'Atún', 'Camarón', 'Nori'],                 price: 900,  unlock: 18 },
  'Kaiseki':           { icon: '🏮', ing: ['Res', 'Salmón', 'Camarón', 'Arroz', 'Tofu', 'Pasta de Miso'], price: 1100, unlock: 19 }
};

// Valoración (%). Ajusta estos números para balancear la dificultad.
const RATING = {
  start: 2.0,     // valoración inicial
  goal: 10,       // meta: solo alcanzable en el nivel 19 (el tope sube con cada nivel)
  capBase: 2.5,   // tope en el nivel 1
  like3: 0.12,    // cliente encantado (servido rápido)
  like2: 0.06,    // cliente satisfecho
  late: -0.12,    // comió pero tardaste mucho
  wrong: -0.25,   // plato equivocado
  timeout: -0.35  // se fue por esperar
};

// Posiciones posibles de mesas. exp = nivel de expansión que las habilita.
export const SLOTS = [
  { x: 70,  y: 110, exp: 0 }, { x: 220, y: 110, exp: 0 }, { x: 370, y: 110, exp: 0 },
  { x: 145, y: 220, exp: 0 }, { x: 295, y: 220, exp: 0 },
  { x: 520, y: 110, exp: 1 }, { x: 445, y: 220, exp: 1 },
  { x: 595, y: 220, exp: 2 }, { x: 665, y: 110, exp: 2 }
];

// Ayudantes contratables (se desbloquean por nivel). keepOnStar: se conserva al ganar una estrella.
export const HELPERS = {
  cleaner: { name: 'Limpiador', icon: '🧹', unlock: 4,  cost: 600,  keepOnStar: true,  desc: 'Limpia mesas y sillas y recoge el dinero.' },
  buyer:   { name: 'Comprador', icon: '🛒', unlock: 7,  cost: 600,  keepOnStar: false, desc: 'Revisa los ingredientes que faltan, los compra y los guarda en la nevera y la caja.' },
  cook:    { name: 'Cocinero',  icon: '👨‍🍳', unlock: 12, cost: 5500, keepOnStar: false, desc: 'Toma los pedidos y los cocina. Descansa un nivel de cada dos.' }
};

const TABLE_W = 56, TABLE_H = 44;
const COSTS = { table: 300, chair: 80, expansion: [1000, 2500], maxSeats: 4 };
const THEMES = {
  floor: ['tatami', 'madera', 'piedra'],
  table: ['madera', 'laca', 'negro'],
  lantern: ['rojo', 'azul', 'verde']
};
const NAMES = ['Kenji', 'Aoi', 'Taro', 'Ren', 'Hanako', 'Yuki', 'Sora', 'Mei'];

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const num = (v, d) => (Number.isFinite(v) ? v : d);

export function cleanOwnerName(v) {
  return String(v ?? '').replace(/[^\p{L}\p{N} _-]/gu, '').trim().slice(0, 16) || 'Chef';
}

export class GameStateManager {
  constructor(owner = 'Chef', stars = 0) {
    this.owner = cleanOwnerName(owner);
    this.stars = Math.max(0, Math.floor(stars) || 0);
    this.theme = { floor: 'tatami', table: 'madera', lantern: 'rojo' };
    this.checksum = '';
    this._id = 1; this._ev = 1; this._rev = 0;
    this.resetRun();
  }

  // Reinicia la "run" (conserva dueño, estrellas y decoración)
  resetRun(keepCleaner = false) {
    this.coins = 300;
    this.rating = RATING.start;
    this.level = 1;
    this.xp = 0;
    this.currentPlate = [];
    this.storage = { Caldo: 4, Fideos: 4, Nori: 4, Arroz: 4 };
    this.delivery = {};
    this.customers = [];
    this.tables = [];
    this.expansion = 0;
    this.reactions = [];
    this.notices = [];
    this.status = 'playing';   // 'playing' | 'lost' | 'won'
    this.paused = false;
    this.helpers = this.makeHelpers(keepCleaner);
    this.spawnTimer = 2;
    this.lastTick = Date.now();
    this.addTable();
    this.addTable();
    this.commit();
  }

  // ---------- integridad ----------
  refreshChecksum() { this.checksum = SecureUtils.computeChecksum({ coins: this.coins, reputation: this.rating }); }
  verifyIntegrity() { return SecureUtils.computeChecksum({ coins: this.coins, reputation: this.rating }) === this.checksum; }
  commit() { this.refreshChecksum(); }

  // ---------- utilidades ----------
  nid() { return this._id++; }
  evId() { return this._ev++; }
  ok(message) { return { success: true, message }; }
  fail(error) { return { success: false, error }; }
  getIng(name) { return typeof name === 'string' && Object.hasOwn(INGREDIENTS, name) ? INGREDIENTS[name] : null; }
  maxWaiting() { return this.level >= 3 ? 3 : 2; }
  capacity() { const c = 24 + this.level * 3; return { fridge: c, box: c }; }
  usage() {
    const u = { fridge: 0, box: 0 };
    for (const [n, q] of Object.entries(this.storage)) u[INGREDIENTS[n].fridge ? 'fridge' : 'box'] += q;
    return u;
  }
  freeSlots() {
    return SLOTS.map((s, i) => ({ ...s, i }))
      .filter(s => s.exp <= this.expansion && !this.tables.some(t => t.slot === s.i));
  }

  // ---------- dificultad ----------
  difficulty() { return 1 + 0.25 * this.stars; }                         // multiplica las penalizaciones
  patienceMax() { return Math.max(12, Math.max(20, 58 - this.level * 2) / (1 + 0.12 * this.stars)); }
  spawnInterval() { return Math.max(3.5, Math.max(5, 17 - this.level * 0.6) / (1 + 0.15 * this.stars)); }
  xpToNext() { return 30 + (this.level - 1) * 10; }
  ratingCap() { return Math.min(RATING.goal, RATING.capBase + (this.level - 1) * (RATING.goal - RATING.capBase) / (MAX_LEVEL - 1)); }

  changeRating(d) {
    this.rating = Math.round(clamp(this.rating + d, 0, this.ratingCap()) * 100) / 100;
    this.checkEnd();
  }

  checkEnd() {
    if (this.status !== 'playing') return;
    if (this.rating <= 0) {
      this.status = 'lost';
      this.notify('bad', `${this.owner}, tu izakaya perdió toda su valoración...`);
    } else if (this.level >= MAX_LEVEL && this.rating >= RATING.goal) {
      this.status = 'won';
      this.stars++;
      this.notify('levelup', '¡Tu izakaya llegó al 10% de valoración!');
    }
  }

  act(clientId, key, cooldown, fn) {
    if (this.paused || this.status !== 'playing') {
      return { success: false, error: this.paused ? 'Juego en pausa' : 'La partida terminó', state: this.getState() };
    }
    if (!SecureUtils.checkRateLimit(clientId, key, cooldown)) {
      return { success: false, error: 'Demasiado rápido', state: this.getState() };
    }
    this.tick();
    const r = fn() || {};
    this.commit();
    return { ...r, state: this.getState(false) };
  }

  pushReaction(c, type, level) {
    const now = Date.now();
    this.reactions = this.reactions.filter(r => now - r.at < 8000);
    this.reactions.push({ id: this.evId(), customerId: c.id, tableId: c.tableId, seatId: c.seatId, type, level, at: now });
  }
  notify(kind, text) {
    const now = Date.now();
    this.notices = this.notices.filter(n => now - n.at < 10000);
    this.notices.push({ id: this.evId(), kind, text, at: now });
  }

  addXp(n) {
    if (this.level >= MAX_LEVEL) return;
    this.xp += n;
    while (this.level < MAX_LEVEL && this.xp >= this.xpToNext()) {
      this.xp -= this.xpToNext();
      this.level++;
      const dishes = Object.entries(DISHES).filter(([, d]) => d.unlock === this.level).map(([k]) => k);
      const ings = Object.entries(INGREDIENTS).filter(([, i]) => i.unlock === this.level).map(([k]) => k);
      let msg = `¡Nivel ${this.level}!`;
      if (dishes.length) msg += ` Plato nuevo: ${dishes.join(', ')}.`;
      if (ings.length) msg += ` Ingredientes: ${ings.join(', ')}.`;
      this.notify('levelup', msg);
    }
    if (this.level >= MAX_LEVEL) this.xp = 0;
  }

  // ---------- control de partida ----------
  setPaused(p) {
    if (this.status === 'playing') { this.tick(); this.paused = !!p; }
    this.lastTick = Date.now();
    this.commit();
    return { success: true, state: this.getState(false) };
  }
  keepCleaner() { return this.status === 'won' && this.helpers.cleaner.hired; } // la estrella conserva solo al limpiador
  finishRun() { if (this.status !== 'playing') this.resetRun(this.keepCleaner()); }
  restart() { this.resetRun(this.keepCleaner()); return { success: true, state: this.getState(false) }; }

  // ---------- reloj del juego ----------
  tick() {
    const now = Date.now();
    const dt = Math.min((now - this.lastTick) / 1000, 2);
    this.lastTick = now;
    if (this.paused || this.status !== 'playing' || dt <= 0) return;

    for (const c of [...this.customers]) {
      if (this.status !== 'playing') break;
      if (c.state === 'waiting') {
        c.patience -= dt;
        if (c.patience <= 0) this.customerLeaves(c);
      } else if (c.state === 'eating') {
        c.eatLeft -= dt;
        if (c.eatLeft <= 0) this.finishEating(c);
      }
    }
    this.tickHelpers(dt);
    if (this.status !== 'playing') return;

    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      const ok = this.spawnCustomer();
      this.spawnTimer = ok ? this.spawnInterval() : 3;
    }
  }

  // ---------- clientes ----------
  spawnCustomer() {
    if (this.customers.filter(c => c.state === 'waiting').length >= this.maxWaiting()) return false;
    const free = [];
    for (const t of this.tables) {
      if (t.dirty) continue;
      for (const seat of t.seats) if (!seat.dirty && seat.customerId === null) free.push({ t, seat });
    }
    if (!free.length) return false; // sin sillas limpias no entran clientes
    const { t, seat } = pick(free);
    const dishes = Object.keys(DISHES).filter(d => this.level >= DISHES[d].unlock);
    const order = Math.random() < 0.5 ? pick(dishes.slice(-3)) : pick(dishes); // favorece los platos nuevos
    const maxP = this.patienceMax();
    const c = {
      id: this.nid(), name: pick(NAMES), order,
      patience: maxP, maxPatience: maxP, state: 'waiting',
      tableId: t.id, seatId: seat.id, eatLeft: 0, pay: 0, cooking: false
    };
    seat.customerId = c.id;
    this.customers.push(c);
    return true;
  }

  removeCustomer(c) {
    this.customers = this.customers.filter(x => x.id !== c.id);
    const t = this.tables.find(x => x.id === c.tableId);
    const seat = t?.seats.find(s => s.id === c.seatId);
    if (seat) seat.customerId = null;
  }

  customerLeaves(c) {
    this.pushReaction(c, 'dislike', 3);
    this.removeCustomer(c);
    this.notify('bad', `${c.name} se cansó de esperar y se fue furioso`);
    this.changeRating(RATING.timeout * this.difficulty());
  }

  finishEating(c) {
    const t = this.tables.find(x => x.id === c.tableId);
    const seat = t?.seats.find(s => s.id === c.seatId);
    this.removeCustomer(c);
    if (t) {
      t.dirty = true;
      t.money += c.pay;
      if (seat && Math.random() < 0.6) seat.dirty = true;
    }
  }

  // ---------- cocina ----------
  validateRecipe(ingredients) {
    const sorted = [...ingredients].sort().join(',');
    for (const [name, d] of Object.entries(DISHES)) {
      if (this.level >= d.unlock && [...d.ing].sort().join(',') === sorted) return name;
    }
    return null;
  }

  addIngredient(clientId, name) {
    return this.act(clientId, 'add_ing', 120, () => {
      const ing = this.getIng(name);
      if (!ing) return this.fail('Ingrediente desconocido');
      if (this.level < ing.unlock) return this.fail(`Bloqueado: nivel ${ing.unlock}`);
      if ((this.storage[name] || 0) <= 0) return this.fail(`Sin ${name} en el almacén`);
      if (this.currentPlate.length >= 6) return this.fail('El plato está lleno');
      this.storage[name]--;
      this.currentPlate.push(name);
      return this.ok('');
    });
  }

  clearPlate(clientId = 'local') {
    return this.act(clientId, 'clear', 150, () => {
      for (const n of this.currentPlate) this.storage[n] = (this.storage[n] || 0) + 1; // se devuelven
      this.currentPlate = [];
      return this.ok('');
    });
  }

  serveOrder(clientId, customerId) {
    return this.act(clientId, 'serve', 200, () => {
      const c = this.customers.find(x => x.id === customerId && x.state === 'waiting');
      if (!c) return this.fail('Ese cliente ya no está esperando');
      if (c.cooking) return this.fail('El cocinero ya está preparando ese pedido');
      if (this.currentPlate.length === 0) return this.fail('El plato está vacío');

      const dish = this.validateRecipe(this.currentPlate);
      this.currentPlate = [];

      if (dish !== c.order) {
        this.pushReaction(c, 'dislike', 2);
        this.removeCustomer(c);
        this.changeRating(RATING.wrong * this.difficulty());
        return this.fail(`${c.name} pidió ${c.order} y recibió otra cosa. ¡Se fue molesto!`);
      }

      return this.finishServe(c, dish);
    });
  }

  // Cliente servido (por el jugador o por el cocinero): reacción, pago, experiencia y valoración
  finishServe(c, dish) {
    const ratio = c.patience / c.maxPatience;
    const price = DISHES[dish].price;
    let type, level, delta;
    if (ratio >= 0.5)       { type = 'like';    level = 3; delta = RATING.like3; }
    else if (ratio >= 0.25) { type = 'like';    level = 2; delta = RATING.like2; }
    else                    { type = 'dislike'; level = 1; delta = RATING.late * this.difficulty(); }

    c.pay = Math.round(price * (0.5 + 0.5 * ratio)) + (level === 3 ? Math.round(price * 0.15) : 0);
    c.state = 'eating';
    c.eatLeft = 8;
    c.cooking = false;
    this.pushReaction(c, type, level);
    this.addXp(type === 'like' ? 15 : 8);   // primero el nivel (sube el tope), luego la valoración
    this.changeRating(delta);
    return this.ok(type === 'like' ? `${c.name} disfruta su ${dish}` : `${c.name} comió con mala cara (tardaste mucho)`);
  }

  // ---------- nevera / caja ----------
  storeDelivery(clientId, name, place) {
    return this.act(clientId, 'store', 150, () => {
      const ing = this.getIng(name);
      const qty = ing ? this.delivery[name] : 0;
      if (!qty) return this.fail('No hay entrega de eso');
      if (place !== 'fridge' && place !== 'box') return this.fail('Lugar inválido');
      if (place === 'box' && ing.fridge) {
        delete this.delivery[name];
        this.notify('bad', `¡${name} se echó a perder fuera de la nevera!`);
        return this.fail(`¡${name} se echó a perder! Va en la nevera.`);
      }
      if (place === 'fridge' && !ing.fridge) return this.fail(`${name} no necesita nevera: va en la caja`);
      const space = this.capacity()[place] - this.usage()[place];
      const move = Math.min(qty, space);
      if (move <= 0) return this.fail(place === 'fridge' ? 'La nevera está llena' : 'La caja está llena');
      this.storage[name] = (this.storage[name] || 0) + move;
      if (move === qty) delete this.delivery[name]; else this.delivery[name] = qty - move;
      return this.ok(`Guardaste ${move} ${name}`);
    });
  }

  // ---------- salón ----------
  interact(clientId, tableId, px, py) {
    return this.act(clientId, 'interact', 150, () => {
      const t = this.tables.find(x => x.id === tableId);
      if (!t) return this.fail('Mesa inválida');
      if (!Number.isFinite(px) || !Number.isFinite(py)) return this.fail('Posición inválida');
      if (Math.hypot(px - (t.x + TABLE_W / 2), py - (t.y + TABLE_H / 2)) > 110) return this.fail('Estás muy lejos de la mesa');

      if (t.money > 0) {
        const m = t.money;
        this.coins += m;
        t.money = 0;
        return { success: true, message: `Cobraste ¥${m}`, sound: 'coin' };
      }
      if (t.dirty) { t.dirty = false; return this.ok('Mesa limpia'); }
      const seat = t.seats.find(s => s.dirty && s.customerId === null);
      if (seat) { seat.dirty = false; return this.ok('Silla limpia'); }
      return this.fail('No hay nada que hacer aquí');
    });
  }

  // ---------- ordenador ----------
  buyIngredient(clientId, name, qty) {
    return this.act(clientId, 'buy_ing', 100, () => {
      const ing = this.getIng(name);
      qty = Math.floor(Number(qty));
      if (!ing) return this.fail('Ingrediente desconocido');
      if (!(qty >= 1 && qty <= 20)) return this.fail('Cantidad inválida');
      if (this.level < ing.unlock) return this.fail(`Se desbloquea en el nivel ${ing.unlock}`);
      const cost = ing.price * qty;
      if (this.coins < cost) return this.fail('Fondos insuficientes');
      this.coins -= cost;
      this.delivery[name] = (this.delivery[name] || 0) + qty;
      return this.ok(`Compraste ${qty} ${name}. Guárdalo en la cocina.`);
    });
  }

  addTable() {
    const slot = this.freeSlots()[0];
    if (!slot) return null;
    const t = {
      id: this.nid(), slot: slot.i, x: slot.x, y: slot.y, dirty: false, money: 0,
      seats: [{ id: this.nid(), dirty: false, customerId: null }, { id: this.nid(), dirty: false, customerId: null }]
    };
    this.tables.push(t);
    return t;
  }

  buyTable(clientId) {
    return this.act(clientId, 'buy_table', 200, () => {
      if (this.coins < COSTS.table) return this.fail('Fondos insuficientes');
      if (!this.freeSlots().length) return this.fail('No hay espacio: expande el local');
      this.coins -= COSTS.table;
      this.addTable();
      return this.ok('Mesa nueva instalada');
    });
  }

  buyChair(clientId, tableId) {
    return this.act(clientId, 'buy_chair', 200, () => {
      const t = this.tables.find(x => x.id === tableId);
      if (!t) return this.fail('Mesa inválida');
      if (t.seats.length >= COSTS.maxSeats) return this.fail('Esa mesa ya tiene el máximo de sillas');
      if (this.coins < COSTS.chair) return this.fail('Fondos insuficientes');
      this.coins -= COSTS.chair;
      t.seats.push({ id: this.nid(), dirty: false, customerId: null });
      return this.ok('Silla añadida');
    });
  }

  expand(clientId) {
    return this.act(clientId, 'expand', 300, () => {
      const cost = COSTS.expansion[this.expansion];
      if (cost === undefined) return this.fail('El local ya está al máximo');
      if (this.coins < cost) return this.fail('Fondos insuficientes');
      this.coins -= cost;
      this.expansion++;
      return this.ok('¡Local ampliado!');
    });
  }

  customize(clientId, opts = {}) {
    return this.act(clientId, 'customize', 100, () => {
      for (const key of Object.keys(THEMES)) {
        if (opts[key] !== undefined) {
          if (!THEMES[key].includes(opts[key])) return this.fail('Opción inválida');
          this.theme[key] = opts[key];
        }
      }
      return this.ok('');
    });
  }

  // ---------- ayudantes ----------
  makeHelpers(keepCleaner = false) {
    return {
      cleaner: { hired: keepCleaner, phase: 'idle', t: 2, dur: 1, target: null },
      buyer:   { hired: false, phase: 'idle', t: 4, dur: 1, plan: [] },
      cook:    { hired: false, hiredLevel: 0, phase: 'idle', t: 1, dur: 1, target: null, dish: null }
    };
  }

  hireHelper(clientId, key) {
    return this.act(clientId, 'hire', 300, () => {
      const def = typeof key === 'string' && Object.hasOwn(HELPERS, key) ? HELPERS[key] : null;
      if (!def) return this.fail('Ayudante desconocido');
      const h = this.helpers[key];
      if (h.hired) return this.fail('Ya está contratado');
      if (this.level < def.unlock) return this.fail(`Se desbloquea en el nivel ${def.unlock}`);
      if (this.coins < def.cost) return this.fail('Fondos insuficientes');
      this.coins -= def.cost;
      h.hired = true;
      if (key === 'cook') h.hiredLevel = this.level;
      return this.ok(`Contrataste al ${def.name.toLowerCase()}`);
    });
  }

  // El cocinero trabaja un nivel y descansa el siguiente
  cookWorking() { const h = this.helpers.cook; return h.hired && (this.level - h.hiredLevel) % 2 === 0; }

  tickHelpers(dt) {
    const H = this.helpers;
    if (H.cleaner.hired) this.tickCleaner(H.cleaner, dt);
    if (H.buyer.hired) this.tickBuyer(H.buyer, dt);
    if (H.cook.hired) this.tickCook(H.cook, dt);
  }

  needsCleaning(t) { return t.money > 0 || t.dirty || t.seats.some(s => s.dirty && s.customerId === null); }

  tickCleaner(h, dt) {
    h.t -= dt;
    if (h.t > 0) return;
    if (h.phase === 'idle') {
      const list = this.tables.filter(t => this.needsCleaning(t)).sort((a, b) => b.money - a.money);
      if (!list.length) { h.t = 1; return; }
      h.target = list[0].id; h.phase = 'walk'; h.dur = h.t = 1.4;
    } else {
      const t = this.tables.find(x => x.id === h.target);
      if (t) {
        this.coins += t.money; t.money = 0; t.dirty = false;
        for (const s of t.seats) if (s.customerId === null) s.dirty = false;
      }
      h.phase = 'idle'; h.target = null; h.t = 1.2;
    }
  }

  // Ingredientes de los pedidos en espera y de los 3 platos más nuevos que están por debajo de 2 unidades
  missingList() {
    const need = new Set();
    for (const c of this.customers) if (c.state === 'waiting') DISHES[c.order].ing.forEach(i => need.add(i));
    Object.values(DISHES).filter(d => this.level >= d.unlock).slice(-3).forEach(d => d.ing.forEach(i => need.add(i)));
    const list = [];
    for (const name of need) {
      const have = (this.storage[name] || 0) + (this.delivery[name] || 0);
      if (have < 2) list.push({ name, qty: 4 - have });
    }
    return list.slice(0, 4);
  }

  tickBuyer(h, dt) {
    h.t -= dt;
    if (h.t > 0) return;
    if (h.phase === 'idle') {
      h.plan = this.missingList();
      if (!h.plan.length) { h.t = 3; return; }
      h.phase = 'shop'; h.dur = h.t = 2.5;
    } else {
      const bought = [];
      for (const { name, qty } of h.plan) {
        const ing = INGREDIENTS[name];
        const q = Math.min(qty, Math.floor(this.coins / ing.price));
        if (q <= 0) continue;
        this.coins -= ing.price * q;
        const place = ing.fridge ? 'fridge' : 'box';
        const move = Math.min(q, Math.max(0, this.capacity()[place] - this.usage()[place]));
        if (move > 0) this.storage[name] = (this.storage[name] || 0) + move;
        if (q > move) this.delivery[name] = (this.delivery[name] || 0) + (q - move); // sin espacio: queda en entregas
        bought.push(`${name} x${q}`);
      }
      if (bought.length) this.notify('ok', `Comprador: repuso ${bought.join(', ')}`);
      h.phase = 'idle'; h.plan = []; h.t = 6;
    }
  }

  cookPick() {
    return this.customers
      .filter(c => c.state === 'waiting' && !c.cooking && DISHES[c.order].ing.every(n => (this.storage[n] || 0) >= 1))
      .sort((a, b) => a.patience / a.maxPatience - b.patience / b.maxPatience)[0];
  }

  tickCook(h, dt) {
    if (!this.cookWorking() && h.phase !== 'cook') { h.phase = 'rest'; h.target = null; h.dish = null; return; }
    if (h.phase === 'rest') { h.phase = 'idle'; h.t = 1; }
    h.t -= dt;
    if (h.t > 0) return;
    if (h.phase === 'idle') {
      const c = this.cookPick();
      if (!c) { h.t = 1; return; }
      const d = DISHES[c.order];
      for (const n of d.ing) this.storage[n]--;
      c.cooking = true; h.target = c.id; h.dish = c.order; h.phase = 'cook'; h.dur = h.t = 2 + d.ing.length;
    } else {
      const c = this.customers.find(x => x.id === h.target && x.state === 'waiting');
      if (c) this.finishServe(c, c.order);
      h.phase = 'idle'; h.target = null; h.dish = null; h.t = 0.8;
    }
  }

  helperState() {
    const out = {};
    for (const [key, def] of Object.entries(HELPERS)) {
      const h = this.helpers[key];
      const o = {
        name: def.name, icon: def.icon, desc: def.desc, unlock: def.unlock, cost: def.cost, keepOnStar: def.keepOnStar,
        unlocked: this.level >= def.unlock, hired: h.hired, phase: h.phase, target: h.target ?? null,
        p: h.dur > 0 ? Math.min(1, Math.max(0, 1 - h.t / h.dur)) : 0
      };
      if (key === 'cook') { o.resting = h.hired && !this.cookWorking() && h.phase !== 'cook'; o.dish = h.dish; o.backAtLevel = this.level + 1; }
      out[key] = o;
    }
    return out;
  }

  // ---------- guardado ----------
  toJSON() {
    return {
      v: 2, owner: this.owner, stars: this.stars, coins: this.coins, rating: this.rating,
      level: this.level, xp: this.xp, currentPlate: this.currentPlate, storage: this.storage,
      delivery: this.delivery, customers: this.customers, tables: this.tables,
      expansion: this.expansion, theme: this.theme, status: this.status,
      helpers: { cleaner: { hired: this.helpers.cleaner.hired }, buyer: { hired: this.helpers.buyer.hired }, cook: { hired: this.helpers.cook.hired, hiredLevel: this.helpers.cook.hiredLevel } },
      spawnTimer: this.spawnTimer, _id: this._id, _ev: this._ev, savedAt: Date.now()
    };
  }

  static fromJSON(o) {
    const g = new GameStateManager(o.owner, Number(o.stars) || 0);
    g.coins = num(o.coins, 300);
    g.rating = clamp(num(o.rating, RATING.start), 0, RATING.goal);
    g.level = clamp(Math.floor(num(o.level, 1)), 1, MAX_LEVEL);
    g.xp = Math.max(0, num(o.xp, 0));
    g.currentPlate = (Array.isArray(o.currentPlate) ? o.currentPlate : []).filter(n => g.getIng(n)).slice(0, 6);
    g.storage = {}; g.delivery = {};
    for (const [n, q] of Object.entries(o.storage || {})) if (g.getIng(n) && q > 0) g.storage[n] = Math.floor(q);
    for (const [n, q] of Object.entries(o.delivery || {})) if (g.getIng(n) && q > 0) g.delivery[n] = Math.floor(q);
    if (Array.isArray(o.tables) && o.tables.length) g.tables = o.tables;
    g.customers = (Array.isArray(o.customers) ? o.customers : []).map(c => ({ ...c, cooking: false }));
    g.expansion = clamp(Math.floor(num(o.expansion, 0)), 0, COSTS.expansion.length);
    for (const key of Object.keys(THEMES)) if (THEMES[key].includes(o.theme?.[key])) g.theme[key] = o.theme[key];
    g.status = ['playing', 'lost', 'won'].includes(o.status) ? o.status : 'playing';
    g.spawnTimer = num(o.spawnTimer, 2);
    for (const k of Object.keys(HELPERS)) {
      if (o.helpers?.[k]?.hired) { g.helpers[k].hired = true; if (k === 'cook') g.helpers.cook.hiredLevel = num(o.helpers.cook.hiredLevel, g.level); }
    }
    g._id = Math.max(g._id, num(o._id, 1));
    g._ev = Math.max(g._ev, num(o._ev, 1));
    g.paused = false;
    g.lastTick = Date.now();
    g.commit();
    return g;
  }

  // ---------- estado hacia el cliente ----------
  getState(doTick = true) {
    if (doTick) { this.tick(); this.commit(); }
    this._rev++;
    const ingredients = {};
    for (const [n, i] of Object.entries(INGREDIENTS)) ingredients[n] = { ...i, unlocked: this.level >= i.unlock };
    const dishes = {};
    for (const [n, d] of Object.entries(DISHES)) {
      dishes[n] = this.level >= d.unlock ? { ...d, unlocked: true } : { unlock: d.unlock, unlocked: false };
    }
    const maxed = this.level >= MAX_LEVEL;
    return {
      rev: this._rev,
      owner: this.owner, stars: this.stars, status: this.status, paused: this.paused,
      coins: this.coins,
      rating: this.rating, ratingCap: Math.round(this.ratingCap() * 100) / 100, ratingGoal: RATING.goal,
      level: this.level, maxLevel: MAX_LEVEL,
      xp: maxed ? 1 : this.xp, xpToNext: maxed ? 1 : this.xpToNext(),
      currentPlate: this.currentPlate,
      storage: this.storage, delivery: this.delivery,
      usage: this.usage(), capacity: this.capacity(),
      customers: this.customers,
      tables: this.tables,
      expansion: this.expansion,
      theme: this.theme,
      shop: {
        tableCost: COSTS.table, chairCost: COSTS.chair, maxSeats: COSTS.maxSeats,
        expansionCost: COSTS.expansion[this.expansion] ?? null,
        freeSlots: this.freeSlots().length
      },
      catalog: { ingredients, dishes },
      helpers: this.helperState(),
      reactions: this.reactions,
      notices: this.notices,
      isValidState: this.verifyIntegrity()
    };
  }
}
