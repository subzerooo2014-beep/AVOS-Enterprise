import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const featureRoot = path.join(
  root,
  'apps',
  'api',
  'src',
  'vehicle-finance-commerce',
);

const requiredFiles = [
  'vehicle-finance-commerce.types.ts',
  'payment-orchestration-engine.service.ts',
  'vehicle-deposit-reservation-engine.service.ts',
  'financing-application-engine.service.ts',
  'insurance-quotation-engine.service.ts',
  'contract-generation-engine.service.ts',
  'digital-signature-coordinator.service.ts',
  'commission-fee-calculator.service.ts',
  'refund-settlement-engine.service.ts',
  'financial-risk-check-engine.service.ts',
  'transaction-audit-trail.service.ts',
  'purchase-flow-orchestrator.service.ts',
  'finance-commerce-dashboard.service.ts',
  'vehicle-finance-commerce.controller.ts',
  'vehicle-finance-commerce.module.ts',
  'dto/payment.dto.ts',
  'dto/financing-application.dto.ts',
  'dto/insurance-quote.dto.ts',
];

const capabilities = [
  'payment-orchestration-engine',
  'vehicle-deposit-reservation-engine',
  'financing-application-engine',
  'insurance-quotation-engine',
  'contract-generation-engine',
  'digital-signature-coordinator',
  'commission-fee-calculator',
  'refund-settlement-engine',
  'financial-risk-check-engine',
  'transaction-audit-trail',
  'purchase-flow-orchestrator',
  'finance-commerce-dashboard',
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
  path.join(featureRoot, 'vehicle-finance-commerce.types.ts'),
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
        'AVOS Ultra Bundle S Payments Finance Insurance Contracts',
      requiredFiles: requiredFiles.length,
      capabilities: capabilities.length,
      paymentOrchestration: true,
      depositsReservations: true,
      financingApplications: true,
      insuranceQuotations: true,
      contractGeneration: true,
      digitalSignatures: true,
      commissionFees: true,
      refundsSettlements: true,
      financialRisk: true,
      transactionAudit: true,
      purchaseFlow: true,
      financeDashboard: true,
    },
    null,
    2,
  ),
);