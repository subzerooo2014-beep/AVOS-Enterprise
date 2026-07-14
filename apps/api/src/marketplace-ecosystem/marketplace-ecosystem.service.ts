import { Injectable } from "@nestjs/common";
import { EntityService } from "./services/entity.service";
import { ListingService } from "./services/listing.service";
import { MembershipService } from "./services/membership.service";
import { CommissionService } from "./services/commission.service";
import { ReviewService } from "./services/review.service";
import { ServiceBookingService } from "./services/service-booking.service";
import { MarketplaceOrderService } from "./services/order.service";
import { WorkshopJobService } from "./services/workshop-job.service";
import { DealershipLeadService } from "./services/dealership-lead.service";
import { MarketplaceSearchService } from "./services/marketplace-search.service";

@Injectable()
export class MarketplaceEcosystemService {
  constructor(
    readonly entities: EntityService,
    readonly listings: ListingService,
    readonly memberships: MembershipService,
    readonly commissions: CommissionService,
    readonly reviews: ReviewService,
    readonly bookings: ServiceBookingService,
    readonly orders: MarketplaceOrderService,
    readonly workshopJobs: WorkshopJobService,
    readonly dealershipLeads: DealershipLeadService,
    readonly search: MarketplaceSearchService,
  ) {}
}
