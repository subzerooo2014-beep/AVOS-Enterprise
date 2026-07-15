import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  IndustryOffer,
  IndustryPayment,
  IndustryPricingRule,
  IndustryRevenueSummary,
  IndustrySubscription,
  RevenueProtectionDecision,
} from "./industry-commerce-revenue.types";
import {
  COMMERCE_REVENUE_COMPONENTS,
  SUPPORTED_INDUSTRIES,
} from "./industry-commerce-revenue.registry";

@Injectable()
export class IndustryCommerceRevenueService {
  private readonly offers = new Map<string, IndustryOffer>();
  private readonly pricingRules = new Map<string, IndustryPricingRule>();
  private readonly subscriptions = new Map<string, IndustrySubscription>();
  private readonly payments = new Map<string, IndustryPayment>();
  private readonly protections = new Map<string, RevenueProtectionDecision>();

  components() {
    return {
      system: "AVOS Industry Commerce & Revenue Core",
      architecture: "INDUSTRY_BASED",
      components: [...COMMERCE_REVENUE_COMPONENTS],
      industries: [...SUPPORTED_INDUSTRIES],
      status: "READY",
    };
  }

  createOffer(
    input: Omit<IndustryOffer, "id" | "status" | "createdAt" | "updatedAt">,
  ): IndustryOffer {
    this.requireIndustry(input.industryKey);

    if (
      !input.tenantId?.trim() ||
      !input.sellerId?.trim() ||
      !input.entityId?.trim()
    ) {
      throw new Error("tenantId, sellerId and entityId are required");
    }

    if (input.amount <= 0) {
      throw new Error("Offer amount must be positive");
    }

    const now = new Date().toISOString();
    const offer: IndustryOffer = {
      ...input,
      id: randomUUID(),
      status: "DRAFT",
      metadata: { ...input.metadata },
      createdAt: now,
      updatedAt: now,
    };

    this.offers.set(offer.id, offer);
    return this.cloneOffer(offer);
  }

  activateOffer(id: string): IndustryOffer {
    const offer = this.requireOffer(id);
    offer.status = "ACTIVE";
    offer.updatedAt = new Date().toISOString();
    this.offers.set(id, offer);
    return this.cloneOffer(offer);
  }

  createPricingRule(
    input: Omit<IndustryPricingRule, "id" | "createdAt" | "updatedAt">,
  ): IndustryPricingRule {
    this.requireIndustry(input.industryKey);

    if (
      input.baseAmount < 0 ||
      input.commissionRate < 0 ||
      input.commissionRate > 100 ||
      input.platformFee < 0
    ) {
      throw new Error("Invalid pricing rule values");
    }

    const now = new Date().toISOString();
    const rule: IndustryPricingRule = {
      ...input,
      id: randomUUID(),
      metadata: { ...input.metadata },
      createdAt: now,
      updatedAt: now,
    };

    this.pricingRules.set(rule.id, rule);
    return this.clonePricingRule(rule);
  }

  createSubscription(
    input: Omit<IndustrySubscription, "id" | "status" | "createdAt" | "updatedAt">,
  ): IndustrySubscription {
    this.requireIndustry(input.industryKey);

    if (!input.tenantId?.trim() || !input.planCode?.trim()) {
      throw new Error("tenantId and planCode are required");
    }

    if (input.amount < 0) {
      throw new Error("Subscription amount cannot be negative");
    }

    const now = new Date().toISOString();
    const subscription: IndustrySubscription = {
      ...input,
      id: randomUUID(),
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now,
    };

    this.subscriptions.set(subscription.id, subscription);
    return { ...subscription };
  }

  createPayment(
    input: Omit<IndustryPayment, "id" | "status" | "createdAt" | "updatedAt">,
  ): IndustryPayment {
    this.requireIndustry(input.industryKey);

    if (!input.tenantId?.trim() || !input.provider?.trim()) {
      throw new Error("tenantId and provider are required");
    }

    if (input.amount <= 0) {
      throw new Error("Payment amount must be positive");
    }

    if (!input.offerId && !input.subscriptionId) {
      throw new Error("offerId or subscriptionId is required");
    }

    if (input.offerId) {
      this.requireOffer(input.offerId);
    }

    if (input.subscriptionId) {
      this.requireSubscription(input.subscriptionId);
    }

    const now = new Date().toISOString();
    const payment: IndustryPayment = {
      ...input,
      id: randomUUID(),
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
    };

    this.payments.set(payment.id, payment);
    return { ...payment };
  }

  capturePayment(
    id: string,
    transactionReference: string,
  ): IndustryPayment {
    const payment = this.requirePayment(id);

    if (!transactionReference?.trim()) {
      throw new Error("transactionReference is required");
    }

    payment.status = "CAPTURED";
    payment.transactionReference = transactionReference;
    payment.updatedAt = new Date().toISOString();
    this.payments.set(id, payment);

    this.protectRevenue(payment);

    return { ...payment };
  }

