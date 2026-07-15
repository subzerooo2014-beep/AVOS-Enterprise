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
  catalogM,
  providersM,
  bookingsM,
  capacityM,
  quotesM,
  performanceM,
  slaM,
  journeyM,
  orchestratorM,
  dashboardM,
] = await Promise.all([
  load('service-catalog-engine.service.js'),
  load('workshop-provider-profile-engine.service.js'),
  load('service-booking-engine.service.js'),
  load('capacity-scheduling-engine.service.js'),
  load('service-pricing-quotation-engine.service.js'),
  load('provider-performance-engine.service.js'),
  load('service-quality-sla-engine.service.js'),
  load('customer-service-journey-engine.service.js'),
  load('service-fulfillment-orchestrator.service.js'),
  load('service-marketplace-dashboard.service.js'),
]);

const catalog = new catalogM.ServiceCatalogEngineService();
const providers = new providersM.WorkshopProviderProfileEngineService();
const bookings = new bookingsM.ServiceBookingEngineService();
const capacity = new capacityM.CapacitySchedulingEngineService();
const performance = new performanceM.ProviderPerformanceEngineService();
const sla = new slaM.ServiceQualitySlaEngineService();
const journey = new journeyM.CustomerServiceJourneyEngineService();

catalog.register({
  id: 'service-t-1',
  providerId: 'provider-t-1',
  category: 'inspection',
  name: 'Comprehensive Inspection',
  description: 'Full vehicle inspection',
  basePrice: 750,
  currency: 'AED',
  durationMinutes: 120,
  active: true,
});

const rankedProviders = providers.rank([
  {
    id: 'provider-t-1',
    name: 'AVOS Inspection Center',
    type: 'inspection-center',
    city: 'dubai',
    region: 'uae',
    rating: 4.8,
    verified: true,
    capabilities: ['inspection', 'diagnostics'],
  },
]);

const booking = bookings.transition(
  bookings.create({
    id: 'booking-t-1',
    customerId: 'customer-t-1',
    providerId: 'provider-t-1',
    serviceId: 'service-t-1',
    vehicleId: 'vehicle-t-1',
    scheduledAt: new Date().toISOString(),
    status: 'requested',
  }).id,
  'confirmed',
);

const orchestrator =
  new orchestratorM.ServiceFulfillmentOrchestratorService(
    capacity,
    performance,
    sla,
    journey,
  );

const result = orchestrator.run({
  booking,
  slots: [
    {
      id: 'slot-1',
      providerId: 'provider-t-1',
      startAt: new Date().toISOString(),
      endAt: new Date(Date.now() + 7200000).toISOString(),
      capacity: 4,
      booked: 2,
    },
  ],
  metrics: [
    {
      providerId: 'provider-t-1',
      completedJobs: 100,
      cancelledJobs: 3,
      averageRating: 4.8,
      onTimeRate: 95,
      slaCompliance: 96,
    },
  ],
  promisedMinutes: 120,
  actualMinutes: 110,
  qualityScore: 94,
});

if (!result.ready) {
  throw new Error('Service fulfillment integration failed');
}

const dashboard =
  new dashboardM.ServiceMarketplaceDashboardService();

const snapshot = dashboard.snapshot({
  activeServices: catalog.list().length,
  verifiedProviders: rankedProviders.filter(
    (provider) => provider.verified,
  ).length,
  confirmedBookings: 1,
  averageSlaCompliance: 96,
  openComplaints: 0,
});

if (Object.keys(snapshot.capabilityStatus).length !== 13) {
  throw new Error('Service marketplace capability count mismatch');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Ultra Bundle T compiled integration test',
      activeServices: snapshot.activeServices,
      verifiedProviders: snapshot.verifiedProviders,
      bookingStatus: booking.status,
      fulfillmentReady: result.ready,
      capabilityCount: Object.keys(snapshot.capabilityStatus).length,
    },
    null,
    2,
  ),
);