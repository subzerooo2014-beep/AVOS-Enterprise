export interface TransactionDomainDefinition {
  key: string;
  name: string;
  capabilities: string[];
  enabled: boolean;
}

export type TransactionStatus =
  | "CREATED"
  | "IN_PROGRESS"
  | "APPROVED"
  | "COMPLETED"
  | "CANCELLED"
  | "DISPUTED";

export interface TransactionCase {
  id: string;
  domain: string;
  tenantId: string;
  buyerId: string;
  sellerId: string;
  vehicleId: string;
  status: TransactionStatus;
  amount: number;
  currency: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionCommand {
  domain: string;
  capability: string;
  action: string;
  tenantId: string;
  actorId: string;
  caseId?: string;
  payload?: Record<string, unknown>;
}

export interface TransactionCommandResult {
  id: string;
  domain: string;
  capability: string;
  action: string;
  tenantId: string;
  actorId: string;
  caseId?: string;
  success: boolean;
  status: "COMPLETED";
  createdAt: string;
  output: Record<string, unknown>;
}