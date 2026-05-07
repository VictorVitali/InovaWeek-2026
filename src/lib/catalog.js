export function getProductsForCategory(products, categoryId) {
  if (categoryId === 'ofertas') {
    return products;
  }

  return products.filter((product) => product.category === categoryId);
}
