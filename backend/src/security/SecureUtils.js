export class SecureUtils {
  static lastActionTimes = new Map();

  static sanitizeHTML(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .replace(/javascript:/gi, "")
      .replace(/onerror/gi, "")
      .replace(/onload/gi, "");
  }

  static computeChecksum(stateObj) {
    const payload = `${stateObj.coins}:${stateObj.reputation}`;
    let hash = 0;
    for (let i = 0; i < payload.length; i++) {
      hash = ((hash << 5) - hash) + payload.charCodeAt(i);
      hash |= 0;
    }
    return "SIG_" + Math.abs(hash).toString(16);
  }

  static checkRateLimit(clientId, actionId, cooldownMs = 250) {
    const key = `${clientId}:${actionId}`;
    const now = Date.now();
    const last = this.lastActionTimes.get(key) || 0;
    if (now - last < cooldownMs) return false;
    this.lastActionTimes.set(key, now);
    return true;
  }
}