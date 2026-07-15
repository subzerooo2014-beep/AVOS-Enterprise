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

const auctionM = await load('auction-lifecycle-engine.service.js');
const biddingM = await load('live-bidding-engine.service.js');
const exportM = await load('export-eligibility-engine.service.js');

const auctions = new auctionM.AuctionLifecycleEngineService();

const auction = auctions.create({
  id: 'auction-1',
  listingId: 'listing-1',
  sellerId: 'seller-1',
  startPrice: 100000,
  reservePrice: 120000,
  currency: 'AED',
  startsAt: new Date().toISOString(),
  endsAt: new Date(Date.now() + 3600000).toISOString(),
  status: 'live',
});

const bidding = new biddingM.LiveBiddingEngineService();
const bidResult = bidding.evaluate(auction, [
  {
    id: 'bid-1',
    auctionId: auction.id,
    bidderId: 'buyer-1',
    amount: 125000,
    currency: 'AED',
    placedAt: new Date().toISOString(),
    valid: true,
  },
]);

if (!bidResult.highestBid) {
  throw new Error('Live bidding smoke test failed');
}

const eligibility = new exportM.ExportEligibilityEngineService();
const exportResult = eligibility.assess({
  listingId: auction.listingId,
  destinationCountry: 'saudi-arabia',
  vehicleAge: 2,
  titleClear: true,
  inspectionPassed: true,
  sanctionsCleared: true,
});

if (!exportResult.eligible) {
  throw new Error('Export eligibility smoke test failed');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Ultra Bundle U compiled smoke test',
      auctionStatus: auction.status,
      highestBid: bidResult.highestBid.amount,
      exportEligible: exportResult.eligible,
    },
    null,
    2,
  ),
);