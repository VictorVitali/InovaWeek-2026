import { describe, expect, it } from 'vitest';
import { addToCart, getCartSummary, getDeliveryTotal, removeFromCart, updateCartQuantity } from './cart';

const product = {
  id: 'dipirona-500',
  name: 'Dipirona 500mg',
  price: 8.9,
  pharmacyId: 'vida-rapida',
};

describe('cart utilities', () => {
  it('adds a product and increments quantity when added again', () => {
    const firstCart = addToCart([], product, 1);
    const nextCart = addToCart(firstCart, product, 2);

    expect(nextCart).toEqual([
      expect.objectContaining({ id: 'dipirona-500', quantity: 3, price: 8.9 }),
    ]);
  });

  it('updates quantity and removes items when quantity is zero', () => {
    const cart = addToCart([], product, 2);
    const updatedCart = updateCartQuantity(cart, 'dipirona-500', 1);
    const emptyCart = updateCartQuantity(updatedCart, 'dipirona-500', 0);

    expect(updatedCart[0].quantity).toBe(1);
    expect(emptyCart).toEqual([]);
  });

  it('removes a product by id', () => {
    const cart = addToCart([], product, 1);

    expect(removeFromCart(cart, 'dipirona-500')).toEqual([]);
  });

  it('calculates subtotal, delivery and total', () => {
    const cart = addToCart([], product, 2);

    expect(getCartSummary(cart, 4.99)).toEqual({
      subtotal: 17.8,
      delivery: 4.99,
      total: 22.79,
      itemCount: 2,
    });
  });

  it('sums one delivery fee per pharmacy in a mixed cart', () => {
    const cart = [
      { ...product, quantity: 1, pharmacyId: 'vida-rapida' },
      { ...product, id: 'vitamina-c', quantity: 1, pharmacyId: 'bem-estar' },
      { ...product, id: 'loratadina-10', quantity: 1, pharmacyId: 'vida-rapida' },
    ];

    expect(getDeliveryTotal(cart, { 'vida-rapida': 4.99, 'bem-estar': 5.5 })).toBe(10.49);
  });
});
