// Slots de partida guardados en el navegador (localStorage). El servidor los firma, así que no se pueden editar.
const KEY = (n) => `izk_slot_${n}`;

export function readSaves() {
  return [1, 2, 3].map((n) => {
    try {
      const raw = localStorage.getItem(KEY(n));
      if (!raw) return { slot: n, empty: true };
      const save = JSON.parse(raw);
      const d = JSON.parse(save.json);
      return { slot: n, empty: false, owner: String(d.owner || 'Chef'), level: d.level, stars: d.stars || 0, coins: d.coins, rating: d.rating, savedAt: d.savedAt, save };
    } catch { return { slot: n, empty: true }; }
  });
}
export function getSave(n) { const s = readSaves().find(x => x.slot === n); return s && !s.empty ? s.save : null; }
export function writeSave(save) { try { localStorage.setItem(KEY(save.slot), JSON.stringify(save)); return true; } catch { return false; } }
export function deleteSave(n) { try { localStorage.removeItem(KEY(n)); } catch { /* sin storage */ } }
