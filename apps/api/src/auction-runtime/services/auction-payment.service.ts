import { Injectable } from "@nestjs/common";
@Injectable()
export class AuctionPaymentService {
  create(auctionId: string, winnerId: string, amount: number) {
    return { id: `payment_${Date.now()}`, auctionId, winnerId, amount, status: "PENDING" };
  }
}
