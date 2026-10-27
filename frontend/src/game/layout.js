export const W = 750, H = 320;
export const TABLE_W = 56, TABLE_H = 44;
export const WALL_H = 80;
export const PC = { x: 24, y: 20, w: 64, h: 48 };
export const REGION_W = [480, 620, 750]; // ancho jugable según expansión
const SEAT_OFFSETS = [[-22, 13], [60, 13], [19, -22], [19, 46]];

export function seatPos(t, i) {
  const o = SEAT_OFFSETS[i];
  return { x: t.x + o[0], y: t.y + o[1] };
}

export function hashColor(id) {
  return ['#ef4444', '#3b82f6', '#a855f7', '#10b981', '#f97316', '#ec4899'][id % 6];
}

// Qué se puede hacer con la tecla E desde donde está el jugador
export function findTarget(state, p) {
  const px = p.x + p.w / 2, py = p.y + p.h / 2;
  let best = null, bd = Infinity;
  const pcd = Math.hypot(px - (PC.x + PC.w / 2), py - (PC.y + PC.h / 2));
  if (pcd <= 80) { best = { type: 'pc' }; bd = pcd; }
  for (const t of state.tables) {
    const d = Math.hypot(px - (t.x + TABLE_W / 2), py - (t.y + TABLE_H / 2));
    if (d > 70 || d >= bd) continue;
    const dirtySeat = t.seats.some(s => s.dirty && s.customerId === null);
    const action = t.money > 0 ? 'collect' : (t.dirty || dirtySeat) ? 'clean' : null;
    if (action) { best = { type: 'table', table: t, action }; bd = d; }
  }
  return best;
}
