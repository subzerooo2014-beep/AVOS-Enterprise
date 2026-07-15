import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  GrowthCampaign,
  IndustryCustomerProfile,
  IndustryJourney,
  LoyaltyAccount,
  RecommendationResult,
  ReferralRecord,
  TrustReview,
} from "./industry-customer-growth.types";
import {
  INDUSTRY_CUSTOMER_GROWTH_COMPONENTS,
  SUPPORTED_CUSTOMER_INDUSTRIES,
} from "./industry-customer-growth.registry";

@Injectable()
export class IndustryCustomerGrowthService {
  private readonly profiles = new Map<string, IndustryCustomerProfile>();
  private readonly journeys = new Map<string, IndustryJourney>();
  private readonly reviews = new Map<string, TrustReview>();
  private readonly referrals = new Map<string, ReferralRecord>();
  private readonly loyalty = new Map<string, LoyaltyAccount>();
  private readonly campaigns = new Map<string, GrowthCampaign>();
  private readonly recommendations =
    new Map<string, RecommendationResult>();

  components() {
    return {
      system: "AVOS Industry Customer, Trust & Growth Core",
      architecture: "INDUSTRY_BASED",
      components: [...INDUSTRY_CUSTOMER_GROWTH_COMPONENTS],
      industries: [...SUPPORTED_CUSTOMER_INDUSTRIES],
      status: "READY",
    };
  }

  upsertCustomerProfile(
    input: Omit<IndustryCustomerProfile, "id" | "createdAt" | "updatedAt"> & {
      id?: string;
    },
  ): IndustryCustomerProfile {
    this.requireIndustry(input.industryKey);

    if (
      !input.tenantId?.trim() ||
      !input.customerId?.trim()
    ) {
      throw new Error("tenantId and customerId are required");
    }

    if (
      input.trustScore < 0 ||
      input.trustScore > 100 ||
      input.lifetimeValue < 0
    ) {
      throw new Error("Invalid customer profile values");
    }

    const now = new Date().toISOString();
    const existing = input.id ? this.profiles.get(input.id) : undefined;

    const profile: IndustryCustomerProfile = {
      id: input.id ?? randomUUID(),
      industryKey: input.industryKey,
      tenantId: input.tenantId,
      customerId: input.customerId,
      lifecycleStage: input.lifecycleStage,
      trustScore: input.trustScore,
      lifetimeValue: input.lifetimeValue,
      preferences: { ...input.preferences },
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.profiles.set(profile.id, profile);
    return this.cloneProfile(profile);
  }

  createJourney(
    input: Omit<IndustryJourney, "id" | "status" | "createdAt" | "updatedAt">,
  ): IndustryJourney {
    this.requireIndustry(input.industryKey);
    this.requireCustomer(input.customerId, input.industryKey);

    const now = new Date().toISOString();
    const journey: IndustryJourney = {
      ...input,
      id: randomUUID(),
      status: "ACTIVE",
      context: { ...input.context },
      createdAt: now,
      updatedAt: now,
    };

    this.journeys.set(journey.id, journey);
    return this.cloneJourney(journey);
  }

  advanceJourney(id: string, currentStep: string): IndustryJourney {
    const journey = this.requireJourney(id);
    journey.currentStep = currentStep;
    journey.updatedAt = new Date().toISOString();
    this.journeys.set(id, journey);
    return this.cloneJourney(journey);
  }

  createReview(
    input: Omit<TrustReview, "id" | "verified" | "createdAt">,
  ): TrustReview {
    this.requireIndustry(input.industryKey);

    if (input.rating < 1 || input.rating > 5) {
      throw new Error("Review rating must be between 1 and 5");
    }

    const review: TrustReview = {
      ...input,
      id: randomUUID(),
      verified: false,
      createdAt: new Date().toISOString(),
    };

    this.reviews.set(review.id, review);
    return { ...review };
  }

  verifyReview(id: string): TrustReview {
    const review = this.requireReview(id);
    review.verified = true;
    this.reviews.set(id, review);
    return { ...review };
  }

  createReferral(
    input: Omit<ReferralRecord, "id" | "status" | "createdAt" | "updatedAt">,
  ): ReferralRecord {
    this.requireIndustry(input.industryKey);

    const now = new Date().toISOString();
    const referral: ReferralRecord = {
      ...input,
      id: randomUUID(),
      status: "CREATED",
      createdAt: now,
      updatedAt: now,
    };

    this.referrals.set(referral.id, referral);
    return { ...referral };
  }

  convertReferral(
    id: string,
    referredCustomerId: string,
  ): ReferralRecord {
    const referral = this.requireReferral(id);
    referral.referredCustomerId = referredCustomerId;
    referral.status = "CONVERTED";
    referral.updatedAt = new Date().toISOString();
    this.referrals.set(id, referral);
    return { ...referral };
  }

  createLoyaltyAccount(
    input: Omit<LoyaltyAccount, "id" | "points" | "tier" | "createdAt" | "updatedAt">,
  ): LoyaltyAccount {
    this.requireIndustry(input.industryKey);

    const now = new Date().toISOString();
    const account: LoyaltyAccount = {
      ...input,
      id: randomUUID(),
      points: 0,
      tier: "BRONZE",
      createdAt: now,
      updatedAt: now,
    };

    this.loyalty.set(account.id, account);
    return { ...account };
  }

  addLoyaltyPoints(id: string, points: number): LoyaltyAccount {
    const account = this.requireLoyalty(id);

    if (points <= 0) {
      throw new Error("Loyalty points must be positive");
    }

    account.points += points;
    account.tier =
      account.points >= 10000
        ? "PLATINUM"
        : account.points >= 5000
          ? "GOLD"
          : account.points >= 1000
            ? "SILVER"
            : "BRONZE";
    account.updatedAt = new Date().toISOString();
    this.loyalty.set(id, account);

    return { ...account };
  }

  createCampaign(
    input: Omit<GrowthCampaign, "id" | "status" | "metrics" | "createdAt" | "updatedAt">,
  ): GrowthCampaign {
    this.requireIndustry(input.industryKey);

    const now = new Date().toISOString();
    const campaign: GrowthCampaign = {
      ...input,
      id: randomUUID(),
      status: "DRAFT",
      metrics: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        converted: 0,
      },
      createdAt: now,
      updatedAt: now,
    };

    this.campaigns.set(campaign.id, campaign);
    return this.cloneCampaign(campaign);
  }

