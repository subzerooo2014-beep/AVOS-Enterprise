import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { IndustryCustomerGrowthService } from "./industry-customer-growth.service";
import {
  GrowthCampaign,
  IndustryCustomerProfile,
  IndustryJourney,
  LoyaltyAccount,
  ReferralRecord,
  TrustReview,
} from "./industry-customer-growth.types";

@Controller("industry-customer-growth")
export class IndustryCustomerGrowthController {
  constructor(private readonly growth: IndustryCustomerGrowthService) {}

  @Get("components")
  components() {
    return this.growth.components();
  }

  @Post("customers")
  upsertCustomerProfile(
    @Body()
    input: Omit<IndustryCustomerProfile, "id" | "createdAt" | "updatedAt"> & {
      id?: string;
    },
  ) {
    return this.growth.upsertCustomerProfile(input);
  }

  @Post("journeys")
  createJourney(
    @Body()
    input: Omit<IndustryJourney, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    return this.growth.createJourney(input);
  }

  @Patch("journeys/:id/step")
  advanceJourney(
    @Param("id") id: string,
    @Body() body: { currentStep: string },
  ) {
    return this.growth.advanceJourney(id, body.currentStep);
  }

  @Post("reviews")
  createReview(
    @Body()
    input: Omit<TrustReview, "id" | "verified" | "createdAt">,
  ) {
    return this.growth.createReview(input);
  }

  @Patch("reviews/:id/verify")
  verifyReview(@Param("id") id: string) {
    return this.growth.verifyReview(id);
  }

  @Post("referrals")
  createReferral(
    @Body()
    input: Omit<ReferralRecord, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    return this.growth.createReferral(input);
  }

  @Patch("referrals/:id/convert")
  convertReferral(
    @Param("id") id: string,
    @Body() body: { referredCustomerId: string },
  ) {
    return this.growth.convertReferral(id, body.referredCustomerId);
  }

  @Post("loyalty")
  createLoyaltyAccount(
    @Body()
    input: Omit<
      LoyaltyAccount,
      "id" | "points" | "tier" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.growth.createLoyaltyAccount(input);
  }

  @Patch("loyalty/:id/points")
  addLoyaltyPoints(
    @Param("id") id: string,
    @Body() body: { points: number },
  ) {
    return this.growth.addLoyaltyPoints(id, body.points);
  }

  @Post("campaigns")
  createCampaign(
    @Body()
    input: Omit<
      GrowthCampaign,
      "id" | "status" | "metrics" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.growth.createCampaign(input);
  }

  @Patch("campaigns/:id/activate")
  activateCampaign(@Param("id") id: string) {
    return this.growth.activateCampaign(id);
  }

  @Post("recommendations")
  recommend(
    @Body()
    body: {
      industryKey: string;
      tenantId: string;
      customerId: string;
      candidates: Array<{
        entityId: string;
        entityType: string;
        score: number;
      }>;
    },
  ) {
    return this.growth.recommend(
      body.industryKey,
      body.tenantId,
      body.customerId,
      body.candidates,
    );
  }

  @Get("dashboard")
  dashboard() {
    return this.growth.dashboard();
  }
}