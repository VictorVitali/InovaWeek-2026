import { existsSync, readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { products } from './data/mockData.js';

test('all products have local image assets', () => {
  for (const product of products) {
    expect(product.image).toMatch(/^products\/.+\.svg$/);
    expect(existsSync(`public/${product.image}`)).toBe(true);
  }
});

test('product cards render product images instead of the generic pill icon', () => {
  const appSource = readFileSync('src/App.jsx', 'utf8');

  expect(appSource).toContain('<img');
  expect(appSource).toContain('product.image');
  expect(appSource).not.toContain('<Pill size={38} />');
});
