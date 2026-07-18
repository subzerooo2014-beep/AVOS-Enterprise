export interface SmartAdCampaign {
  id: string;
  title: string;
  audience: string;
  placement:
    | "marketplace"
    | "vehicle-details"
    | "account"
    | "services";
  impressions: number;
  clicks: number;
  conversions: number;
  budget: number;
  spent: number;
  status: "active" | "paused" | "draft";
  aiOptimization: boolean;
}

export const smartAdCampaigns: readonly SmartAdCampaign[] = [
  {
    id: "campaign-001",
    title: "تمويل سيارات فاخرة",
    audience: "باحثون عن سيارات فوق 300 ألف د.إ",
    placement: "vehicle-details",
    impressions: 48200,
    clicks: 2410,
    conversions: 186,
    budget: 18000,
    spent: 12460,
    status: "active",
    aiOptimization: true,
  },
  {
    id: "campaign-002",
    title: "فحص قبل الشراء",
    audience: "مشترون لسيارات مستعملة",
    placement: "marketplace",
    impressions: 72500,
    clicks: 6180,
    conversions: 840,
    budget: 22000,
    spent: 16820,
    status: "active",
    aiOptimization: true,
  },
  {
    id: "campaign-003",
    title: "حماية سيراميك",
    audience: "ملاك سيارات جديدة وفاخرة",
    placement: "account",
    impressions: 19800,
    clicks: 920,
    conversions: 74,
    budget: 6500,
    spent: 2900,
    status: "paused",
    aiOptimization: false,
  },
];
