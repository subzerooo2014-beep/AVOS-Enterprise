import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { CustomerExperienceGrowthService } from "./customer-experience-growth.service";
import {
  Customer360Profile,
  CustomerJourney,
  GrowthMetric,
  LoyaltyTransaction,
  MarketingCampaign,
  NotificationRequest,
  Recommendation,
  ReferralProgramRecord,
} from "./customer-experience-growth.types";

@Controller("customer-experience-growth")
export class CustomerExperienceGrowthController {
  constructor(private readonly growth: CustomerExperienceGrowthService) {}

  @Post("customers")
  upsertCustomer(
    @Body()
    input: Omit<Customer360Profile, "updatedAt">,
  ) {
    return this.growth.upsertCustomer(input);
  }

  @Get("customers/:customerId")
  getCustomer(@Param("customerId") customerId: string) {
    return this.growth.getCustomer(customerId);
  }

  @Post("journeys")
  createJourney(
    @Body()
    input: Omit<CustomerJourney, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    return this.growth.createJourney(input);
  }

  @Patch("journeys/:id/stage")
  updateJourneyStage(
    @Param("id") id: string,
    @Body() body: { currentStage: string; status?: CustomerJourney["status"] },
  ) {
    return this.growth.updateJourneyStage(id, body);
  }

  @Post("campaigns")
  createCampaign(
    @Body()
    input: Omit<MarketingCampaign, "id" | "status" | "createdAt">,
  ) {
    return this.growth.createCampaign(input);
  }

  @Patch("campaigns/:id/launch")
  launchCampaign(@Param("id") id: string) {
    return this.growth.launchCampaign(id);
  }

  @Post("notifications")
  queueNotification(
    @Body()
    input: Omit<NotificationRequest, "id" | "status" | "createdAt">,
  ) {
    return this.growth.queueNotification(input);
  }

  @Patch("notifications/:id/sent")
  markNotificationSent(@Param("id") id: string) {
    return this.growth.markNotificationSent(id);
  }

  @Post("referrals")
  createReferral(
    @Body()
    input: Omit<ReferralProgramRecord, "id" | "status" | "createdAt">,
  ) {
    return this.growth.createReferral(input);
  }

  @Patch("referrals/:id/qualify")
  qualifyReferral(@Param("id") id: string) {
    return this.growth.qualifyReferral(id);
  }

  @Post("loyalty")
  addLoyaltyPoints(
    @Body()
    input: Omit<LoyaltyTransaction, "id" | "createdAt">,
  ) {
    return this.growth.addLoyaltyPoints(input);
  }

  @Post("recommendations")
  createRecommendation(
    @Body()
    input: Omit<Recommendation, "id" | "createdAt">,
  ) {
    return this.growth.createRecommendation(input);
  }

  @Get("recommendations/:customerId")
  recommendationsForCustomer(@Param("customerId") customerId: string) {
    return this.growth.recommendationsForCustomer(customerId);
  }

  @Post("metrics")
  upsertMetric(@Body() input: GrowthMetric) {
    return this.growth.upsertMetric(input);
  }

  @Get("metrics")
  growthMetrics() {
    return this.growth.growthMetrics();
  }

  @Get("dashboard")
  dashboard() {
    return this.growth.dashboard();
  }
}