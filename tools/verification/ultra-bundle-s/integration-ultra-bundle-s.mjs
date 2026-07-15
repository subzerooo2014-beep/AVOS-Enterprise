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
  paymentsM,
  financingM,
  insuranceM,
  contractsM,
  signaturesM,
  feesM,
  riskM,
  orchestratorM,
  dashboardM,
] = await Promise.all([
  load('payment-orchestration-engine.service.js'),
  load('financing-application-engine.service.js'),
  load('insurance-quotation-engine.service.js'),
  load('contract-generation-engine.service.js'),
  load('digital-signature-coordinator.service.js'),
  load('commission-fee-calculator.service.js'),
  load('financial-risk-check-engine.service.js'),
  load('purchase-flow-orchestrator.service.js'),
  load('finance-commerce-dashboard.service.js'),
]);

const payments = new paymentsM.PaymentOrchestrationEngineService();
const financing = new financingM.FinancingApplicationEngineService();
const insurance = new insuranceM.InsuranceQuotationEngineService();
const contracts = new contractsM.ContractGenerationEngineService();
const signatures = new signaturesM.DigitalSignatureCoordinatorService();
const fees = new feesM.CommissionFeeCalculatorService();
const risk = new riskM.FinancialRiskCheckEngineService();

const orchestrator =
  new orchestratorM.PurchaseFlowOrchestratorService(
    risk,
    fees,
    contracts,
    insurance,
  );

const payment = payments.transition(
  payments.create({
    id: 'payment-s-1',
    orderId: 'order-s-1',
    buyerId: 'buyer-s-1',
    sellerId: 'seller-s-1',
    amount: 520000,
    currency: 'AED',
    method: 'bank-transfer',
  }).id,
  'captured',
);

const financingResult = financing.evaluate({
  id: 'finance-s-1',
  buyerId: 'buyer-s-1',
  listingId: 'listing-s-1',
  vehiclePrice: 520000,
  downPayment: 220000,
  termMonths: 60,
  monthlyIncome: 45000,
});

const result = orchestrator.run({
  payment,
  financing: financingResult,
  quotes: [
    {
      id: 'quote-1',
      providerId: 'insurer-1',
      listingId: 'listing-s-1',
      buyerId: 'buyer-s-1',
      annualPremium: 8000,
      deductible: 2000,
      coverageScore: 92,
      validUntil: new Date(Date.now() + 86400000).toISOString(),
    },
  ],
  contract: {
    id: 'contract-1',
    orderId: payment.orderId,
    buyerId: payment.buyerId,
    sellerId: payment.sellerId,
    listingId: 'listing-s-1',
    totalAmount: payment.amount,
    currency: payment.currency,
    terms: ['Deposit applied'],
  },
  riskSignals: [
    {
      id: 'risk-1',
      subjectId: payment.buyerId,
      type: 'identity',
      score: 10,
      evidence: ['verified'],
    },
  ],
});

if (!result.approved || !result.contract) {
  throw new Error('Purchase flow integration failed');
}

const signed = signatures.sign(result.contract, [
  {
    signerId: payment.buyerId,
    role: 'buyer',
    signedAt: new Date().toISOString(),
  },
  {
    signerId: payment.sellerId,
    role: 'seller',
    signedAt: new Date().toISOString(),
  },
]);

if (!signed.complete || signed.contract.status !== 'signed') {
  throw new Error('Digital signature integration failed');
}

const dashboard =
  new dashboardM.FinanceCommerceDashboardService();

const snapshot = dashboard.snapshot({
  capturedPayments: 1,
  activeDeposits: 1,
  approvedFinancing:
    financingResult.status === 'approved' ? 1 : 0,
  issuedContracts: 1,
  averageRiskScore: result.risk.score,
});

if (Object.keys(snapshot.capabilityStatus).length !== 12) {
  throw new Error('Finance capability count mismatch');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Ultra Bundle S compiled integration test',
      paymentStatus: payment.status,
      financingDecision: financingResult.decision,
      contractStatus: signed.contract.status,
      insuranceQuotes: result.insurance.length,
      sellerNet: result.fees.sellerNet,
      capabilityCount: Object.keys(snapshot.capabilityStatus).length,
    },
    null,
    2,
  ),
);