import { expect, test } from 'vitest';
import config from './vite.config.js';

test('uses relative asset paths so the built app can load from any folder', () => {
  expect(config.base).toBe('./');
});
