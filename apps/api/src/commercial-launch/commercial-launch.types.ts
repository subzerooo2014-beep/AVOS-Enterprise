export interface CommercialLaunchCapability {
  key: string;
  name: string;
  enabled: boolean;
}

export interface CommercialLaunchExecutionRequest {
  capability: string;
  tenantId: string;
  actorId: string;
  action: string;
  payload?: Record<string, unknown>;
}

export interface CommercialLaunchExecutionResult {
  id: string;
  capability: string;
  tenantId: string;
  actorId: string;
  action: string;
  status: "COMPLETED";
  success: boolean;
  createdAt: string;
  output: Record<string, unknown>;
}