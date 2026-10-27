import crypto from 'node:crypto';
import { GameStateManager, cleanOwnerName } from './GameState.js';

export const MAX_SLOTS = 3;
// Las partidas se guardan en el navegador del jugador, firmadas con HMAC para que no se puedan editar.
// En Render define SAVE_SECRET (render.yaml lo genera solo). Si cambia, las partidas viejas dejan de valer.
const SECRET = process.env.SAVE_SECRET || 'izakaya-dev-secret-change-me';
const sign = (json) => crypto.createHmac('sha256', SECRET).update(json).digest('hex');

// Sesión de UN jugador: su partida activa y el slot en que está
export class SaveManager {
  constructor() { this.slot = null; this.game = null; }

  validSlot(n) { return Number.isInteger(n) && n >= 1 && n <= MAX_SLOTS; }

  // Foto firmada de la partida actual (el cliente la guarda en localStorage)
  pack() {
    if (!this.game || !this.slot) return null;
    const json = JSON.stringify(this.game);
    return { slot: this.slot, json, sig: sign(json) };
  }

  create(n, name) {
    if (!this.validSlot(n)) return { success: false, error: 'Slot inválido' };
    this.game = new GameStateManager(cleanOwnerName(name));
    this.slot = n;
    return { success: true, save: this.pack() };
  }

  load(save) {
    if (!save || typeof save.json !== 'string' || typeof save.sig !== 'string' || save.sig.length !== 64) {
      return { success: false, error: 'Partida guardada inválida' };
    }
    const slot = Number(save.slot);
    if (!this.validSlot(slot)) return { success: false, error: 'Slot inválido' };
    const a = Buffer.from(sign(save.json)), b = Buffer.from(save.sig);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return { success: false, error: 'La partida guardada no es válida (fue modificada o es de otra versión)' };
    }
    let data;
    try { data = JSON.parse(save.json); } catch { return { success: false, error: 'Partida guardada dañada' }; }
    this.game = GameStateManager.fromJSON(data);
    this.slot = slot;
    return { success: true, save: this.pack() };
  }

  exit() {
    if (this.game) this.game.finishRun();   // si terminó (ganó/perdió) queda lista para una nueva vuelta
    const save = this.pack();
    this.game = null;
    this.slot = null;
    return { success: true, save };
  }
}
