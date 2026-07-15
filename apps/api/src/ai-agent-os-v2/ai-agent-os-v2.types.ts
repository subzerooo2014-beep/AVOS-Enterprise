export const AI_AGENT_OS_V2_CAPABILITIES = [
  "agent-capability-runtime",
  "agent-orchestration",
  "agent-health-monitoring",
  "agent-dashboard",
  "agent-governance",
  "agent-observability",
  "agent-resilience",
  "agent-security",
] as const;

export type AiAgentOsV2Capability =
  (typeof AI_AGENT_OS_V2_CAPABILITIES)[number];

export type AgentCapabilityRecordStatus =
  | "registered"
  | "active"
  | "disabled"
  | "failed";

export interface AgentCapabilityRecord {
  id: string;
  name: string;
  capability: AiAgentOsV2Capability;
  enabled: boolean;
  status: AgentCapabilityRecordStatus;
  metadata: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface AgentExecutionResult {
  capability: AiAgentOsV2Capability;
  success: boolean;
  score: number;
  status: string;
  timestamp: string;
  details: {
    action: string;
    payload: Record<string, unknown>;
    activeRecords: number;
    registeredRecords: number;
    [key: string]: unknown;
  };
}

export interface AgentCapabilityHealth {
  capability: AiAgentOsV2Capability;
  registered: number;
  active: number;
  healthy: boolean;
}

export type AgentCapabilityOperationalStatus =
  | "operational"
  | "degraded"
  | "offline";

export interface AiAgentOsDashboardSnapshot {
  generatedAt: string;
  registeredCapabilities: number;
  activeAgents: number;
  activeTools: number;
  activeWorkflows: number;
  healthyCapabilities: number;
  securityScore: number;
  reasoningScore: number;
  collaborationScore: number;
  platformScore: number;
  capabilityStatus: Record<
    AiAgentOsV2Capability,
    AgentCapabilityOperationalStatus
  >;
}