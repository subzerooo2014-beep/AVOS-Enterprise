import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  Customer360Profile,
  CustomerExperienceDashboard,
  CustomerJourney,
  GrowthMetric,
  LoyaltyTransaction,
  MarketingCampaign,
  NotificationRequest,
  Recommendation,
  ReferralProgramRecord,
} from "./customer-experience-growth.types";

@Injectable()
export class CustomerExperienceGrowthService {
  private readonly customers = new Map<string, Customer360Profile>();
  private readonly journeys = new Map<string, CustomerJourney>();
  private readonly campaigns = new Map<string, MarketingCampaign>();
  private readonly notifications = new Map<string, NotificationRequest>();
  private readonly referrals = new Map<string, ReferralProgramRecord>();
  private readonly loyaltyTransactions = new Map<string, LoyaltyTransaction>();
  private readonly recommendations = new Map<string, Recommendation>();
  private readonly metrics = new Map<string, GrowthMetric>();

  upsertCustomer(
    input: Omit<Customer360Profile, "updatedAt">,
  ): Customer360Profile {
    if (!input.customerId?.trim() || !input.fullName?.trim()) {
      throw new Error("customerId and fullName are required");
    }

    const customer: Customer360Profile = {
      ...input,
      tags: [...input.tags],
      updatedAt: new Date().toISOString(),
    };

    this.customers.set(customer.customerId, customer);
    return this.cloneCustomer(customer);
  }

  getCustomer(customerId: string): Customer360Profile {
    const customer = this.customers.get(customerId);

    if (!customer) {
      throw new Error(`Customer not found: ${customerId}`);
    }

    return this.cloneCustomer(customer);
  }

  createJourney(
    input: Omit<CustomerJourney, "id" | "status" | "createdAt" | "updatedAt">,
  ): CustomerJourney {
    this.getCustomer(input.customerId);

    if (!input.name?.trim() || input.stages.length === 0) {
      throw new Error("Journey name and stages are required");
    }

    const now = new Date().toISOString();
    const journey: CustomerJourney = {
      ...input,
      id: randomUUID(),
      status: "DRAFT",
      stages: [...input.stages],
      createdAt: now,
      updatedAt: now,
    };

    this.journeys.set(journey.id, journey);
    return { ...journey, stages: [...journey.stages] };
  }

  updateJourneyStage(
    id: string,
    body: { currentStage: string; status?: CustomerJourney["status"] },
  ): CustomerJourney {
    const journey = this.journeys.get(id);

    if (!journey) {
      throw new Error(`Journey not found: ${id}`);
    }

    if (!journey.stages.includes(body.currentStage)) {
      throw new Error("Stage does not belong to this journey");
    }

    journey.currentStage = body.currentStage;
    journey.status = body.status ?? journey.status;
    journey.updatedAt = new Date().toISOString();

    this.journeys.set(id, journey);
    return { ...journey, stages: [...journey.stages] };
  }

  createCampaign(
    input: Omit<MarketingCampaign, "id" | "status" | "createdAt">,
  ): MarketingCampaign {
    if (!input.name?.trim() || input.audience.length === 0) {
      throw new Error("Campaign name and audience are required");
    }

    if (input.channels.length === 0 || !input.message?.trim()) {
      throw new Error("Campaign channels and message are required");
    }

    const campaign: MarketingCampaign = {
      ...input,
      id: randomUUID(),
      audience: [...input.audience],
      channels: [...input.channels],
      status: input.scheduledAt ? "SCHEDULED" : "DRAFT",
      createdAt: new Date().toISOString(),
    };

    this.campaigns.set(campaign.id, campaign);
    return this.cloneCampaign(campaign);
  }

  launchCampaign(id: string): MarketingCampaign {
    const campaign = this.campaigns.get(id);

    if (!campaign) {
      throw new Error(`Campaign not found: ${id}`);
    }

    campaign.status = "RUNNING";
    this.campaigns.set(id, campaign);

    for (const customerId of campaign.audience) {
      for (const channel of campaign.channels) {
        this.queueNotification({
          customerId,
          channel,
          message: campaign.message,
          subject: campaign.name,
        });
      }
    }

    return this.cloneCampaign(campaign);
  }

