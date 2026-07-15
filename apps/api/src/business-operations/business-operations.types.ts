export type ServiceBookingStatus =
  | "REQUESTED"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type WarrantyStatus =
  | "ACTIVE"
  | "CLAIMED"
  | "APPROVED"
  | "REJECTED"
  | "EXPIRED";

export type SupportStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED";

export interface WorkshopBooking {
  id: string;
  customerId: string;
  vehicleId: string;
  workshopId: string;
  serviceType: string;
  scheduledAt: string;
  status: ServiceBookingStatus;
  createdAt: string;
}

export interface WarrantyRecord {
  id: string;
  vehicleId: string;
  customerId: string;
  providerId: string;
  startsAt: string;
  endsAt: string;
  status: WarrantyStatus;
  createdAt: string;
}

export interface WarrantyClaim {
  id: string;
  warrantyId: string;
  customerId: string;
  description: string;
  amount: number;
  currency: string;
  status: WarrantyStatus;
  createdAt: string;
}

export interface PartsOrder {
  id: string;
  customerId: string;
  supplierId: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  total: number;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  customerId: string;
  subject: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: SupportStatus;
  createdAt: string;
}

export interface LoyaltyAccount {
  customerId: string;
  points: number;
  tier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
  updatedAt: string;
}

export interface ReferralRecord {
  id: string;
  referrerId: string;
  referredCustomerId: string;
  rewardPoints: number;
  createdAt: string;
}

export interface BusinessPayment {
  id: string;
  customerId: string;
  amount: number;
  currency: string;
  purpose: string;
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  createdAt: string;
}

export interface BusinessOperationsDashboard {
  workshopBookings: number;
  activeWarranties: number;
  warrantyClaims: number;
  partsOrders: number;
  supportTickets: number;
  loyaltyAccounts: number;
  referrals: number;
  payments: number;
  generatedAt: string;
}