export type ServiceStatus =
  | "REQUESTED"
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface ServiceBooking {
  id: string;
  industryKey: string;
  tenantId: string;
  customerId: string;
  assetId: string;
  serviceType: string;
  providerId?: string;
  scheduledAt?: string;
  status: ServiceStatus;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface WorkshopJob {
  id: string;
  industryKey: string;
  tenantId: string;
  bookingId: string;
  workshopId: string;
  technicianId?: string;
  diagnosis?: string;
  status: ServiceStatus;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface InspectionRecord {
  id: string;
  industryKey: string;
  tenantId: string;
  assetId: string;
  inspectorId?: string;
  grade?: string;
  certificateNumber?: string;
  status: ServiceStatus;
  evidence: string[];
  findings: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface WarrantyRecord {
  id: string;
  industryKey: string;
  tenantId: string;
  assetId: string;
  providerId: string;
  planCode: string;
  validFrom: string;
  validTo: string;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

export interface WarrantyClaim {
  id: string;
  warrantyId: string;
  tenantId: string;
  reason: string;
  amount: number;
  currency: string;
  status: "SUBMITTED" | "APPROVED" | "REJECTED" | "PAID";
  createdAt: string;
  updatedAt: string;
}

export interface PartsOrder {
  id: string;
  industryKey: string;
  tenantId: string;
  customerId: string;
  supplierId?: string;
  items: Array<{
    sku: string;
    quantity: number;
    unitPrice: number;
  }>;
  total: number;
  currency: string;
  status: "DRAFT" | "CONFIRMED" | "FULFILLED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

export interface FieldServiceRequest {
  id: string;
  industryKey: string;
  tenantId: string;
  customerId: string;
  assetId: string;
  serviceType: "MOBILE_SERVICE" | "ROADSIDE_ASSISTANCE" | "PICKUP_DELIVERY";
  location: string;
  status: ServiceStatus;
  createdAt: string;
  updatedAt: string;
}