  queueNotification(
    input: Omit<NotificationRequest, "id" | "status" | "createdAt">,
  ): NotificationRequest {
    this.getCustomer(input.customerId);

    if (!input.message?.trim()) {
      throw new Error("Notification message is required");
    }

    const notification: NotificationRequest = {
      ...input,
      id: randomUUID(),
      status: "QUEUED",
      createdAt: new Date().toISOString(),
    };

    this.notifications.set(notification.id, notification);
    return { ...notification };
  }

  markNotificationSent(id: string): NotificationRequest {
    const notification = this.notifications.get(id);

    if (!notification) {
      throw new Error(`Notification not found: ${id}`);
    }

    notification.status = "SENT";
    this.notifications.set(id, notification);
    return { ...notification };
  }

  createReferral(
    input: Omit<ReferralProgramRecord, "id" | "status" | "createdAt">,
  ): ReferralProgramRecord {
    this.getCustomer(input.referrerId);
    this.getCustomer(input.referredCustomerId);

    if (input.rewardPoints <= 0) {
      throw new Error("rewardPoints must be positive");
    }

    const referral: ReferralProgramRecord = {
      ...input,
      id: randomUUID(),
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };

    this.referrals.set(referral.id, referral);
    return { ...referral };
  }

  qualifyReferral(id: string): ReferralProgramRecord {
    const referral = this.referrals.get(id);

    if (!referral) {
      throw new Error(`Referral not found: ${id}`);
    }

    referral.status = "REWARDED";
    this.referrals.set(id, referral);

    this.addLoyaltyPoints({
      customerId: referral.referrerId,
      points: referral.rewardPoints,
      reason: `Referral ${referral.id}`,
    });

    return { ...referral };
  }

  addLoyaltyPoints(
    input: Omit<LoyaltyTransaction, "id" | "createdAt">,
  ): LoyaltyTransaction {
    const customer = this.getCustomer(input.customerId);

    if (input.points === 0) {
      throw new Error("Loyalty points cannot be zero");
    }

    const transaction: LoyaltyTransaction = {
      ...input,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };

    this.loyaltyTransactions.set(transaction.id, transaction);

    customer.loyaltyPoints += input.points;
    customer.updatedAt = new Date().toISOString();
    this.customers.set(customer.customerId, customer);

    return { ...transaction };
  }

  createRecommendation(
    input: Omit<Recommendation, "id" | "createdAt">,
  ): Recommendation {
    this.getCustomer(input.customerId);

    if (input.score < 0 || input.score > 100) {
      throw new Error("Recommendation score must be between 0 and 100");
    }

    const recommendation: Recommendation = {
      ...input,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };

    this.recommendations.set(recommendation.id, recommendation);
    return { ...recommendation };
  }

  recommendationsForCustomer(customerId: string): Recommendation[] {
    this.getCustomer(customerId);

    return Array.from(this.recommendations.values())
      .filter((item) => item.customerId === customerId)
      .sort((a, b) => b.score - a.score)
      .map((item) => ({ ...item }));
  }

  upsertMetric(input: GrowthMetric): GrowthMetric {
    if (!input.key?.trim()) {
      throw new Error("Metric key is required");
    }

    const metric: GrowthMetric = {
      ...input,
      updatedAt: new Date().toISOString(),
    };

    this.metrics.set(metric.key, metric);
    return { ...metric };
  }

  growthMetrics(): GrowthMetric[] {
    return Array.from(this.metrics.values()).map((metric) => ({ ...metric }));
  }

  dashboard(): CustomerExperienceDashboard {
    return {
      customers: this.customers.size,
      activeJourneys: Array.from(this.journeys.values()).filter(
        (journey) => journey.status === "ACTIVE",
      ).length,
      campaigns: this.campaigns.size,
      notifications: this.notifications.size,
      referrals: this.referrals.size,
      recommendations: this.recommendations.size,
      totalLoyaltyPoints: Array.from(this.customers.values()).reduce(
        (sum, customer) => sum + customer.loyaltyPoints,
        0,
      ),
      growthMetrics: this.metrics.size,
      generatedAt: new Date().toISOString(),
    };
  }

  private cloneCustomer(customer: Customer360Profile): Customer360Profile {
    return {
      ...customer,
      tags: [...customer.tags],
    };
  }

  private cloneCampaign(campaign: MarketingCampaign): MarketingCampaign {
    return {
      ...campaign,
      audience: [...campaign.audience],
      channels: [...campaign.channels],
    };
  }
}