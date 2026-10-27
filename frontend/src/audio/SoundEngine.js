export class SoundEngine {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  tone(freq, dur = 0.1, type = 'square', vol = 0.1, delay = 0, slideTo = null) {
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const t = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + dur);
  }
  playClick()   { this.tone(440, 0.1); }
  playCoin()    { this.tone(880, 0.08); this.tone(1320, 0.12, 'square', 0.1, 0.08); }
  playLike()    { [523, 659, 784].forEach((f, i) => this.tone(f, 0.12, 'triangle', 0.12, i * 0.09)); }
  playDislike() { this.tone(220, 0.35, 'sawtooth', 0.1, 0, 110); }
  playLevelUp() { [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.15, 'square', 0.1, i * 0.1)); }
  playWhoosh()  { this.tone(300, 0.5, 'sawtooth', 0.04, 0, 900); }
  playWin()     { [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => this.tone(f, 0.18, 'square', 0.1, i * 0.14)); }
  playLose()    { [392, 349, 311, 262].forEach((f, i) => this.tone(f, 0.35, 'sawtooth', 0.09, i * 0.3, f * 0.9)); }
}
