export type PurchaseStage =
  | "DISCOVERY"
  | "SHORTLISTED"
  | "RESERVED"
  | "NEGOTIATING"
  | "INSPECTION"
  | "FINANCING"
  | "INSURANCE"
  | "PAYMENT"
  | "CONTRACT"
  | "TRANSFER"
  | "DELIVERY"
  | "COMPLETED"
  | "CANCELLED";

export interface PurchaseJourneyRecord {
  id: string;
  buyerId: string;
  sellerId: string;
  vehicleId: string;
  stage: PurchaseStage;
  askingPrice: number;
  agreedPrice?: number;
  reservationId?: string;
  inspectionId?: string;
  financeApplicationId?: string;
  insuranceQuoteId?: string;
  paymentId?: string;
  contractId?: string;
  transferId?: string;
  deliveryId?: string;
  timeline: Array<{
    stage: PurchaseStage;
    note: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}
