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

const [
  lifecycleM,
  mediaM,
  inventoryM,
  pricingM,
  searchM,
  analyticsM,
  fraudM,
  orchestratorM,
  dashboardM,
] = await Promise.all([
  load('listing-lifecycle-engine.service.js'),
  load('marketplace-media-manager.service.js'),
  load('vehicle-inventory-engine.service.js'),
  load('smart-pricing-coordinator.service.js'),
  load('marketplace-search-index.service.js'),
  load('marketplace-analytics-engine.service.js'),
  load('listing-fraud-protection.service.js'),
  load('marketplace-event-orchestrator.service.js'),
  load('marketplace-operations-dashboard.service.js'),
]);

const lifecycle = new lifecycleM.ListingLifecycleEngineService();
const media = new mediaM.MarketplaceMediaManagerService();
const inventory = new inventoryM.VehicleInventoryEngineService();
const pricing = new pricingM.SmartPricingCoordinatorService();
const search = new searchM.MarketplaceSearchIndexService();
const analytics = new analyticsM.MarketplaceAnalyticsEngineService();
const fraud = new fraudM.ListingFraudProtectionService();

const orchestrator =
  new orchestratorM.MarketplaceEventOrchestratorService(
    media,
    inventory,
    pricing,
    search,
    analytics,
    fraud,
  );

const listing = lifecycle.transition(
  lifecycle.create({
    id: 'listing-r-1',
    sellerId: 'seller-r-1',
    dealerId: 'dealer-r-1',
    vehicleId: 'vehicle-r-1',
    title: 'Lexus LX600',
    description: 'Premium SUV',
    price: 520000,
    currency: 'AED',
    region: 'uae',
    city: 'abu-dhabi',
    vin: 'VIN-R-1',
    mileage: 5000,
    year: 2025,
    make: 'Lexus',
    model: 'LX600',
  }).id,
  'published',
);

const result = orchestrator.run({
  listing,
  media: [
    {
      id: 'media-1',
      listingId: listing.id,
      type: 'image',
      url: 'https://example.test/1.jpg',
      order: 0,
      isCover: true,
      checksum: 'hash-1',
    },
  ],
  inventory: [
    {
      id: 'inventory-1',
      listingId: listing.id,
      branchId: 'branch-1',
      quantity: 1,
      state: 'available',
    },
  ],
  pricing: [
    {
      id: 'pricing-1',
      make: listing.make,
      model: listing.model,
      year: listing.year,
      mileage: listing.mileage,
      askingPrice: listing.price,
      marketPrice: 510000,
      confidence: 0.92,
    },
  ],
  searchDocument: {
    id: 'search-1',
    listingId: listing.id,
    text: `${listing.title} ${listing.description}`,
    make: listing.make,
    model: listing.model,
    year: listing.year,
    price: listing.price,
    region: listing.region,
    status: listing.status,
  },
  metrics: [
    {
      listingId: listing.id,
      views: 100,
      inquiries: 12,
      saves: 8,
      reservations: 2,
      conversions: 1,
    },
  ],
});

if (!result.indexed) {
  throw new Error('Listing was not indexed');
}

const searchResult = search.search({
  query: 'lexus',
  region: 'uae',
});

if (searchResult.length !== 1) {
  throw new Error('Marketplace search integration failed');
}

const dashboard =
  new dashboardM.MarketplaceOperationsDashboardService();

const snapshot = dashboard.snapshot({
  publishedListings: 1,
  activeInventory: result.inventory.activeQuantity,
  averagePriceConfidence:
    result.pricing.averageConfidence * 100,
  fraudRisk: result.fraud.riskScore,
  conversionRate: result.analytics.conversionRate,
});

if (Object.keys(snapshot.capabilityStatus).length !== 12) {
  throw new Error('Marketplace capability count mismatch');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Ultra Bundle R compiled integration test',
      listingStatus: listing.status,
      indexed: Boolean(result.indexed),
      searchResults: searchResult.length,
      activeInventory: result.inventory.activeQuantity,
      conversionRate: result.analytics.conversionRate,
      capabilityCount: Object.keys(snapshot.capabilityStatus).length,
    },
    null,
    2,
  ),
);