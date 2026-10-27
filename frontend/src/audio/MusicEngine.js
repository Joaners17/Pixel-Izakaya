// Música de fondo: lista aleatoria en bucle. Empieza con el primer clic/tecla (regla de los navegadores).
export class MusicEngine {
  constructor(files) {
    this.files = files; this.order = []; this.idx = 0; this.started = false; this.fails = 0;
    let muted = false;
    try { muted = localStorage.getItem('izk_muted') === '1'; } catch { /* sin storage */ }
    this.muted = muted;
    this.audio = new Audio();
    this.audio.volume = 0.6; // el doble que antes
    this.audio.muted = muted;
    this.audio.addEventListener('ended', () => this.next());
    this.audio.addEventListener('error', () => { if (++this.fails < this.files.length) this.next(); });
  }
  start() {
    if (this.started) return;
    this.started = true;
    this.order = [...this.files].sort(() => Math.random() - 0.5);
    this.idx = 0;
    this.load();
  }
  load() { this.audio.src = this.order[this.idx]; this.audio.play().catch(() => {}); }
  next() { this.idx = (this.idx + 1) % this.order.length; this.load(); }
  toggle() {
    this.muted = !this.muted;
    this.audio.muted = this.muted;
    try { localStorage.setItem('izk_muted', this.muted ? '1' : '0'); } catch { /* sin storage */ }
    return this.muted;
  }
}
