export type DealStage =
  | "MATCHED"
  | "NEGOTIATING"
  | "RESERVED"
  | "INSPECTION"
  | "FINANCING"
  | "INSURANCE"
  | "PAYMENT"
  | "COMPLETED"
  | "CANCELLED";

export type ServiceStatus =
  | "NOT_STARTED"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "COMPLETED";

export interface BuyerProfile {
  id: string;
  name: string;
  budget: number;
  preferredBrands: string[];
  preferredBodyTypes: string[];
  location: string;
  financingRequired: boolean;
}

export interface VehicleOffer {
  id: string;
  sellerId: string;
  title: string;
  brand: string;
  bodyType: string;
  price: number;
  location: string;
  trustScore: number;
  available: boolean;
}

export interface MatchResult {
  vehicleId: string;
  score: number;
  reasons: string[];
}

export interface NegotiationRecord {
  id: string;
  dealId: string;
  actor: "BUYER" | "SELLER" | "AZM";
  amount: number;
  message: string;
  createdAt: string;
}

export interface DealTimelineEntry {
  stage: DealStage;
  status: "ACTIVE" | "COMPLETED" | "FAILED";
  note: string;
  createdAt: string;
}

export interface DealRecord {
  id: string;
  buyerId: string;
  sellerId: string;
  vehicleId: string;
  askingPrice: number;
  agreedPrice?: number;
  stage: DealStage;
  reservationStatus: ServiceStatus;
  inspectionStatus: ServiceStatus;
  financingStatus: ServiceStatus;
  insuranceStatus: ServiceStatus;
  paymentStatus: ServiceStatus;
  trustScore: number;
  fraudRisk: number;
  timeline: DealTimelineEntry[];
  negotiations: NegotiationRecord[];
  createdAt: string;
  updatedAt: string;
}
