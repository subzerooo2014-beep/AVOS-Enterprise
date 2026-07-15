import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { RevenueCommerceService } from "./revenue-commerce.service";
import {
  AdvertisementCampaign,
  CommercePayment,
  CommissionRecord,
  CouponRecord,
  InvoiceLine,
  RefundRecord,
  SubscriptionRecord,
} from "./revenue-commerce.types";

@Controller("revenue-commerce")
export class RevenueCommerceController {
  constructor(private readonly revenue: RevenueCommerceService) {}

  @Get("plans")
  listPlans() {
    return this.revenue.listPlans();
  }

  @Post("subscriptions")
  createSubscription(
    @Body()
    input: Omit<SubscriptionRecord, "id" | "status" | "startsAt" | "createdAt">,
  ) {
    return this.revenue.createSubscription(input);
  }

  @Patch("subscriptions/:id/cancel")
  cancelSubscription(@Param("id") id: string) {
    return this.revenue.cancelSubscription(id);
  }

  @Post("invoices")
  createInvoice(
    @Body()
    input: {
      tenantId: string;
      subscriptionId?: string;
      currency: string;
      taxRate: number;
      couponCode?: string;
      lines: Omit<InvoiceLine, "total">[];
    },
  ) {
    return this.revenue.createInvoice(input);
  }

  @Post("payments")
  createPayment(
    @Body()
    input: Omit<CommercePayment, "id" | "status" | "createdAt">,
  ) {
    return this.revenue.createPayment(input);
  }

  @Patch("payments/:id/capture")
  capturePayment(
    @Param("id") id: string,
    @Body() body: { transactionReference: string },
  ) {
    return this.revenue.capturePayment(id, body.transactionReference);
  }

  @Post("commissions")
  createCommission(
    @Body()
    input: Omit<CommissionRecord, "id" | "commissionAmount" | "createdAt">,
  ) {
    return this.revenue.createCommission(input);
  }

  @Post("advertisements")
  createAdvertisement(
    @Body()
    input: Omit<AdvertisementCampaign, "id" | "spent" | "status" | "createdAt">,
  ) {
    return this.revenue.createAdvertisement(input);
  }

  @Patch("advertisements/:id/activate")
  activateAdvertisement(@Param("id") id: string) {
    return this.revenue.activateAdvertisement(id);
  }

  @Patch("advertisements/:id/spend")
  spendAdvertisementBudget(
    @Param("id") id: string,
    @Body() body: { amount: number },
  ) {
    return this.revenue.spendAdvertisementBudget(id, body.amount);
  }

  @Post("coupons")
  createCoupon(
    @Body()
    input: Omit<CouponRecord, "id" | "redeemed" | "createdAt">,
  ) {
    return this.revenue.createCoupon(input);
  }

  @Post("refunds")
  createRefund(
    @Body()
    input: Omit<RefundRecord, "id" | "status" | "createdAt">,
  ) {
    return this.revenue.createRefund(input);
  }

  @Patch("refunds/:id/complete")
  completeRefund(@Param("id") id: string) {
    return this.revenue.completeRefund(id);
  }

  @Get("dashboard")
  dashboard() {
    return this.revenue.dashboard();
  }
}