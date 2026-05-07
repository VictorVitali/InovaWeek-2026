import { describe, expect, it } from 'vitest';
import { getProductsForCategory } from './catalog';

const products = [
  { id: 'dipirona', category: 'medicamentos' },
  { id: 'protetor', category: 'cuidados' },
  { id: 'vitamina', category: 'saude' },
];

describe('catalog category selection', () => {
  it('keeps offer tabs in the catalog product model instead of behaving like the home screen', () => {
    expect(getProductsForCategory(products, 'ofertas')).toEqual(products);
  });

  it('filters regular category tabs consistently', () => {
    expect(getProductsForCategory(products, 'cuidados')).toEqual([{ id: 'protetor', category: 'cuidados' }]);
  });
});
