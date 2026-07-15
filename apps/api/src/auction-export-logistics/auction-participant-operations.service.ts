import { Injectable } from '@nestjs/common';
import { AuctionBid } from './auction-export-logistics.types';

@Injectable()
export class AuctionParticipantOperationsService {
  summarize(bids: AuctionBid[]) {
    const bidders = [...new Set(bids.map((bid) => bid.bidderId))];

    return {
      bidders,
      bidderCount: bidders.length,
      validBidCount: bids.filter((bid) => bid.valid).length,
      activity: bidders.map((bidderId) => ({
        bidderId,
        bids: bids.filter((bid) => bid.bidderId === bidderId).length,
      })),
    };
  }
}