export type AuctionStatus = "DRAFT" | "SCHEDULED" | "LIVE" | "ENDED" | "CANCELLED";
export type FinanceStatus = "SUBMITTED" | "UNDER_REVIEW" | "PRE_APPROVED" | "APPROVED" | "REJECTED";
export type InsuranceStatus = "QUOTED" | "SELECTED" | "ISSUED" | "EXPIRED";
export type InspectionStatus = "REQUESTED" | "SCHEDULED" | "COMPLETED" | "FAILED";
export type ShipmentStatus = "CREATED" | "BOOKED" | "IN_TRANSIT" | "CUSTOMS" | "DELIVERED";
export type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "WON" | "LOST";

export interface Auction {
  id: string;
  listingId: string;
  sellerId: string;
  startsAt: string;
  endsAt: string;
  reservePrice: number;
  currentBid: number;
  currency: string;
  status: AuctionStatus;
  createdAt: string;
}

export interface AuctionBid {
  id: string;
  auctionId: string;
  bidderId: string;
  amount: number;
  createdAt: string;
}

export interface FinanceApplication {
  id: string;
  listingId: string;
  applicantId: string;
  requestedAmount: number;
  downPayment: number;
  termMonths: number;
  annualRate: number;
  monthlyPayment: number;
  status: FinanceStatus;
  createdAt: string;
}

export interface InsuranceQuote {
  id: string;
  listingId: string;
  customerId: string;
  provider: string;
  premium: number;
  deductible: number;
  currency: string;
  status: InsuranceStatus;
  createdAt: string;
}

export interface InspectionRequest {
  id: string;
  listingId: string;
  customerId: string;
  providerId: string;
  scheduledAt?: string;
  score?: number;
  notes?: string;
  status: InspectionStatus;
  createdAt: string;
}

export interface Shipment {
  id: string;
  listingId: string;
  customerId: string;
  originCountry: string;
  destinationCountry: string;
  carrier: string;
  shippingCost: number;
  currency: string;
  trackingNumber?: string;
  status: ShipmentStatus;
  createdAt: string;
}

export interface DealerLead {
  id: string;
  dealerId: string;
  customerId: string;
  listingId?: string;
  source: string;
  status: LeadStatus;
  createdAt: string;
}

export interface MonetizationTransaction {
  id: string;
  tenantId: string;
  type: "SUBSCRIPTION" | "FEATURED_LISTING" | "COMMISSION" | "ADVERTISING" | "REFERRAL";
  amount: number;
  currency: string;
  referenceId?: string;
  createdAt: string;
}

export interface BusinessExpansionDashboard {
  auctions: number;
  liveAuctions: number;
  bids: number;
  financeApplications: number;
  approvedFinance: number;
  insuranceQuotes: number;
  inspections: number;
  shipments: number;
  dealerLeads: number;
  monetizationTransactions: number;
  generatedAt: string;
}