import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { IndustryCommerceRevenueService } from "./industry-commerce-revenue.service";
import {
  IndustryOffer,
  IndustryPayment,
  IndustryPricingRule,
  IndustrySubscription,
} from "./industry-commerce-revenue.types";

@Controller("industry-commerce-revenue")
export class IndustryCommerceRevenueController {
  constructor(
    private readonly commerce: IndustryCommerceRevenueService,
  ) {}

  @Get("components")
  components() {
    return this.commerce.components();
  }

  @Post("offers")
  createOffer(
    @Body()
    input: Omit<IndustryOffer, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    return this.commerce.createOffer(input);
  }

  @Patch("offers/:id/activate")
  activateOffer(@Param("id") id: string) {
    return this.commerce.activateOffer(id);
  }

  @Post("pricing-rules")
  createPricingRule(
    @Body()
    input: Omit<IndustryPricingRule, "id" | "createdAt" | "updatedAt">,
  ) {
    return this.commerce.createPricingRule(input);
  }

  @Post("subscriptions")
  createSubscription(
    @Body()
    input: Omit<
      IndustrySubscription,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.commerce.createSubscription(input);
  }

  @Post("payments")
  createPayment(
    @Body()
    input: Omit<
      IndustryPayment,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.commerce.createPayment(input);
  }

  @Patch("payments/:id/capture")
  capturePayment(
    @Param("id") id: string,
    @Body() body: { transactionReference: string },
  ) {
    return this.commerce.capturePayment(id, body.transactionReference);
  }

  @Get("industries/:industryKey/summary")
  summary(@Param("industryKey") industryKey: string) {
    return this.commerce.summary(industryKey);
  }

  @Get("dashboard")
  dashboard() {
    return this.commerce.dashboard();
  }
}