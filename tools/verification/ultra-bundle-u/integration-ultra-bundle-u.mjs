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
  biddingM,
  reserveM,
  shippingM,
  customsM,
  trackingM,
  handoverM,
  settlementM,
  orchestratorM,
  dashboardM,
] = await Promise.all([
  load('live-bidding-engine.service.js'),
  load('reserve-price-validation-engine.service.js'),
  load('shipping-quotation-engine.service.js'),
  load('customs-documentation-engine.service.js'),
  load('port-destination-tracking-engine.service.js'),
  load('vehicle-handover-workflow.service.js'),
  load('export-payment-settlement-engine.service.js'),
  load('auction-export-orchestrator.service.js'),
  load('auction-export-dashboard.service.js'),
]);

const bidding = new biddingM.LiveBiddingEngineService();
const reserve = new reserveM.ReservePriceValidationEngineService();
const shipping = new shippingM.ShippingQuotationEngineService();
const customs = new customsM.CustomsDocumentationEngineService();
const tracking = new trackingM.PortDestinationTrackingEngineService();
const handover = new handoverM.VehicleHandoverWorkflowService();
const settlement =
  new settlementM.ExportPaymentSettlementEngineService();

const orchestrator =
  new orchestratorM.AuctionExportOrchestratorService(
    bidding,
    reserve,
    shipping,
    customs,
    tracking,
    handover,
    settlement,
  );

const auction = {
  id: 'auction-u-1',
  listingId: 'listing-u-1',
  sellerId: 'seller-u-1',
  startPrice: 200000,
  reservePrice: 220000,
  currency: 'AED',
  startsAt: new Date(Date.now() - 7200000).toISOString(),
  endsAt: new Date(Date.now() - 3600000).toISOString(),
  status: 'ended',
};

const result = orchestrator.run({
  auction,
  bids: [
    {
      id: 'bid-u-1',
      auctionId: auction.id,
      bidderId: 'buyer-u-1',
      amount: 230000,
      currency: 'AED',
      placedAt: new Date().toISOString(),
      valid: true,
    },
  ],
  shippingQuotes: [
    {
      id: 'ship-u-1',
      carrierId: 'carrier-u-1',
      listingId: auction.listingId,
      originPort: 'Jebel Ali',
      destinationPort: 'Jeddah',
      mode: 'roro',
      freightAmount: 5000,
      insuranceAmount: 800,
      handlingAmount: 700,
      currency: 'AED',
      transitDays: 5,
    },
  ],
  documents: [
    {
      id: 'doc-u-1',
      listingId: auction.listingId,
      type: 'export-certificate',
      number: 'EXP-001',
      issuedAt: new Date().toISOString(),
      verified: true,
    },
  ],
  trackingEvents: [
    {
      id: 'track-u-1',
      shipmentId: 'shipment-u-1',
      status: 'received-at-port',
      location: 'Jebel Ali',
      occurredAt: new Date().toISOString(),
    },
  ],
  handover: {
    id: 'handover-u-1',
    listingId: auction.listingId,
    sellerId: auction.sellerId,
    carrierId: 'carrier-u-1',
    handedOverAt: new Date().toISOString(),
    conditionAccepted: true,
    documentsAccepted: true,
  },
  customsAmount: 1500,
});

if (!result.approved || !result.settlement) {
  throw new Error('Auction export integration failed');
}

const dashboard = new dashboardM.AuctionExportDashboardService();
const snapshot = dashboard.snapshot({
  liveAuctions: 0,
  validBids: result.bidding.bidCount,
  exportEligibleVehicles: 1,
  activeShipments: 1,
  settlementRate: 100,
});

if (Object.keys(snapshot.capabilityStatus).length !== 13) {
  throw new Error('Auction export capability count mismatch');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Ultra Bundle U compiled integration test',
      approved: result.approved,
      highestBid: result.bidding.highestBid.amount,
      shippingTotal: result.shipping[0].totalAmount,
      settlementTotal: result.settlement.totalPayable,
      capabilityCount: Object.keys(snapshot.capabilityStatus).length,
    },
    null,
    2,
  ),
);