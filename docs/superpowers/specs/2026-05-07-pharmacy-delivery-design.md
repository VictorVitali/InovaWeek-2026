# Pharmacy Delivery Front-End Design

## Goal

Create a modern responsive front-end for a pharmacy delivery app inspired by the supplied logo and wireframe. The app uses mocked data now and keeps structure ready for future backend integration.

## Visual Direction

Primary color is red. Secondary color is green. The logo suggests medical care plus fast delivery, so the UI should feel clean, fast, trustworthy and commercially direct.

## Screens

- Home with header, search, categories, hero, best sellers and nearby pharmacies.
- Product search/listing with filters, sorting and product cards.
- Product detail with quantity selector, delivery promise and add-to-cart action.
- Cart with editable quantities, subtotal, delivery and total.
- Checkout with address, delivery method, payment method and order summary.

## Architecture

Use React with Vite. Keep app state local for now. Store mock data in `src/data/mockData.js`. Put pure cart calculations in `src/lib/cart.js` for easy testing and future backend replacement.

## Testing

Unit test cart behavior with Vitest: adding products, updating quantities, removing items and calculating totals.
