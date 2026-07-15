export type JourneyStatus =
  | "DRAFT"
  | "ACTIVE"
  | "PAUSED"
  | "COMPLETED";

export type CampaignStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "RUNNING"
  | "COMPLETED"
  | "CANCELLED";

export type NotificationChannel =
  | "PUSH"
  | "EMAIL"
  | "SMS";

export interface Customer360Profile {
  customerId: string;
  fullName: string;
  email?: string;
  phone?: string;
  preferredLanguage: string;
  lifetimeValue: number;
  loyaltyPoints: number;
  referralCount: number;
  tags: string[];
  updatedAt: string;
}

export interface CustomerJourney {
  id: string;
  customerId: string;
  name: string;
  currentStage: string;
  stages: string[];
  status: JourneyStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  audience: string[];
  channels: NotificationChannel[];
  message: string;
  scheduledAt?: string;
  status: CampaignStatus;
  createdAt: string;
}

export interface NotificationRequest {
  id: string;
  customerId: string;
  channel: NotificationChannel;
  subject?: string;
  message: string;
  status: "QUEUED" | "SENT" | "FAILED";
  createdAt: string;
}

export interface ReferralProgramRecord {
  id: string;
  referrerId: string;
  referredCustomerId: string;
  rewardPoints: number;
  status: "PENDING" | "QUALIFIED" | "REWARDED";
  createdAt: string;
}

export interface LoyaltyTransaction {
  id: string;
  customerId: string;
  points: number;
  reason: string;
  createdAt: string;
}

export interface Recommendation {
  id: string;
  customerId: string;
  type: "VEHICLE" | "SERVICE" | "FINANCE" | "INSURANCE";
  itemId: string;
  score: number;
  reason: string;
  createdAt: string;
}

export interface GrowthMetric {
  key: string;
  value: number;
  target?: number;
  updatedAt: string;
}

export interface CustomerExperienceDashboard {
  customers: number;
  activeJourneys: number;
  campaigns: number;
  notifications: number;
  referrals: number;
  recommendations: number;
  totalLoyaltyPoints: number;
  growthMetrics: number;
  generatedAt: string;
}