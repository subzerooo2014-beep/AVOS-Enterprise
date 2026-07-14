export type ProviderKind =
  | "BANK"
  | "PAYMENT"
  | "INSURANCE"
  | "INSPECTION"
  | "GOVERNMENT"
  | "SHIPPING"
  | "EXPORT";

export type ProviderState = "HEALTHY" | "DEGRADED" | "DOWN";

export interface ProviderConfig {
  code: string;
  kind: ProviderKind;
  baseUrl: string;
  timeoutMs: number;
  retryLimit: number;
  priority: number;
  enabled: boolean;
}

export interface ProviderExecutionContext {
  correlationId: string;
  idempotencyKey: string;
  requestTimestamp: string;
}

export interface ProviderExecutionResult {
  success: boolean;
  providerCode: string;
  latencyMs: number;
  status: string;
  data: Record<string, unknown>;
}
