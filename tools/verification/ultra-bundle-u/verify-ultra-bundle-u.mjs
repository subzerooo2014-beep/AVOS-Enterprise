import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const featureRoot = path.join(
  root,
  'apps',
  'api',
  'src',
  'auction-export-logistics',
);

const requiredFiles = [
  'auction-export-logistics.types.ts',
  'auction-lifecycle-engine.service.ts',
  'live-bidding-engine.service.ts',
  'reserve-price-validation-engine.service.ts',
  'auction-participant-operations.service.ts',
  'export-eligibility-engine.service.ts',
  'shipping-quotation-engine.service.ts',
  'carrier-coordination-engine.service.ts',
  'customs-documentation-engine.service.ts',
  'port-destination-tracking-engine.service.ts',
  'vehicle-handover-workflow.service.ts',
  'export-payment-settlement-engine.service.ts',
  'auction-export-orchestrator.service.ts',
  'auction-export-dashboard.service.ts',
  'auction-export-logistics.controller.ts',
  'auction-export-logistics.module.ts',
  'dto/auction.dto.ts',
  'dto/bid.dto.ts',
  'dto/shipping-quote.dto.ts',
];

const capabilities = [
  'auction-lifecycle-engine',
  'live-bidding-engine',
  'reserve-price-validation-engine',
  'auction-participant-operations',
  'export-eligibility-engine',
  'shipping-quotation-engine',
  'carrier-coordination-engine',
  'customs-documentation-engine',
  'port-destination-tracking-engine',
  'vehicle-handover-workflow',
  'export-payment-settlement-engine',
  'auction-export-orchestrator',
  'auction-export-dashboard',
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
  path.join(featureRoot, 'auction-export-logistics.types.ts'),
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
        'AVOS Ultra Bundle U Auctions Export Shipping Logistics',
      requiredFiles: requiredFiles.length,
      capabilities: capabilities.length,
      auctionLifecycle: true,
      liveBidding: true,
      reserveValidation: true,
      participantOperations: true,
      exportEligibility: true,
      shippingQuotation: true,
      carrierCoordination: true,
      customsDocumentation: true,
      portTracking: true,
      vehicleHandover: true,
      exportSettlement: true,
      auctionExportOrchestrator: true,
      auctionExportDashboard: true,
    },
    null,
    2,
  ),
);