  activateCampaign(id: string): GrowthCampaign {
    const campaign = this.requireCampaign(id);
    campaign.status = "ACTIVE";
    campaign.updatedAt = new Date().toISOString();
    this.campaigns.set(id, campaign);
    return this.cloneCampaign(campaign);
  }

  recommend(
    industryKey: string,
    tenantId: string,
    customerId: string,
    candidates: Array<{ entityId: string; entityType: string; score: number }>,
  ): RecommendationResult {
    this.requireIndustry(industryKey);
    this.requireCustomer(customerId, industryKey);

    const result: RecommendationResult = {
      id: randomUUID(),
      industryKey,
      tenantId,
      customerId,
      recommendations: candidates
        .filter((candidate) => candidate.score >= 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map((candidate) => ({
          ...candidate,
          reason: "Industry fit, customer preferences, trust, and behavior",
        })),
      createdAt: new Date().toISOString(),
    };

    this.recommendations.set(result.id, result);
    return {
      ...result,
      recommendations: result.recommendations.map((item) => ({ ...item })),
    };
  }

  dashboard() {
    const profiles = Array.from(this.profiles.values());
    const campaigns = Array.from(this.campaigns.values());
    const reviews = Array.from(this.reviews.values());

    return {
      system: "AVOS Industry Customer, Trust & Growth Core",
      architecture: "INDUSTRY_BASED",
      customerProfiles: profiles.length,
      averageTrustScore:
        profiles.length === 0
          ? 0
          : Number(
              (
                profiles.reduce((sum, profile) => sum + profile.trustScore, 0) /
                profiles.length
              ).toFixed(2),
            ),
      journeys: this.journeys.size,
      reviews: reviews.length,
      verifiedReviews: reviews.filter((review) => review.verified).length,
      referrals: this.referrals.size,
      loyaltyAccounts: this.loyalty.size,
      campaigns: campaigns.length,
      activeCampaigns: campaigns.filter(
        (campaign) => campaign.status === "ACTIVE",
      ).length,
      recommendations: this.recommendations.size,
      generatedAt: new Date().toISOString(),
    };
  }

  private requireIndustry(key: string) {
    if (
      !SUPPORTED_CUSTOMER_INDUSTRIES.includes(
        key as (typeof SUPPORTED_CUSTOMER_INDUSTRIES)[number],
      )
    ) {
      throw new Error(`Unsupported industry: ${key}`);
    }
  }

  private requireCustomer(
    customerId: string,
    industryKey: string,
  ): IndustryCustomerProfile {
    const profile = Array.from(this.profiles.values()).find(
      (item) =>
        item.customerId === customerId &&
        item.industryKey === industryKey,
    );

    if (!profile) {
      throw new Error(
        `Customer profile not found: ${customerId} in ${industryKey}`,
      );
    }

    return profile;
  }

  private requireJourney(id: string): IndustryJourney {
    const value = this.journeys.get(id);
    if (!value) {
      throw new Error(`Journey not found: ${id}`);
    }
    return value;
  }

  private requireReview(id: string): TrustReview {
    const value = this.reviews.get(id);
    if (!value) {
      throw new Error(`Review not found: ${id}`);
    }
    return value;
  }

  private requireReferral(id: string): ReferralRecord {
    const value = this.referrals.get(id);
    if (!value) {
      throw new Error(`Referral not found: ${id}`);
    }
    return value;
  }

  private requireLoyalty(id: string): LoyaltyAccount {
    const value = this.loyalty.get(id);
    if (!value) {
      throw new Error(`Loyalty account not found: ${id}`);
    }
    return value;
  }

  private requireCampaign(id: string): GrowthCampaign {
    const value = this.campaigns.get(id);
    if (!value) {
      throw new Error(`Campaign not found: ${id}`);
    }
    return value;
  }

  private cloneProfile(
    value: IndustryCustomerProfile,
  ): IndustryCustomerProfile {
    return {
      ...value,
      preferences: { ...value.preferences },
    };
  }

  private cloneJourney(value: IndustryJourney): IndustryJourney {
    return {
      ...value,
      context: { ...value.context },
    };
  }

  private cloneCampaign(value: GrowthCampaign): GrowthCampaign {
    return {
      ...value,
      metrics: { ...value.metrics },
    };
  }
}