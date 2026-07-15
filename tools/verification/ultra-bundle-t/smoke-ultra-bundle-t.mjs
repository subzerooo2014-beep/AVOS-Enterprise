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

const bookingsM = await load('service-booking-engine.service.js');
const quotesM = await load('service-pricing-quotation-engine.service.js');
const slaM = await load('service-quality-sla-engine.service.js');

const bookings = new bookingsM.ServiceBookingEngineService();

const booking = bookings.create({
  id: 'booking-1',
  customerId: 'customer-1',
  providerId: 'provider-1',
  serviceId: 'service-1',
  vehicleId: 'vehicle-1',
  scheduledAt: new Date().toISOString(),
  status: 'requested',
});

const confirmed = bookings.transition(booking.id, 'confirmed');

if (confirmed.status !== 'confirmed') {
  throw new Error('Booking smoke test failed');
}

const quotes = new quotesM.ServicePricingQuotationEngineService();
const quote = quotes.calculate({
  id: 'quote-1',
  bookingId: booking.id,
  partsCost: 500,
  laborCost: 300,
  taxAmount: 40,
  discountAmount: 20,
  currency: 'AED',
});

if (quote.totalAmount !== 820) {
  throw new Error('Quotation smoke test failed');
}

const sla = new slaM.ServiceQualitySlaEngineService();
const slaResult = sla.evaluate({
  promisedMinutes: 120,
  actualMinutes: 100,
  qualityScore: 90,
});

if (slaResult.breached) {
  throw new Error('SLA smoke test failed');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Ultra Bundle T compiled smoke test',
      bookingStatus: confirmed.status,
      quoteTotal: quote.totalAmount,
      slaScore: slaResult.complianceScore,
    },
    null,
    2,
  ),
);