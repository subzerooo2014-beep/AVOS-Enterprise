import { Injectable } from '@nestjs/common';
import {
  Auction,
  AuctionBid,
} from './auction-export-logistics.types';

@Injectable()
export class LiveBiddingEngineService {
  evaluate(auction: Auction, bids: AuctionBid[]) {
    const validBids = bids
      .filter(
        (bid) =>
          bid.auctionId === auction.id &&
          bid.currency === auction.currency &&
          bid.amount >= auction.startPrice,
      )
      .map((bid) => ({ ...bid, valid: true }))
      .sort((a, b) => b.amount - a.amount);

    return {
      auctionId: auction.id,
      validBids,
      highestBid: validBids[0] ?? null,
      bidCount: validBids.length,
    };
  }
}