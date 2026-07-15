export type VehicleStatus =
  | "DRAFT"
  | "AVAILABLE"
  | "RESERVED"
  | "SOLD"
  | "IN_SERVICE"
  | "EXPORTED"
  | "INACTIVE";

export interface VehicleRecord {
  id: string;
  tenantId: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  category: "NEW" | "USED" | "CLASSIC" | "FLEET";
  status: VehicleStatus;
  branchId?: string;
  ownerId?: string;
  mileage?: number;
  price: number;
  currency: string;
  attributes: Record<string, unknown>;
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface VehicleListing {
  id: string;
  tenantId: string;
  vehicleId: string;
  sellerId: string;
  title: string;
  description: string;
  askingPrice: number;
  currency: string;
  published: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TradeInRequest {
  id: string;
  tenantId: string;
  customerId: string;
  vehicleId: string;
  targetVehicleId?: string;
  estimatedValue: number;
  status: "REQUESTED" | "ASSESSED" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
}

export interface ServiceRecord {
  id: string;
  tenantId: string;
  vehicleId: string;
  workshopId: string;
  serviceType: "MAINTENANCE" | "REPAIR" | "INSPECTION" | "WARRANTY" | "RECALL";
  status: "BOOKED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  cost: number;
  currency: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AutomotiveFinanceApplication {
  id: string;
  tenantId: string;
  vehicleId: string;
  customerId: string;
  providerType: "BANK" | "LEASING" | "INSURANCE";
  amount: number;
  currency: string;
  status: "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
}

export interface AutomotiveLogisticsCase {
  id: string;
  tenantId: string;
  vehicleId: string;
  type: "DELIVERY" | "SHIPPING" | "EXPORT" | "IMPORT" | "CUSTOMS";
  origin: string;
  destination: string;
  trackingNumber?: string;
  status: "CREATED" | "IN_TRANSIT" | "CUSTOMS" | "DELIVERED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

export interface AutomotiveAiAssessment {
  id: string;
  tenantId: string;
  vehicleId: string;
  type: "PRICING" | "FRAUD" | "BUYER_MATCH" | "DEALER" | "MARKET";
  score: number;
  recommendation: string;
  factors: string[];
  createdAt: string;
}