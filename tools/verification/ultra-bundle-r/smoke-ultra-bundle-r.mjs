import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const distRoot = path.resolve('apps/api/dist');

function findFile(name) {
  const stack = [distRoot];

  while (stack.length > 0) {
    const current = stack.pop();

    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);

      if (entry.isDirectory()) stack.push(full);
      else if (entry.name === name) return full;
    }
  }

  throw new Error(`Compiled file not found: ${name}`);
}

async function load(name) {
  return import(pathToFileURL(findFile(name)));
}

const lifecycleM = await load('listing-lifecycle-engine.service.js');
const pricingM = await load('smart-pricing-coordinator.service.js');
const fraudM = await load('listing-fraud-protection.service.js');

const lifecycle = new lifecycleM.ListingLifecycleEngineService();

const listing = lifecycle.create({
  id: 'listing-1',
  sellerId: 'seller-1',
  vehicleId: 'vehicle-1',
  title: 'Toyota Land Cruiser',
  description: 'Clean vehicle',
  price: 250000,
  currency: 'AED',
  region: 'uae',
  city: 'dubai',
  vin: 'VIN-1',
  mileage: 10000,
  year: 2025,
  make: 'Toyota',
  model: 'Land Cruiser',
});

const published = lifecycle.transition(listing.id, 'published');

if (published.status !== 'published') {
  throw new Error('Listing lifecycle smoke test failed');
}

const pricing = new pricingM.SmartPricingCoordinatorService();
const pricingResult = pricing.analyze([
  {
    id: 'price-1',
    make: 'Toyota',
    model: 'Land Cruiser',
    year: 2025,
    mileage: 10000,
    askingPrice: 250000,
    marketPrice: 245000,
    confidence: 0.9,
  },
]);

if (!pricingResult.signals.length) {
  throw new Error('Smart pricing smoke test failed');
}

const fraud = new fraudM.ListingFraudProtectionService();
const fraudResult = fraud.evaluate(published, []);

if (fraudResult.blocked) {
  throw new Error('Fraud protection smoke test failed');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Ultra Bundle R compiled smoke test',
      listingStatus: published.status,
      pricingRecommendation:
        pricingResult.signals[0].recommendation,
      fraudRisk: fraudResult.riskScore,
    },
    null,
    2,
  ),
);