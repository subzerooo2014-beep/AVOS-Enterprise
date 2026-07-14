import { Injectable } from "@nestjs/common";
import { EntityRepositoryService } from "./entity-repository.service";
import { ListingRepositoryService } from "./listing-repository.service";
import { MarketplaceOrderService } from "./order.service";
import { ServiceBookingService } from "./service-booking.service";
@Injectable()
export class MarketplaceDashboardService {
  constructor(
    private readonly entities: EntityRepositoryService,
    private readonly listings: ListingRepositoryService,
    private readonly orders: MarketplaceOrderService,
    private readonly bookings: ServiceBookingService,
  ) {}
  summary() {
    return {
      entities: this.entities.list().length,
      verifiedEntities: this.entities.list().filter((item) => item.status === "VERIFIED").length,
      listings: this.listings.list().length,
      orders: this.orders.list().length,
      bookings: this.bookings.list().length,
    };
  }
}
