import test from 'node:test';
import assert from 'node:assert';
import app from './app.js';

test('Vérification de la configuration de l\'application Express', (t) => {
  assert.strictEqual(typeof app, 'function', 'L\'application doit être une fonction de middleware Express');
});
