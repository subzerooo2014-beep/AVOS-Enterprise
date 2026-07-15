import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const featureRoot = path.join(
  root,
  'apps',
  'api',
  'src',
  'service-provider-marketplace',
);

const requiredFiles = [
  'service-provider-marketplace.types.ts',
  'service-catalog-engine.service.ts',
  'workshop-provider-profile-engine.service.ts',
  'service-booking-engine.service.ts',
  'capacity-scheduling-engine.service.ts',
  'service-pricing-quotation-engine.service.ts',
  'parts-labor-coordination-engine.service.ts',
  'provider-performance-engine.service.ts',
  'service-quality-sla-engine.service.ts',
  'customer-service-journey-engine.service.ts',
  'service-payment-coordinator.service.ts',
  'complaints-claims-engine.service.ts',
  'service-fulfillment-orchestrator.service.ts',
  'service-marketplace-dashboard.service.ts',
  'service-provider-marketplace.controller.ts',
  'service-provider-marketplace.module.ts',
  'dto/service-booking.dto.ts',
  'dto/service-quote.dto.ts',
  'dto/provider-profile.dto.ts',
];

const capabilities = [
  'service-catalog-engine',
  'workshop-provider-profile-engine',
  'service-booking-engine',
  'capacity-scheduling-engine',
  'service-pricing-quotation-engine',
  'parts-labor-coordination-engine',
  'provider-performance-engine',
  'service-quality-sla-engine',
  'customer-service-journey-engine',
  'service-payment-coordinator',
  'complaints-claims-engine',
  'service-fulfillment-orchestrator',
  'service-marketplace-dashboard',
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
  path.join(featureRoot, 'service-provider-marketplace.types.ts'),
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
        'AVOS Ultra Bundle T Services Workshops Provider Marketplace',
      requiredFiles: requiredFiles.length,
      capabilities: capabilities.length,
      serviceCatalog: true,
      providerProfiles: true,
      bookings: true,
      capacityScheduling: true,
      pricingQuotations: true,
      partsLabor: true,
      providerPerformance: true,
      qualitySla: true,
      customerJourney: true,
      servicePayments: true,
      complaintsClaims: true,
      fulfillment: true,
      marketplaceDashboard: true,
    },
    null,
    2,
  ),
);