export type SubscriptionStatus =
  | "TRIAL"
  | "ACTIVE"
  | "PAST_DUE"
  | "CANCELLED"
  | "EXPIRED";

export type InvoiceStatus =
  | "DRAFT"
  | "ISSUED"
  | "PAID"
  | "VOID"
  | "OVERDUE";

export type PaymentStatus =
  | "PENDING"
  | "AUTHORIZED"
  | "CAPTURED"
  | "FAILED"
  | "REFUNDED";

export type RefundStatus =
  | "REQUESTED"
  | "APPROVED"
  | "REJECTED"
  | "COMPLETED";

export interface CommercePlan {
  id: string;
  code: "FREE" | "PRO" | "PREMIUM" | "ENTERPRISE";
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  listingLimit: number;
  featuredListings: number;
  commissionRate: number;
  active: boolean;
}

export interface SubscriptionRecord {
  id: string;
  tenantId: string;
  planId: string;
  billingCycle: "MONTHLY" | "YEARLY";
  status: SubscriptionStatus;
  startsAt: string;
  endsAt?: string;
  createdAt: string;
}

export interface InvoiceLine {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface CommerceInvoice {
  id: string;
  tenantId: string;
  subscriptionId?: string;
  currency: string;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  status: InvoiceStatus;
  lines: InvoiceLine[];
  createdAt: string;
}

export interface CommercePayment {
  id: string;
  invoiceId: string;
  tenantId: string;
  provider: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  transactionReference?: string;
  createdAt: string;
}

export interface CommissionRecord {
  id: string;
  tenantId: string;
  sourceType: "SALE" | "BOOKING" | "AUCTION" | "FINANCE" | "INSURANCE";
  sourceId: string;
  grossAmount: number;
  rate: number;
  commissionAmount: number;
  currency: string;
  createdAt: string;
}

export interface AdvertisementCampaign {
  id: string;
  tenantId: string;
  name: string;
  budget: number;
  spent: number;
  currency: string;
  status: "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED";
  startsAt?: string;
  endsAt?: string;
  createdAt: string;
}

export interface CouponRecord {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  currency?: string;
  maxRedemptions: number;
  redeemed: number;
  active: boolean;
  expiresAt?: string;
  createdAt: string;
}

export interface RefundRecord {
  id: string;
  paymentId: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  createdAt: string;
}

export interface RevenueDashboard {
  activeSubscriptions: number;
  invoices: number;
  paidInvoices: number;
  payments: number;
  capturedRevenue: number;
  refunds: number;
  commissions: number;
  commissionRevenue: number;
  activeAdvertisements: number;
  coupons: number;
  generatedAt: string;
}