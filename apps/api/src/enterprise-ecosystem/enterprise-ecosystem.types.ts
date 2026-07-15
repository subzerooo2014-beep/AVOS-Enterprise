export interface EcosystemHubDefinition {
  key: string;
  name: string;
  capabilities: string[];
}

export interface EcosystemExecutionRequest {
  capability: string;
  tenantId: string;
  partnerId: string;
  action: string;
  payload?: Record<string, unknown>;
}

export interface EcosystemExecutionResult {
  id: string;
  hub: string;
  capability: string;
  tenantId: string;
  partnerId: string;
  action: string;
  status: "COMPLETED";
  success: boolean;
  createdAt: string;
  output: Record<string, unknown>;
}

export interface EcosystemPartner {
  id: string;
  hub: string;
  name: string;
  country: string;
  active: boolean;
  capabilities: string[];
  createdAt: string;
}