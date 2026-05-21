import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

const appSource = readFileSync('src/App.jsx', 'utf8');
const stylesSource = readFileSync('src/styles.css', 'utf8');

test('header entry button navigates to the account page', () => {
  expect(appSource).toContain("onNavigate('account')");
  expect(appSource).toContain("page === 'account'");
});

test('account page supports login and registration modes', () => {
  expect(appSource).toContain('function AccountPage');
  expect(appSource).toContain("authMode === 'login'");
  expect(appSource).toContain("setAuthMode('register')");
  expect(appSource).toContain("setAuthMode('login')");
  expect(appSource).toContain('Criar conta');
});

test('successful account submit returns to the home page without inline success message', () => {
  expect(appSource).toContain("setPage('home')");
  expect(appSource).not.toContain('auth-success');
  expect(appSource).not.toContain('Seu acesso foi simulado com sucesso');
});

test('account page has dedicated styles', () => {
  expect(stylesSource).toContain('.account-page');
  expect(stylesSource).toContain('.auth-card');
  expect(stylesSource).toContain('.auth-tabs');
});
