import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');

test('public logo uses the full logo asset', () => {
  expect(sha256('public/logo.jpeg')).toBe(sha256('public/logoFull.jpeg'));
});
