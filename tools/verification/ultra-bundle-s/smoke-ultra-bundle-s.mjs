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

const paymentsM = await load('payment-orchestration-engine.service.js');
const financingM = await load('financing-application-engine.service.js');
const feesM = await load('commission-fee-calculator.service.js');

const payments = new paymentsM.PaymentOrchestrationEngineService();

const created = payments.create({
  id: 'payment-1',
  orderId: 'order-1',
  buyerId: 'buyer-1',
  sellerId: 'seller-1',
  amount: 250000,
  currency: 'AED',
  method: 'card',
});

const captured = payments.transition(created.id, 'captured');

if (captured.status !== 'captured') {
  throw new Error('Payment smoke test failed');
}

const financing = new financingM.FinancingApplicationEngineService();
const financingResult = financing.evaluate({
  id: 'finance-1',
  buyerId: 'buyer-1',
  listingId: 'listing-1',
  vehiclePrice: 250000,
  downPayment: 50000,
  termMonths: 60,
  monthlyIncome: 30000,
});

if (financingResult.decision === 'reject') {
  throw new Error('Financing smoke test failed');
}

const fees = new feesM.CommissionFeeCalculatorService();
const feeResult = fees.calculate({
  amount: 250000,
  commissionRate: 0.02,
  paymentFeeRate: 0.015,
  fixedFee: 10,
});

if (feeResult.sellerNet <= 0) {
  throw new Error('Fee calculator smoke test failed');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Ultra Bundle S compiled smoke test',
      paymentStatus: captured.status,
      financingDecision: financingResult.decision,
      sellerNet: feeResult.sellerNet,
    },
    null,
    2,
  ),
);