export type GovernmentProvider =
  | "UAE_PASS"
  | "EMIRATES_ID"
  | "RTA"
  | "MOI"
  | "SALIK"
  | "EVG"
  | "CUSTOMS"
  | "OWNERSHIP_TRANSFER";

export type GovernmentEnvironment = "SANDBOX" | "PRODUCTION";

export interface GovernmentRequestContext {
  correlationId: string;
  idempotencyKey: string;
  provider: GovernmentProvider;
  environment: GovernmentEnvironment;
  requestedAt: string;
}

export interface GovernmentRequestResult {
  success: boolean;
  provider: GovernmentProvider;
  reference: string;
  status: string;
  data: Record<string, unknown>;
  simulated: boolean;
  receivedAt: string;
}

export interface GovernmentAuditRecord {
  id: string;
  action: string;
  provider: GovernmentProvider;
  entityId: string;
  correlationId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}