  protectRevenue(
    payment: IndustryPayment,
  ): RevenueProtectionDecision {
    const rule = this.findPricingRule(payment.industryKey);
    const commissionAmount = Number(
      (payment.amount * (rule?.commissionRate ?? 0) / 100).toFixed(2),
    );
    const platformFee = Number((rule?.platformFee ?? 0).toFixed(2));
    const protectedRevenue = Number(
      (commissionAmount + platformFee).toFixed(2),
    );

    const reasons: string[] = [];
    let leakageDetected = false;
    let blocked = false;

    if (payment.amount <= protectedRevenue) {
      leakageDetected = true;
      blocked = true;
      reasons.push("Protected revenue exceeds or equals payment value");
    }

    if (!rule) {
      leakageDetected = true;
      reasons.push("No active industry pricing rule found");
    }

    const decision: RevenueProtectionDecision = {
      id: randomUUID(),
      industryKey: payment.industryKey,
      tenantId: payment.tenantId,
      sourceType: payment.offerId ? "OFFER_PAYMENT" : "SUBSCRIPTION_PAYMENT",
      sourceId: payment.id,
      grossAmount: payment.amount,
      protectedRevenue,
      commissionAmount,
      platformFee,
      leakageDetected,
      blocked,
      reasons,
      createdAt: new Date().toISOString(),
    };

    this.protections.set(decision.id, decision);
    return {
      ...decision,
      reasons: [...decision.reasons],
    };
  }

  summary(industryKey: string): IndustryRevenueSummary {
    this.requireIndustry(industryKey);

    const offers = Array.from(this.offers.values()).filter(
      (item) => item.industryKey === industryKey,
    );
    const subscriptions = Array.from(this.subscriptions.values()).filter(
      (item) => item.industryKey === industryKey,
    );
    const payments = Array.from(this.payments.values()).filter(
      (item) => item.industryKey === industryKey,
    );
    const protections = Array.from(this.protections.values()).filter(
      (item) => item.industryKey === industryKey,
    );

    return {
      industryKey,
      offers: offers.length,
      subscriptions: subscriptions.length,
      payments: payments.length,
      capturedRevenue: Number(
        payments
          .filter((payment) => payment.status === "CAPTURED")
          .reduce((sum, payment) => sum + payment.amount, 0)
          .toFixed(2),
      ),
      protectedRevenue: Number(
        protections
          .reduce((sum, decision) => sum + decision.protectedRevenue, 0)
          .toFixed(2),
      ),
      commissions: Number(
        protections
          .reduce((sum, decision) => sum + decision.commissionAmount, 0)
          .toFixed(2),
      ),
      platformFees: Number(
        protections
          .reduce((sum, decision) => sum + decision.platformFee, 0)
          .toFixed(2),
      ),
      leakageEvents: protections.filter(
        (decision) => decision.leakageDetected,
      ).length,
      generatedAt: new Date().toISOString(),
    };
  }

  dashboard() {
    return {
      system: "AVOS Industry Commerce & Revenue Core",
      architecture: "INDUSTRY_BASED",
      offers: this.offers.size,
      pricingRules: this.pricingRules.size,
      subscriptions: this.subscriptions.size,
      payments: this.payments.size,
      protectionDecisions: this.protections.size,
      revenueProtectionEnabled: true,
      leakageDetectionEnabled: true,
      generatedAt: new Date().toISOString(),
    };
  }

  private requireIndustry(key: string) {
    if (!SUPPORTED_INDUSTRIES.includes(
      key as (typeof SUPPORTED_INDUSTRIES)[number],
    )) {
      throw new Error(`Unsupported industry: ${key}`);
    }
  }

  private requireOffer(id: string): IndustryOffer {
    const offer = this.offers.get(id);

    if (!offer) {
      throw new Error(`Offer not found: ${id}`);
    }

    return offer;
  }

  private requireSubscription(id: string): IndustrySubscription {
    const subscription = this.subscriptions.get(id);

    if (!subscription) {
      throw new Error(`Subscription not found: ${id}`);
    }

    return subscription;
  }

  private requirePayment(id: string): IndustryPayment {
    const payment = this.payments.get(id);

    if (!payment) {
      throw new Error(`Payment not found: ${id}`);
    }

    return payment;
  }

  private findPricingRule(
    industryKey: string,
  ): IndustryPricingRule | undefined {
    return Array.from(this.pricingRules.values()).find(
      (rule) => rule.industryKey === industryKey && rule.active,
    );
  }

  private cloneOffer(offer: IndustryOffer): IndustryOffer {
    return {
      ...offer,
      metadata: { ...offer.metadata },
    };
  }

  private clonePricingRule(
    rule: IndustryPricingRule,
  ): IndustryPricingRule {
    return {
      ...rule,
      metadata: { ...rule.metadata },
    };
  }
}