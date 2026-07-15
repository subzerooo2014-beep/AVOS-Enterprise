import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  AdvertisementCampaign,
  CommerceInvoice,
  CommercePayment,
  CommercePlan,
  CommissionRecord,
  CouponRecord,
  InvoiceLine,
  RefundRecord,
  RevenueDashboard,
  SubscriptionRecord,
} from "./revenue-commerce.types";

@Injectable()
export class RevenueCommerceService {
  private readonly plans = new Map<string, CommercePlan>();
  private readonly subscriptions = new Map<string, SubscriptionRecord>();
  private readonly invoices = new Map<string, CommerceInvoice>();
  private readonly payments = new Map<string, CommercePayment>();
  private readonly commissions = new Map<string, CommissionRecord>();
  private readonly advertisements = new Map<string, AdvertisementCampaign>();
  private readonly coupons = new Map<string, CouponRecord>();
  private readonly refunds = new Map<string, RefundRecord>();

  constructor() {
    for (const plan of this.defaultPlans()) {
      this.plans.set(plan.id, plan);
    }
  }

  listPlans(): CommercePlan[] {
    return Array.from(this.plans.values()).map((plan) => ({ ...plan }));
  }

  createSubscription(
    input: Omit<SubscriptionRecord, "id" | "status" | "startsAt" | "createdAt">,
  ): SubscriptionRecord {
    const plan = this.plans.get(input.planId);

    if (!plan || !plan.active) {
      throw new Error(`Active plan not found: ${input.planId}`);
    }

    if (!input.tenantId?.trim()) {
      throw new Error("tenantId is required");
    }

    const now = new Date().toISOString();
    const subscription: SubscriptionRecord = {
      ...input,
      id: randomUUID(),
      status: "ACTIVE",
      startsAt: now,
      createdAt: now,
    };

    this.subscriptions.set(subscription.id, subscription);
    return { ...subscription };
  }

  cancelSubscription(id: string): SubscriptionRecord {
    const subscription = this.subscriptions.get(id);

    if (!subscription) {
      throw new Error(`Subscription not found: ${id}`);
    }

    subscription.status = "CANCELLED";
    subscription.endsAt = new Date().toISOString();
    this.subscriptions.set(id, subscription);

    return { ...subscription };
  }

  createInvoice(
    input: {
      tenantId: string;
      subscriptionId?: string;
      currency: string;
      taxRate: number;
      couponCode?: string;
      lines: Omit<InvoiceLine, "total">[];
    },
  ): CommerceInvoice {
    if (!input.tenantId?.trim() || input.lines.length === 0) {
      throw new Error("tenantId and invoice lines are required");
    }

    const lines: InvoiceLine[] = input.lines.map((line) => {
      if (line.quantity <= 0 || line.unitPrice < 0) {
        throw new Error("Invalid invoice line");
      }

      return {
        ...line,
        total: Number((line.quantity * line.unitPrice).toFixed(2)),
      };
    });

    const subtotal = Number(
      lines.reduce((sum, line) => sum + line.total, 0).toFixed(2),
    );

    const discountTotal = this.calculateDiscount(
      input.couponCode,
      subtotal,
      input.currency,
    );

    const taxable = Math.max(subtotal - discountTotal, 0);
    const taxTotal = Number((taxable * (input.taxRate / 100)).toFixed(2));
    const grandTotal = Number((taxable + taxTotal).toFixed(2));

    const invoice: CommerceInvoice = {
      id: randomUUID(),
      tenantId: input.tenantId,
      subscriptionId: input.subscriptionId,
      currency: input.currency,
      subtotal,
      discountTotal,
      taxTotal,
      grandTotal,
      status: "ISSUED",
      lines,
      createdAt: new Date().toISOString(),
    };

    this.invoices.set(invoice.id, invoice);
    return this.cloneInvoice(invoice);
  }

  createPayment(
    input: Omit<CommercePayment, "id" | "status" | "createdAt">,
  ): CommercePayment {
    const invoice = this.invoices.get(input.invoiceId);

    if (!invoice) {
      throw new Error(`Invoice not found: ${input.invoiceId}`);
    }

    if (input.amount <= 0 || input.amount > invoice.grandTotal) {
      throw new Error("Invalid payment amount");
    }

    const payment: CommercePayment = {
      ...input,
      id: randomUUID(),
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };

    this.payments.set(payment.id, payment);
    return { ...payment };
  }

