import { Injectable } from "@nestjs/common";
import { OrderPolicy } from "../policies/order.policy";
import { ListingRepositoryService } from "./listing-repository.service";
@Injectable()
export class MarketplaceOrderService {
  private readonly records: Array<Record<string, unknown>> = [];
  constructor(
    private readonly policy: OrderPolicy,
    private readonly listings: ListingRepositoryService,
  ) {}
  create(input: { listingId: string; buyerId: string; quantity: number }) {
    const listing = this.listings.get(input.listingId);
    this.policy.validate(input.quantity, listing.stock);
    listing.stock -= input.quantity;
    listing.updatedAt = new Date().toISOString();
    const record = {
      id: `order_${Date.now()}`,
      ...input,
      totalAmount: listing.price * input.quantity,
      status: "CREATED",
    };
    this.records.push(record);
    return record;
  }
  list() { return [...this.records]; }
}
