import { esc } from '../net.js';

// Panel HTML de la cocina: menú (se desbloquea por nivel), ingredientes, entregas, nevera y caja.
export class KitchenUI {
  constructor(root, handlers) {
    this.root = root; this.h = handlers; this.sig = '';
    root.addEventListener('click', (e) => {
      const b = e.target.closest('[data-act]');
      if (!b || b.disabled) return;
      this.h[b.dataset.act]?.(b.dataset.name);
    });
  }

  render(s) {
    const sig = JSON.stringify([s.level, s.currentPlate, s.storage, s.delivery]);
    if (sig === this.sig) return; // no reconstruir si nada cambió (evita perder clics)
    this.sig = sig;
    const scroll = [...this.root.querySelectorAll('.kpanel')].map(p => p.scrollTop);

    const ING = s.catalog.ingredients, DISH = s.catalog.dishes;
    const qty = (n) => s.storage[n] || 0;

    // menú: platos desbloqueados (el más nuevo arriba) + el siguiente bloqueado
    const dishes = Object.entries(DISH);
    const nextLock = dishes.find(([, d]) => !d.unlocked);
    const menu = dishes.filter(([, d]) => d.unlocked).reverse()
      .map(([n, d]) => `<div class="kitem">${d.icon} <b>${esc(n)}</b> <span class="muted">¥${d.price}</span><div class="muted small">${d.ing.map(esc).join(' + ')}</div></div>`).join('')
      + (nextLock ? `<div class="kitem muted">🔒 ??? <span class="small">(Nivel ${nextLock[1].unlock})</span></div>` : '');

    // ingredientes: desbloqueados + el siguiente bloqueado
    const ings = Object.entries(ING);
    const firstLocked = ings.findIndex(([, i]) => !i.unlocked);
    const ingBtns = ings.filter(([, i], k) => i.unlocked || k === firstLocked).map(([n, i]) => i.unlocked
      ? `<button class="kbtn" data-act="add" data-name="${esc(n)}" ${qty(n) <= 0 ? 'disabled' : ''}>${i.icon} ${esc(n)} <b>${qty(n)}</b></button>`
      : `<button class="kbtn" disabled>🔒 Nv.${i.unlock}</button>`).join('');

    const deliveries = Object.entries(s.delivery).map(([n, q]) => `
      <div class="kitem">${ING[n].icon} ${esc(n)} x${q}
        <button class="kbtn" data-act="storeFridge" data-name="${esc(n)}">❄ Nevera</button>
        <button class="kbtn" data-act="storeBox" data-name="${esc(n)}">📦 Caja</button>
      </div>`).join('') || '<div class="muted small">Sin entregas (compra en el ordenador del salón)</div>';

    const list = (fridge) => Object.entries(s.storage)
      .filter(([n, q]) => q > 0 && ING[n].fridge === fridge)
      .map(([n, q]) => `<span class="chip">${ING[n].icon} ${esc(n)} x${q}</span>`).join('') || '<span class="muted small">vacío</span>';

    this.root.innerHTML = `
      <div class="kgrid">
        <div class="kpanel"><h3>📜 Menú</h3>${menu}</div>
        <div class="kpanel"><h3>🥢 Ingredientes</h3>
          <div class="kwrap">${ingBtns}</div>
          <div class="kitem" style="margin-top:6px">Plato: <b>${s.currentPlate.map(esc).join(' + ') || '(vacío)'}</b></div>
          <button class="kbtn" data-act="clear">🗑 Vaciar plato</button>
        </div>
        <div class="kpanel"><h3>📥 Entregas</h3>${deliveries}
          <h3 style="margin-top:6px">❄ Nevera ${s.usage.fridge}/${s.capacity.fridge}</h3><div class="kwrap">${list(true)}</div>
          <h3 style="margin-top:6px">📦 Caja ${s.usage.box}/${s.capacity.box}</h3><div class="kwrap">${list(false)}</div>
        </div>
      </div>`;
    this.root.querySelectorAll('.kpanel').forEach((p, i) => { p.scrollTop = scroll[i] || 0; });
  }
}
