export interface ProductDomainDefinition {
  key: string;
  name: string;
  capabilities: string[];
  enabled: boolean;
}

export interface ProductRecord {
  id: string;
  domain: string;
  tenantId: string;
  actorId: string;
  entityType: string;
  status: "DRAFT" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  payload: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCommandRequest {
  domain: string;
  tenantId: string;
  actorId: string;
  capability: string;
  action: string;
  payload?: Record<string, unknown>;
}

export interface ProductCommandResult {
  id: string;
  domain: string;
  capability: string;
  action: string;
  tenantId: string;
  actorId: string;
  status: "COMPLETED";
  success: boolean;
  createdAt: string;
  output: Record<string, unknown>;
}