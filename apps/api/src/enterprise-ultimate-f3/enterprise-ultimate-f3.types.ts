export type F3Capability =
  | "ADVERTISEMENT_COMMAND_CENTER"
  | "SMART_ADVERTISEMENT_CENTER"
  | "ADVERTISEMENT_INTELLIGENCE"
  | "ADVERTISEMENT_HEALTH_MONITOR"
  | "SALES_PROBABILITY_ENGINE"
  | "AI_PRICE_TIMELINE"
  | "AI_PHOTOGRAPHER"
  | "BUYER_RADAR"
  | "ADVERTISEMENT_BATTLE_MODE"
  | "ADVERTISEMENT_LIFECYCLE"
  | "MARKETPLACE_INTELLIGENCE"
  | "MARKET_HEATMAP"
  | "MARKET_PULSE"
  | "OPPORTUNITY_RADAR"
  | "TRUST_SCORE_ENGINE"
  | "DEAL_HEALTH_SCORE"
  | "VEHICLE_360"
  | "CUSTOMER_360"
  | "DEALER_360"
  | "MARKET_360"
  | "AI_360"
  | "VEHICLE_TIMELINE"
  | "CUSTOMER_TIMELINE"
  | "DEAL_TIMELINE"
  | "SMART_LISTING_RANKING"
  | "COMPETITOR_COMPARISON"
  | "ADVERTISEMENT_AUDIENCE_ANALYTICS"
  | "PROMOTION_OPTIMIZER"
  | "LEAD_INTENT_ENGINE"
  | "MARKETPLACE_COMMAND_CENTER";

export interface F3Advertisement {
  id: string;
  tenantId: string;
  sellerId: string;
  vehicleId: string;
  title: string;
  price: number;
  currency: string;
  status: "DRAFT" | "PUBLISHED" | "TRENDING" | "NEGOTIATION" | "SOLD";
  views: number;
  favorites: number;
  messages: number;
  calls: number;
  healthScore: number;
  trustScore: number;
  salesProbability: number;
  marketRank: number;
  createdAt: string;
  updatedAt: string;
}

export interface F3MarketSignal {
  id: string;
  tenantId: string;
  signalType: string;
  subjectCode: string;
  region: string;
  score: number;
  direction: "UP" | "DOWN" | "STABLE";
  summary: string;
  createdAt: string;
}

export interface F3BuyerIntent {
  id: string;
  tenantId: string;
  buyerId: string;
  query: string;
  budgetMin: number;
  budgetMax: number;
  region: string;
  intentScore: number;
  matchedAdvertisementIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface F3TimelineEvent {
  id: string;
  tenantId: string;
  entityType: "VEHICLE" | "CUSTOMER" | "DEAL" | "ADVERTISEMENT";
  entityId: string;
  eventType: string;
  title: string;
  description: string;
  metadata: Record<string, string | number | boolean>;
  createdAt: string;
}