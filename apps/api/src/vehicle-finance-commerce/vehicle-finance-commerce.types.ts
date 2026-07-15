export const VEHICLE_FINANCE_COMMERCE_CAPABILITIES = [
  'payment-orchestration-engine',
  'vehicle-deposit-reservation-engine',
  'financing-application-engine',
  'insurance-quotation-engine',
  'contract-generation-engine',
  'digital-signature-coordinator',
  'commission-fee-calculator',
  'refund-settlement-engine',
  'financial-risk-check-engine',
  'transaction-audit-trail',
  'purchase-flow-orchestrator',
  'finance-commerce-dashboard',
] as const;

export type VehicleFinanceCommerceCapability =
  (typeof VEHICLE_FINANCE_COMMERCE_CAPABILITIES)[number];

export type PaymentStatus =
  | 'created'
  | 'authorized'
  | 'captured'
  | 'failed'
  | 'refunded'
  | 'cancelled';

export interface PaymentTransaction {
  id: string;
  orderId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  currency: string;
  method: 'card' | 'bank-transfer' | 'wallet' | 'cash';
  status: PaymentStatus;
  createdAt: string;
}

export interface DepositReservation {
  id: string;
  listingId: string;
  buyerId: string;
  amount: number;
  currency: string;
  expiresAt: string;
  status: 'pending' | 'paid' | 'expired' | 'released' | 'applied';
}

export interface FinancingApplication {
  id: string;
  buyerId: string;
  listingId: string;
  vehiclePrice: number;
  downPayment: number;
  termMonths: number;
  monthlyIncome: number;
  requestedAmount: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
}

export interface InsuranceQuote {
  id: string;
  providerId: string;
  listingId: string;
  buyerId: string;
  annualPremium: number;
  deductible: number;
  coverageScore: number;
  validUntil: string;
}

export interface CommerceContract {
  id: string;
  orderId: string;
  buyerId: string;
  sellerId: string;
  listingId: string;
  totalAmount: number;
  currency: string;
  status: 'draft' | 'issued' | 'signed' | 'cancelled';
  terms: string[];
}

export interface FinancialRiskSignal {
  id: string;
  subjectId: string;
  type: string;
  score: number;
  evidence: string[];
}

export interface TransactionAuditEntry {
  id: string;
  transactionId: string;
  action: string;
  actorId: string;
  occurredAt: string;
  metadata: Record<string, string | number | boolean>;
}

export interface FinanceCommerceDashboardSnapshot {
  generatedAt: string;
  capturedPayments: number;
  activeDeposits: number;
  approvedFinancing: number;
  issuedContracts: number;
  averageRiskScore: number;
  capabilityStatus: Record<
    VehicleFinanceCommerceCapability,
    'operational'
  >;
}