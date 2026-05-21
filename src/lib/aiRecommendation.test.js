import { describe, expect, test } from 'vitest';
import { pharmacies, pharmacyOffers, products } from '../data/mockData';
import { buildAiRecommendations, getRecommendedPharmacyOffer } from './aiRecommendation';

describe('AI product recommendation', () => {
  test('returns only pharmacies that can fulfill every confirmed product', () => {
    const confirmedProductIds = ['dipirona-500', 'loratadina-10', 'vitamina-c'];
    const recommendations = buildAiRecommendations({ confirmedProductIds, pharmacies, pharmacyOffers, products });

    expect(recommendations.every((recommendation) => recommendation.items.length === confirmedProductIds.length)).toBe(true);
    expect(recommendations.map((recommendation) => recommendation.pharmacy.id)).toEqual(['bem-estar', 'vida-rapida']);
  });

  test('selects the cheapest single pharmacy including delivery', () => {
    const confirmedProductIds = ['dipirona-500', 'loratadina-10', 'vitamina-c'];
    const recommended = getRecommendedPharmacyOffer({ confirmedProductIds, pharmacies, pharmacyOffers, products });

    expect(recommended.pharmacy.id).toBe('bem-estar');
    expect(recommended.subtotal).toBe(46.5);
    expect(recommended.delivery).toBe(5.5);
    expect(recommended.total).toBe(52);
  });
});
