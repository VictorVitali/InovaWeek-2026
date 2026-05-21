import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

const appSource = readFileSync('src/App.jsx', 'utf8');
const stylesSource = readFileSync('src/styles.css', 'utf8');

test('header exposes the AI assistant page', () => {
  expect(appSource).toContain("{ page: 'ai', label: 'IA da Receita' }");
  expect(appSource).toContain("page === 'ai'");
});

test('AI assistant page presents upload, confirmation, and recommendation steps', () => {
  expect(appSource).toContain('function AiAssistantPage');
  expect(appSource).toContain('Selecionar imagem');
  expect(appSource).toContain('Confirmar lista');
  expect(appSource).toContain('Selecione uma imagem para a IA identificar os produtos');
  expect(appSource).toContain('photoLoaded ? detectedProducts : []');
  expect(appSource).toContain('Melhor compra em uma farmácia');
  expect(appSource).toContain('Adicionar recomendação ao carrinho');
});

test('AI assistant page has dedicated presentation styles', () => {
  expect(stylesSource).toContain('.ai-page');
  expect(stylesSource).toContain('.ai-upload-panel');
  expect(stylesSource).toContain('.ai-recommendation-card');
});
