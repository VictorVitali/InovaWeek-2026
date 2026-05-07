const money = (value) => Number(value.toFixed(2));

export function addToCart(cart, product, quantity = 1) {
  const safeQuantity = Math.max(1, quantity);
  const current = cart.find((item) => item.id === product.id);

  if (current) {
    return cart.map((item) =>
      item.id === product.id ? { ...item, quantity: item.quantity + safeQuantity } : item,
    );
  }

  return [...cart, { ...product, quantity: safeQuantity }];
}

export function updateCartQuantity(cart, productId, quantity) {
  if (quantity <= 0) {
    return removeFromCart(cart, productId);
  }

  return cart.map((item) => (item.id === productId ? { ...item, quantity } : item));
}

export function removeFromCart(cart, productId) {
  return cart.filter((item) => item.id !== productId);
}

export function getCartSummary(cart, delivery = 0) {
  const subtotal = money(cart.reduce((sum, item) => sum + item.price * item.quantity, 0));
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const normalizedDelivery = money(delivery);

  return {
    subtotal,
    delivery: normalizedDelivery,
    total: money(subtotal + normalizedDelivery),
    itemCount,
  };
}

export function getDeliveryTotal(cart, deliveryFeesByPharmacy) {
  const pharmacyIds = new Set(cart.map((item) => item.pharmacyId).filter(Boolean));
  const total = [...pharmacyIds].reduce((sum, pharmacyId) => sum + (deliveryFeesByPharmacy[pharmacyId] ?? 0), 0);

  return money(total);
}
