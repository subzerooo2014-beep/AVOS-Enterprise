export type SellingStage =
  | "DRAFT"
  | "MEDIA_ANALYSIS"
  | "PRICING"
  | "OPTIMIZATION"
  | "PUBLISHED"
  | "LEADS"
  | "OFFERS"
  | "NEGOTIATION"
  | "RESERVED"
  | "SOLD"
  | "HANDOVER"
  | "COMPLETED"
  | "CANCELLED";

export interface SellingJourneyRecord {
  id: string;
  sellerId: string;
  vehicleId: string;
  stage: SellingStage;
  title: string;
  description: string;
  askingPrice: number;
  recommendedPrice?: number;
  mediaIds: string[];
  leadIds: string[];
  offerIds: string[];
  reservationId?: string;
  saleId?: string;
  handoverId?: string;
  publicationChannels: string[];
  timeline: Array<{ stage: SellingStage; note: string; createdAt: string }>;
  createdAt: string;
  updatedAt: string;
}
