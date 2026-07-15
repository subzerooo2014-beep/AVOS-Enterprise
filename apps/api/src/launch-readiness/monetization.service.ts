import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { Invoice, PricingPlan, Subscription } from "./launch-readiness.types";

@Injectable()
export class MonetizationService {
  private readonly plans = new Map<string, PricingPlan>();
  private readonly subscriptions = new Map<string, Subscription>();
  private readonly invoices = new Map<string, Invoice>();

  createPlan(input: Omit<PricingPlan, "id" | "createdAt" | "updatedAt">): PricingPlan {
    if (input.monthlyPrice < 0 || input.annualPrice < 0) throw new Error("Plan prices cannot be negative");

    const now = new Date().toISOString();
    const plan: PricingPlan = {
      ...input,
      id: randomUUID(),
      features: [...input.features],
      limits: { ...input.limits },
      createdAt: now,
      updatedAt: now,
    };

    this.plans.set(plan.id, plan);
    return this.clonePlan(plan);
  }

  createSubscription(
    tenantId: string,
    planId: string,
    billingCycle: Subscription["billingCycle"],
    seats: number,
    trialEndsAt?: string,
  ): Subscription {
    const plan = this.requirePlan(planId);
    if (!plan.active || seats <= 0) throw new Error("Invalid subscription configuration");

    const start = new Date();
    const end = new Date(start);
    billingCycle === "MONTHLY" ? end.setMonth(end.getMonth() + 1) : end.setFullYear(end.getFullYear() + 1);

    const unitAmount = billingCycle === "MONTHLY" ? plan.monthlyPrice : plan.annualPrice;
    const now = start.toISOString();

    const subscription: Subscription = {
      id: randomUUID(),
      tenantId,
      planId,
      status: trialEndsAt ? "TRIAL" : "ACTIVE",
      billingCycle,
      seats,
      amount: Number((unitAmount * seats).toFixed(2)),
      currency: plan.currency,
      currentPeriodStart: now,
      currentPeriodEnd: end.toISOString(),
      trialEndsAt,
      createdAt: now,
      updatedAt: now,
    };

    this.subscriptions.set(subscription.id, subscription);
    return { ...subscription };
  }

  changePlan(id: string, planId: string, seats: number): Subscription {
    const subscription = this.requireSubscription(id);
    const plan = this.requirePlan(planId);
    const unitAmount = subscription.billingCycle === "MONTHLY" ? plan.monthlyPrice : plan.annualPrice;

    subscription.planId = planId;
    subscription.seats = seats;
    subscription.amount = Number((unitAmount * seats).toFixed(2));
    subscription.currency = plan.currency;
    subscription.updatedAt = new Date().toISOString();

    this.subscriptions.set(id, subscription);
    return { ...subscription };
  }

  createInvoice(subscriptionId: string, taxRate: number, dueAt: string): Invoice {
    const subscription = this.requireSubscription(subscriptionId);
    if (taxRate < 0) throw new Error("taxRate cannot be negative");

    const tax = Number((subscription.amount * taxRate / 100).toFixed(2));
    const now = new Date().toISOString();

    const invoice: Invoice = {
      id: randomUUID(),
      tenantId: subscription.tenantId,
      subscriptionId,
      number: `AVOS-${Date.now()}`,
      amount: subscription.amount,
      tax,
      total: Number((subscription.amount + tax).toFixed(2)),
      currency: subscription.currency,
      status: "ISSUED",
      dueAt,
      createdAt: now,
      updatedAt: now,
    };

    this.invoices.set(invoice.id, invoice);
    return { ...invoice };
  }

  payInvoice(id: string): Invoice {
    const invoice = this.requireInvoice(id);
    invoice.status = "PAID";
    invoice.paidAt = new Date().toISOString();
    invoice.updatedAt = invoice.paidAt;
    this.invoices.set(id, invoice);

    const subscription = this.requireSubscription(invoice.subscriptionId);
    subscription.status = "ACTIVE";
    subscription.updatedAt = invoice.paidAt;
    this.subscriptions.set(subscription.id, subscription);

    return { ...invoice };
  }

  dashboard() {
    const subscriptions = Array.from(this.subscriptions.values());
    const invoices = Array.from(this.invoices.values());

    return {
      plans: this.plans.size,
      subscriptions: subscriptions.length,
      activeSubscriptions: subscriptions.filter((item) => item.status === "ACTIVE").length,
      trials: subscriptions.filter((item) => item.status === "TRIAL").length,
      invoices: invoices.length,
      paidInvoices: invoices.filter((item) => item.status === "PAID").length,
      monthlyRecurringRevenue: Number(
        subscriptions
          .filter((item) => item.status === "ACTIVE" && item.billingCycle === "MONTHLY")
          .reduce((sum, item) => sum + item.amount, 0)
          .toFixed(2),
      ),
      generatedAt: new Date().toISOString(),
    };
  }

  private requirePlan(id: string): PricingPlan {
    const value = this.plans.get(id);
    if (!value) throw new Error(`Pricing plan not found: ${id}`);
    return value;
  }

  private requireSubscription(id: string): Subscription {
    const value = this.subscriptions.get(id);
    if (!value) throw new Error(`Subscription not found: ${id}`);
    return value;
  }

  private requireInvoice(id: string): Invoice {
    const value = this.invoices.get(id);
    if (!value) throw new Error(`Invoice not found: ${id}`);
    return value;
  }

  private clonePlan(plan: PricingPlan): PricingPlan {
    return { ...plan, features: [...plan.features], limits: { ...plan.limits } };
  }
}