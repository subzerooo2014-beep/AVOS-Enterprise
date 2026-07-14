export type CampaignStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED";
export type GrowthChannel = "SEO" | "SOCIAL" | "REFERRAL" | "INFLUENCER" | "EMAIL" | "PUSH" | "PAID";

export interface GrowthCampaignRecord {
  id: string;
  name: string;
  channel: GrowthChannel;
  status: CampaignStatus;
  budget: number;
  objective: string;
  audience: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReferralRecord {
  id: string;
  referrerId: string;
  referredUserId: string;
  code: string;
  status: "PENDING" | "QUALIFIED" | "REWARDED" | "REJECTED";
  rewardAmount: number;
  createdAt: string;
}
