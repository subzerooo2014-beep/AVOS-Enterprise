import { Injectable } from "@nestjs/common";
@Injectable()
export class AuctionDeliveryService {
  schedule(auctionId: string, location: string, scheduledAt: string) {
    return { id: `delivery_${Date.now()}`, auctionId, location, scheduledAt, status: "SCHEDULED" };
  }
}
