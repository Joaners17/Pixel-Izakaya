const BASE = (window.IZAKAYA_API || '').replace(/\/$/, '') + '/api';

// Cada navegador tiene su propio id: así cada jugador tiene sus 3 slots en el servidor
function makePlayerId() {
  try {
    let id = localStorage.getItem('izk_player');
    if (!id) {
      id = crypto.randomUUID ? crypto.randomUUID()
        : Array.from({ length: 4 }, () => Math.random().toString(16).slice(2, 10).padEnd(8, '0')).join('-');
      localStorage.setItem('izk_player', id);
    }
    return id;
  } catch {
    return 'invitado-' + Math.random().toString(16).slice(2, 12).padEnd(10, '0');
  }
}
const PLAYER = makePlayerId();

export async function api(path, body) {
  try {
    const headers = { 'X-Player': PLAYER };
    const opts = body === undefined
      ? { headers }
      : { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
    return await (await fetch(BASE + path, opts)).json();
  } catch {
    return { success: false, error: 'Sin conexión con el servidor' };
  }
}

export const esc = (t) => String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Despierta al servidor (Render gratis se duerme) apenas abre la página
export function wake() {
  fetch((window.IZAKAYA_API || '').replace(/\/$/, '') + '/health', { mode: 'no-cors' }).catch(() => {});
}