  capturePayment(
    id: string,
    transactionReference: string,
  ): CommercePayment {
    const payment = this.payments.get(id);

    if (!payment) {
      throw new Error(`Payment not found: ${id}`);
    }

    if (!transactionReference?.trim()) {
      throw new Error("transactionReference is required");
    }

    payment.status = "CAPTURED";
    payment.transactionReference = transactionReference;
    this.payments.set(id, payment);

    const invoice = this.invoices.get(payment.invoiceId);

    if (invoice) {
      invoice.status = "PAID";
      this.invoices.set(invoice.id, invoice);
    }

    return { ...payment };
  }

  createCommission(
    input: Omit<CommissionRecord, "id" | "commissionAmount" | "createdAt">,
  ): CommissionRecord {
    if (input.grossAmount < 0 || input.rate < 0 || input.rate > 100) {
      throw new Error("Invalid commission values");
    }

    const commission: CommissionRecord = {
      ...input,
      id: randomUUID(),
      commissionAmount: Number(
        (input.grossAmount * (input.rate / 100)).toFixed(2),
      ),
      createdAt: new Date().toISOString(),
    };

    this.commissions.set(commission.id, commission);
    return { ...commission };
  }

  createAdvertisement(
    input: Omit<AdvertisementCampaign, "id" | "spent" | "status" | "createdAt">,
  ): AdvertisementCampaign {
    if (input.budget <= 0) {
      throw new Error("Advertisement budget must be positive");
    }

    const campaign: AdvertisementCampaign = {
      ...input,
      id: randomUUID(),
      spent: 0,
      status: "DRAFT",
      createdAt: new Date().toISOString(),
    };

    this.advertisements.set(campaign.id, campaign);
    return { ...campaign };
  }

  activateAdvertisement(id: string): AdvertisementCampaign {
    const campaign = this.advertisements.get(id);

    if (!campaign) {
      throw new Error(`Advertisement not found: ${id}`);
    }

    campaign.status = "ACTIVE";
    this.advertisements.set(id, campaign);
    return { ...campaign };
  }

  spendAdvertisementBudget(
    id: string,
    amount: number,
  ): AdvertisementCampaign {
    const campaign = this.advertisements.get(id);

    if (!campaign) {
      throw new Error(`Advertisement not found: ${id}`);
    }

    if (amount <= 0 || campaign.spent + amount > campaign.budget) {
      throw new Error("Invalid advertisement spend");
    }

    campaign.spent = Number((campaign.spent + amount).toFixed(2));

    if (campaign.spent >= campaign.budget) {
      campaign.status = "COMPLETED";
    }

    this.advertisements.set(id, campaign);
    return { ...campaign };
  }

  createCoupon(
    input: Omit<CouponRecord, "id" | "redeemed" | "createdAt">,
  ): CouponRecord {
    if (!input.code?.trim() || input.value <= 0) {
      throw new Error("Coupon code and value are required");
    }

    if (
      Array.from(this.coupons.values()).some(
        (coupon) => coupon.code.toLowerCase() === input.code.toLowerCase(),
      )
    ) {
      throw new Error(`Coupon already exists: ${input.code}`);
    }

    const coupon: CouponRecord = {
      ...input,
      id: randomUUID(),
      code: input.code.toUpperCase(),
      redeemed: 0,
      createdAt: new Date().toISOString(),
    };

    this.coupons.set(coupon.id, coupon);
    return { ...coupon };
  }

  createRefund(
    input: Omit<RefundRecord, "id" | "status" | "createdAt">,
  ): RefundRecord {
    const payment = this.payments.get(input.paymentId);

    if (!payment || payment.status !== "CAPTURED") {
      throw new Error("Captured payment is required");
    }

    if (input.amount <= 0 || input.amount > payment.amount) {
      throw new Error("Invalid refund amount");
    }

    const refund: RefundRecord = {
      ...input,
      id: randomUUID(),
      status: "REQUESTED",
      createdAt: new Date().toISOString(),
    };

    this.refunds.set(refund.id, refund);
    return { ...refund };
  }

