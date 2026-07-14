import { Injectable } from "@nestjs/common";
@Injectable()
export class AuctionWinnerService {
  select(highestBid?: { bidderId?: string; amount?: number }) {
    return highestBid?.bidderId
      ? { winnerId: highestBid.bidderId, amount: highestBid.amount ?? 0 }
      : { winnerId: undefined, amount: 0 };
  }
}
