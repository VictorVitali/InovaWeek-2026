import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');

test('public logo uses the full logo asset', () => {
  expect(sha256('public/logo.jpeg')).toBe(sha256('public/logoFull.jpeg'));
});

test('app uses a transparent PNG logo asset', () => {
  expect(readFileSync('src/App.jsx', 'utf8')).toContain('logo-transparent.png');
});

test('transparent logo is a PNG with alpha transparency', () => {
  const path = 'public/logo-transparent.png';
  expect(existsSync(path)).toBe(true);

  const png = readFileSync(path);
  expect(png.subarray(1, 4).toString('ascii')).toBe('PNG');
  expect(png.includes(Buffer.from('tRNS')) || png[25] === 6 || png[25] === 4).toBe(true);
});

test('transparent logo is cropped close to the visible logo', () => {
  const png = readFileSync('public/logo-transparent.png');
  const width = png.readUInt32BE(16);
  const height = png.readUInt32BE(20);

  expect(width).toBeLessThanOrEqual(1500);
  expect(height).toBeLessThanOrEqual(520);
});
