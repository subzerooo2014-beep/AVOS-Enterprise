export const 0_CAPABILITIES = [
1
] as const;

export type 2Capability =
  (typeof 0_CAPABILITIES)[number];

export interface 2ExecutionRequest {
  capability: 2Capability;
  action: string;
  tenantId: string;
  payload?: Record<string, unknown>;
}

export interface 2ExecutionResult {
  capability: 2Capability;
  action: string;
  tenantId: string;
  success: boolean;
  status: "COMPLETED";
  timestamp: string;
  output: Record<string, unknown>;
}