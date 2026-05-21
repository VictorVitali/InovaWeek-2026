import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

const appSource = readFileSync('src/App.jsx', 'utf8');
const stylesSource = readFileSync('src/styles.css', 'utf8');

test('header brand uses only the logo image', () => {
  expect(appSource).not.toContain('<span>Farmácia Expressa</span>');
});

test('header logo is sized as a full wordmark', () => {
  expect(stylesSource).toContain('width: 12rem;');
  expect(stylesSource).toContain('height: 3.5rem;');
});
