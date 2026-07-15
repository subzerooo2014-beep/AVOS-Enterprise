export interface AvosApplicationDefinition {
  key: string;
  name: string;
  capabilities: string[];
}

export interface AvosApplicationExecutionRequest {
  action: string;
  tenantId: string;
  userId: string;
  payload?: Record<string, unknown>;
}

export interface AvosApplicationExecutionResult {
  application: string;
  action: string;
  tenantId: string;
  userId: string;
  success: boolean;
  status: "COMPLETED";
  timestamp: string;
  output: Record<string, unknown>;
}