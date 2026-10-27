import { esc } from '../net.js';

function shownIngs(s) {
  const e = Object.entries(s.catalog.ingredients);
  const f = e.findIndex(([, i]) => !i.unlocked);
  return e.filter(([, i], k) => i.unlocked || k === f);
}

const OPTIONS = {
  floor:   { label: 'Piso',       vals: ['tatami', 'madera', 'piedra'] },
  table:   { label: 'Mesas',      vals: ['madera', 'laca', 'negro'] },
  lantern: { label: 'Farolillos', vals: ['rojo', 'azul', 'verde'] }
};

// Modal del ordenador: tienda (mesas/sillas/expansión), ingredientes y personalización.
export class ComputerUI {
  constructor(root, h) {
    this.root = root; this.h = h; this.isOpen = false; this.tab = 'tienda'; this.sig = ''; this.state = null;
    root.addEventListener('click', (e) => {
      if (e.target === root) return this.close();
      const b = e.target.closest('[data-act]');
      if (!b || b.disabled) return;
      const d = b.dataset;
      if (d.act === 'close') this.close();
      else if (d.act === 'tab') { this.tab = d.name; this.sig = ''; this.render(this.state); }
      else if (d.act === 'buyTable') h.buyTable();
      else if (d.act === 'buyChair') h.buyChair(Number(d.id));
      else if (d.act === 'expand') h.expand();
      else if (d.act === 'buyIng') h.buyIng(d.name, Number(d.qty));
      else if (d.act === 'theme') h.theme(d.key, d.val);
      else if (d.act === 'hire') h.hire(d.key);
    });
  }

  open(s) { this.isOpen = true; this.root.classList.remove('hidden'); this.root.classList.add('flex'); this.sig = ''; this.render(s); }
  close() { this.isOpen = false; this.root.classList.add('hidden'); this.root.classList.remove('flex'); }

  render(s) {
    this.state = s;
    if (!this.isOpen || !s) return;
    const sig = JSON.stringify([this.tab, s.coins, s.level, s.expansion, s.theme, s.delivery, s.storage, s.tables.map(t => t.seats.length), Object.values(s.helpers).map(h => [h.hired, h.resting, h.unlocked])]);
    if (sig === this.sig) return;
    this.sig = sig;

    const tabBtn = (id, label) => `<button class="kbtn ${this.tab === id ? 'active' : ''}" data-act="tab" data-name="${id}">${label}</button>`;
    let body = '';

    if (this.tab === 'tienda') {
      const sh = s.shop;
      body = `
        <div class="kitem"><b>Mesas (${s.tables.length})</b> · espacios libres: ${sh.freeSlots}
          <button class="kbtn" data-act="buyTable" ${s.coins < sh.tableCost || !sh.freeSlots ? 'disabled' : ''}>Comprar mesa ¥${sh.tableCost}</button></div>
        ${s.tables.map((t, i) => `<div class="kitem">Mesa ${i + 1}: ${t.seats.length}/${sh.maxSeats} sillas
          <button class="kbtn" data-act="buyChair" data-id="${t.id}" ${t.seats.length >= sh.maxSeats || s.coins < sh.chairCost ? 'disabled' : ''}>+ Silla ¥${sh.chairCost}</button></div>`).join('')}
        <div class="kitem" style="margin-top:8px"><b>Local:</b> ampliación ${s.expansion}/2
          ${sh.expansionCost === null ? '<span class="muted">(máximo)</span>'
            : `<button class="kbtn" data-act="expand" ${s.coins < sh.expansionCost ? 'disabled' : ''}>Expandir ¥${sh.expansionCost}</button>`}</div>`;
    } else if (this.tab === 'ayudantes') {
      body = Object.entries(s.helpers).map(([key, h]) => {
        let status;
        if (h.hired) status = h.resting ? `😴 Descansando (vuelve en el nivel ${h.backAtLevel})` : '✔ Trabajando';
        else if (!h.unlocked) status = `🔒 Se desbloquea en el nivel ${h.unlock}`;
        else status = `<button class="kbtn" data-act="hire" data-key="${key}" ${s.coins < h.cost ? 'disabled' : ''}>Contratar ¥${h.cost}</button>`;
        return `<div class="kitem" style="margin-bottom:8px">${h.icon} <b>${esc(h.name)}</b> — ${status}
          <div class="muted small">${esc(h.desc)} ${h.keepOnStar ? 'Se queda al ganar una estrella.' : 'Se pierde al ganar una estrella.'}</div></div>`;
      }).join('');
    } else if (this.tab === 'ingredientes') {
      body = shownIngs(s).map(([n, i]) => i.unlocked
        ? `<div class="kitem">${i.icon} <b>${esc(n)}</b> ${i.fridge ? '❄' : '📦'} · almacén: ${s.storage[n] || 0} · en entrega: ${s.delivery[n] || 0} · ¥${i.price}
            ${[1, 5, 10].map(q => `<button class="kbtn" data-act="buyIng" data-name="${esc(n)}" data-qty="${q}" ${s.coins < i.price * q ? 'disabled' : ''}>+${q}</button>`).join('')}</div>`
        : `<div class="kitem muted">🔒 ${esc(n)} — se desbloquea en el nivel ${i.unlock}</div>`).join('')
        + '<div class="muted small" style="margin-top:6px">Las compras llegan a la cocina: guárdalas en la nevera (❄) o la caja (📦).</div>';
    } else {
      body = Object.entries(OPTIONS).map(([key, o]) => `<div class="kitem"><b>${o.label}:</b>
        ${o.vals.map(v => `<button class="kbtn ${s.theme[key] === v ? 'active' : ''}" data-act="theme" data-key="${key}" data-val="${v}">${v}</button>`).join('')}</div>`).join('');
    }

    this.root.innerHTML = `
      <div class="pcwin">
        <div class="pchead"><span>💻 Ordenador del local</span><span>Fondos: ¥${s.coins}</span></div>
        <div class="pctabs">${tabBtn('tienda', '🪑 Tienda')}${tabBtn('ingredientes', '🥢 Ingredientes')}${tabBtn('ayudantes', '👥 Ayudantes')}${tabBtn('personalizar', '🎨 Personalizar')}
          <button class="kbtn" data-act="close" style="margin-left:auto">✖ Cerrar (Esc)</button></div>
        <div class="pcbody">${body}</div>
      </div>`;
  }
}
