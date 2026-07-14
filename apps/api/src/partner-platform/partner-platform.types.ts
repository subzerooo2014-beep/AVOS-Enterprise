export type PartnerEnvironment = "SANDBOX" | "PRODUCTION";
export type PartnerCategory =
  | "FINANCE"
  | "INSURANCE"
  | "INSPECTION"
  | "PAYMENT"
  | "SHIPPING"
  | "EXPORT";
export type PartnerAuthType = "API_KEY" | "OAUTH2" | "NONE";

export interface PartnerConfiguration {
  id: string;
  code: string;
  name: string;
  category: PartnerCategory;
  environment: PartnerEnvironment;
  baseUrl: string;
  authType: PartnerAuthType;
  apiKeyHeader?: string;
  clientId?: string;
  secretMasked?: string;
  tokenUrl?: string;
  webhookSecretMasked?: string;
  timeoutMs: number;
  retryLimit: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerRequestResult {
  success: boolean;
  providerReference: string;
  status: string;
  data: Record<string, unknown>;
  simulated: boolean;
  receivedAt: string;
}

export interface PartnerWebhookRecord {
  id: string;
  partnerCode: string;
  eventType: string;
  payload: Record<string, unknown>;
  signatureVerified: boolean;
  replayRejected: boolean;
  receivedAt: string;
}
