export type PartnerType =
  | "FINANCE"
  | "INSURANCE"
  | "INSPECTION"
  | "PAYMENT"
  | "SHIPPING"
  | "EXPORT";

export type IntegrationStatus =
  | "CREATED"
  | "SUBMITTED"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "COMPLETED"
  | "FAILED"
  | "RETRYING"
  | "CANCELLED";

export interface PartnerProfile {
  id: string;
  name: string;
  type: PartnerType;
  enabled: boolean;
  endpoint: string;
  timeoutMs: number;
  maxRetries: number;
  trustScore: number;
}

export interface IntegrationRequest {
  id: string;
  dealId: string;
  partnerId: string;
  partnerType: PartnerType;
  status: IntegrationStatus;
  payload: Record<string, unknown>;
  response?: Record<string, unknown>;
  attempts: number;
  maxRetries: number;
  lastError?: string;
  callbackUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookEvent {
  id: string;
  partnerId: string;
  requestId: string;
  eventType: string;
  payload: Record<string, unknown>;
  receivedAt: string;
  signatureVerified: boolean;
}
