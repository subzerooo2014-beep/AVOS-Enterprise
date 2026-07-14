export type CommerceRequestStatus =
  | "CREATED"
  | "PENDING"
  | "APPROVED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "REJECTED";

export interface InsuranceQuote {
  id: string;
  provider: string;
  annualPremium: number;
  coverage: string;
  status: CommerceRequestStatus;
  createdAt: string;
}

export interface FinanceOffer {
  id: string;
  bank: string;
  monthlyInstallment: number;
  rate: number;
  termMonths: number;
  status: CommerceRequestStatus;
  createdAt: string;
}

export interface WorkshopBooking {
  id: string;
  workshop: string;
  service: string;
  scheduledAt: string;
  status: CommerceRequestStatus;
  createdAt: string;
}

export interface ShipmentRequest {
  id: string;
  destination: string;
  provider: string;
  price: number;
  trackingCode: string;
  status: CommerceRequestStatus;
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: CommerceRequestStatus;
  createdAt: string;
}