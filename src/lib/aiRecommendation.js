const money = (value) => Number(value.toFixed(2));

export function buildAiRecommendations({ confirmedProductIds, pharmacies, pharmacyOffers, products }) {
  return pharmacies
    .map((pharmacy) => {
      const items = confirmedProductIds
        .map((productId) => {
          const offer = pharmacyOffers.find((item) => item.pharmacyId === pharmacy.id && item.productId === productId);
          const product = products.find((item) => item.id === productId);
          return offer && product ? { ...product, pharmacyId: pharmacy.id, price: offer.price } : null;
        })
        .filter(Boolean);

      if (items.length !== confirmedProductIds.length) return null;

      const subtotal = money(items.reduce((sum, item) => sum + item.price, 0));
      const delivery = money(pharmacy.deliveryFee);

      return {
        pharmacy,
        items,
        subtotal,
        delivery,
        total: money(subtotal + delivery),
      };
    })
    .filter(Boolean)
    .sort((first, second) => first.total - second.total);
}

export function getRecommendedPharmacyOffer(input) {
  return buildAiRecommendations(input)[0] ?? null;
}
