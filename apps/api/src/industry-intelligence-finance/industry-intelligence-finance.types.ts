export interface ValuationRequest {
  industryKey: string;
  tenantId: string;
  assetId: string;
  attributes: Record<string, unknown>;
  marketSignals?: Record<string, number>;
}

export interface ValuationResult {
  id: string;
  industryKey: string;
  tenantId: string;
  assetId: string;
  estimatedValue: number;
  currency: string;
  confidence: number;
  factors: string[];
  createdAt: string;
}

export interface FraudAssessment {
  id: string;
  industryKey: string;
  tenantId: string;
  entityId: string;
  riskScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  signals: string[];
  blocked: boolean;
  createdAt: string;
}

export interface InsuranceQuote {
  id: string;
  industryKey: string;
  tenantId: string;
  customerId: string;
  assetId: string;
  providerId: string;
  premium: number;
  currency: string;
  deductible: number;
  coverage: string[];
  status: "QUOTED" | "ACCEPTED" | "EXPIRED";
  createdAt: string;
  updatedAt: string;
}

export interface InsurancePolicy {
  id: string;
  quoteId: string;
  policyNumber: string;
  status: "ACTIVE" | "CANCELLED" | "EXPIRED";
  validFrom: string;
  validTo: string;
  createdAt: string;
  updatedAt: string;
}

export interface InsuranceClaim {
  id: string;
  policyId: string;
  tenantId: string;
  amount: number;
  currency: string;
  reason: string;
  status: "SUBMITTED" | "REVIEWING" | "APPROVED" | "REJECTED" | "PAID";
  createdAt: string;
  updatedAt: string;
}

export interface FinanceApplication {
  id: string;
  industryKey: string;
  tenantId: string;
  customerId: string;
  assetId: string;
  requestedAmount: number;
  downPayment: number;
  termMonths: number;
  currency: string;
  status: "SUBMITTED" | "PRE_APPROVED" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
}

export interface FinanceOffer {
  id: string;
  applicationId: string;
  providerId: string;
  approvedAmount: number;
  annualRate: number;
  termMonths: number;
  monthlyInstallment: number;
  currency: string;
  status: "OFFERED" | "ACCEPTED" | "EXPIRED";
  createdAt: string;
  updatedAt: string;
}