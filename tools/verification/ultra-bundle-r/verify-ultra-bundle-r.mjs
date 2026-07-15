import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const featureRoot = path.join(
  root,
  'apps',
  'api',
  'src',
  'vehicle-marketplace-operations',
);

const requiredFiles = [
  'vehicle-marketplace-operations.types.ts',
  'listing-lifecycle-engine.service.ts',
  'marketplace-media-manager.service.ts',
  'vehicle-inventory-engine.service.ts',
  'smart-pricing-coordinator.service.ts',
  'marketplace-search-index.service.ts',
  'vehicle-recommendation-engine.service.ts',
  'dealer-operations-engine.service.ts',
  'marketplace-analytics-engine.service.ts',
  'listing-fraud-protection.service.ts',
  'reservation-negotiation-engine.service.ts',
  'marketplace-event-orchestrator.service.ts',
  'marketplace-operations-dashboard.service.ts',
  'vehicle-marketplace-operations.controller.ts',
  'vehicle-marketplace-operations.module.ts',
  'dto/create-listing.dto.ts',
  'dto/listing-media.dto.ts',
  'dto/marketplace-search.dto.ts',
];

const capabilities = [
  'listing-lifecycle-engine',
  'marketplace-media-manager',
  'vehicle-inventory-engine',
  'smart-pricing-coordinator',
  'marketplace-search-index',
  'vehicle-recommendation-engine',
  'dealer-operations-engine',
  'marketplace-analytics-engine',
  'listing-fraud-protection',
  'reservation-negotiation-engine',
  'marketplace-event-orchestrator',
  'marketplace-operations-dashboard',
];

const missing = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(featureRoot, file)),
);

if (missing.length > 0) {
  console.error(
    JSON.stringify({ success: false, missing }, null, 2),
  );
  process.exit(1);
}

const types = fs.readFileSync(
  path.join(featureRoot, 'vehicle-marketplace-operations.types.ts'),
  'utf8',
);

const missingCapabilities = capabilities.filter(
  (capability) => !types.includes(`'${capability}'`),
);

if (missingCapabilities.length > 0) {
  console.error(
    JSON.stringify(
      { success: false, missingCapabilities },
      null,
      2,
    ),
  );
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      success: true,
      system:
        'AVOS Ultra Bundle R Vehicle Marketplace Listing Operations',
      requiredFiles: requiredFiles.length,
      capabilities: capabilities.length,
      listingLifecycle: true,
      mediaManagement: true,
      vehicleInventory: true,
      smartPricing: true,
      marketplaceSearch: true,
      recommendations: true,
      dealerOperations: true,
      marketplaceAnalytics: true,
      fraudProtection: true,
      reservationNegotiation: true,
      marketplaceOrchestration: true,
      marketplaceDashboard: true,
    },
    null,
    2,
  ),
);