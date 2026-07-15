import { Injectable } from '@nestjs/common';
import {
  Auction,
  AuctionBid,
} from './auction-export-logistics.types';

@Injectable()
export class ReservePriceValidationEngineService {
  validate(auction: Auction, highestBid: AuctionBid | null) {
    const reserveMet =
      Boolean(highestBid) &&
      (highestBid?.amount ?? 0) >= auction.reservePrice;

    return {
      auctionId: auction.id,
      reservePrice: auction.reservePrice,
      highestBid: highestBid?.amount ?? 0,
      reserveMet,
      settlementAllowed:
        auction.status === 'ended' && reserveMet,
    };
  }
}