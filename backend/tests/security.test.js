import test from 'node:test';
import assert from 'node:assert';
import { SecureUtils } from '../src/security/SecureUtils.js';

test('Sanitización XSS', () => {
  const malicious = '<script>alert("hack")</script>Hola';
  const clean = SecureUtils.sanitizeHTML(malicious);
  assert.strictEqual(clean, '&lt;script&gt;alert(&quot;hack&quot;)&lt;/script&gt;Hola');
});

test('Checksum Anti-Cheat', () => {
  const state = { coins: 1000, reputation: 50 };
  const hash1 = SecureUtils.computeChecksum(state);
  const hash2 = SecureUtils.computeChecksum(state);
  assert.strictEqual(hash1, hash2);
});