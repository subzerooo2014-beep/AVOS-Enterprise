import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { BusinessLaunchService } from "./business-launch.service";
import {
  MarketplaceBooking,
  MarketplaceMessage,
  MarketplaceOffer,
  MarketplaceReview,
  VehicleListing,
} from "./business-launch.types";

@Controller("business-launch")
export class BusinessLaunchController {
  constructor(private readonly business: BusinessLaunchService) {}

  @Post("listings")
  createListing(
    @Body()
    input: Omit<VehicleListing, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    return this.business.createListing(input);
  }

  @Patch("listings/:id/publish")
  publishListing(@Param("id") id: string) {
    return this.business.publishListing(id);
  }

  @Get("listings")
  listings(@Query("q") query?: string) {
    return this.business.listListings(query);
  }

  @Post("listings/compare")
  compare(@Body() body: { ids: string[] }) {
    return this.business.compareListings(body.ids);
  }

  @Post("offers")
  createOffer(
    @Body()
    input: Omit<MarketplaceOffer, "id" | "status" | "createdAt">,
  ) {
    return this.business.createOffer(input);
  }

  @Patch("offers/:id/accept")
  acceptOffer(@Param("id") id: string) {
    return this.business.acceptOffer(id);
  }

  @Post("bookings")
  createBooking(
    @Body()
    input: Omit<MarketplaceBooking, "id" | "status" | "createdAt">,
  ) {
    return this.business.createBooking(input);
  }

  @Patch("bookings/:id/confirm")
  confirmBooking(@Param("id") id: string) {
    return this.business.confirmBooking(id);
  }

  @Post("messages")
  sendMessage(
    @Body()
    input: Omit<MarketplaceMessage, "id" | "createdAt">,
  ) {
    return this.business.sendMessage(input);
  }

  @Patch("deals/:id/complete")
  completeDeal(@Param("id") id: string) {
    return this.business.completeDeal(id);
  }

  @Post("reviews")
  createReview(
    @Body()
    input: Omit<MarketplaceReview, "id" | "createdAt">,
  ) {
    return this.business.createReview(input);
  }

  @Get("subscriptions/plans")
  plans() {
    return this.business.plans();
  }

  @Get("dashboard")
  dashboard() {
    return this.business.dashboard();
  }
}