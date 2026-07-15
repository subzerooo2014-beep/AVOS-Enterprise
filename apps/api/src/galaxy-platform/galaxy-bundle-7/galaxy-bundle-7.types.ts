export interface GalaxyBundle7Capability {
  capability: string;
  domain: string;
}

export interface GalaxyBundle7ExecutionRequest {
  capability: string;
  tenantId: string;
  action: string;
  payload?: Record<string, unknown>;
}

export interface GalaxyBundle7ExecutionResult {
  id: string;
  capability: string;
  domain: string;
  tenantId: string;
  action: string;
  success: boolean;
  status: "COMPLETED";
  score: number;
  timestamp: string;
  output: Record<string, unknown>;
}