  completeRefund(id: string): RefundRecord {
    const refund = this.refunds.get(id);

    if (!refund) {
      throw new Error(`Refund not found: ${id}`);
    }

    refund.status = "COMPLETED";
    this.refunds.set(id, refund);

    const payment = this.payments.get(refund.paymentId);

    if (payment) {
      payment.status = "REFUNDED";
      this.payments.set(payment.id, payment);
    }

    return { ...refund };
  }

  dashboard(): RevenueDashboard {
    const subscriptions = Array.from(this.subscriptions.values());
    const invoices = Array.from(this.invoices.values());
    const payments = Array.from(this.payments.values());
    const commissions = Array.from(this.commissions.values());
    const advertisements = Array.from(this.advertisements.values());

    return {
      activeSubscriptions: subscriptions.filter(
        (subscription) => subscription.status === "ACTIVE",
      ).length,
      invoices: invoices.length,
      paidInvoices: invoices.filter((invoice) => invoice.status === "PAID")
        .length,
      payments: payments.length,
      capturedRevenue: Number(
        payments
          .filter((payment) => payment.status === "CAPTURED")
          .reduce((sum, payment) => sum + payment.amount, 0)
          .toFixed(2),
      ),
      refunds: this.refunds.size,
      commissions: commissions.length,
      commissionRevenue: Number(
        commissions
          .reduce((sum, commission) => sum + commission.commissionAmount, 0)
          .toFixed(2),
      ),
      activeAdvertisements: advertisements.filter(
        (campaign) => campaign.status === "ACTIVE",
      ).length,
      coupons: this.coupons.size,
      generatedAt: new Date().toISOString(),
    };
  }

  private calculateDiscount(
    couponCode: string | undefined,
    subtotal: number,
    currency: string,
  ): number {
    if (!couponCode) {
      return 0;
    }

    const coupon = Array.from(this.coupons.values()).find(
      (item) => item.code === couponCode.toUpperCase(),
    );

    if (!coupon || !coupon.active) {
      throw new Error(`Active coupon not found: ${couponCode}`);
    }

    if (coupon.redeemed >= coupon.maxRedemptions) {
      throw new Error(`Coupon redemption limit reached: ${couponCode}`);
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
      throw new Error(`Coupon expired: ${couponCode}`);
    }

    if (
      coupon.type === "FIXED" &&
      coupon.currency &&
      coupon.currency !== currency
    ) {
      throw new Error("Coupon currency does not match invoice currency");
    }

    coupon.redeemed += 1;
    this.coupons.set(coupon.id, coupon);

    return coupon.type === "PERCENTAGE"
      ? Number((subtotal * (coupon.value / 100)).toFixed(2))
      : Math.min(coupon.value, subtotal);
  }

  private cloneInvoice(invoice: CommerceInvoice): CommerceInvoice {
    return {
      ...invoice,
      lines: invoice.lines.map((line) => ({ ...line })),
    };
  }

  private defaultPlans(): CommercePlan[] {
    return [
      {
        id: "free",
        code: "FREE",
        name: "Free",
        monthlyPrice: 0,
        yearlyPrice: 0,
        currency: "AED",
        listingLimit: 2,
        featuredListings: 0,
        commissionRate: 2.5,
        active: true,
      },
      {
        id: "pro",
        code: "PRO",
        name: "Pro",
        monthlyPrice: 199,
        yearlyPrice: 1990,
        currency: "AED",
        listingLimit: 50,
        featuredListings: 5,
        commissionRate: 1.5,
        active: true,
      },
      {
        id: "premium",
        code: "PREMIUM",
        name: "Premium",
        monthlyPrice: 499,
        yearlyPrice: 4990,
        currency: "AED",
        listingLimit: 500,
        featuredListings: 25,
        commissionRate: 1,
        active: true,
      },
      {
        id: "enterprise",
        code: "ENTERPRISE",
        name: "Enterprise",
        monthlyPrice: 1999,
        yearlyPrice: 19990,
        currency: "AED",
        listingLimit: 10000,
        featuredListings: 100,
        commissionRate: 0.5,
        active: true,
      },
    ];
  }
}