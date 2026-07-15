export type AutonomousEnterpriseDomain =
  | "AUTONOMOUS_AI"
  | "ENTERPRISE_SWARM"
  | "SELF_EVOLUTION"
  | "ENTERPRISE_BRAIN_V3"
  | "GLOBAL_OPERATIONS"
  | "AI_ECONOMY";

export type AutonomousCapabilityStatus =
  | "REGISTERED"
  | "ACTIVE"
  | "PAUSED"
  | "FAILED";

export interface AutonomousCapability {
  id: string;
  domain: AutonomousEnterpriseDomain;
  code: string;
  name: string;
  version: string;
  status: AutonomousCapabilityStatus;
  configuration: Record<string, string | number | boolean>;
  createdAt: string;
  updatedAt: string;
}

export interface AutonomousMission {
  id: string;
  capabilityId: string;
  objective: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "PLANNED" | "RUNNING" | "COMPLETED" | "FAILED";
  steps: string[];
  evidence: string[];
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AutonomousDecision {
  id: string;
  missionId: string;
  decisionType: string;
  rationale: string;
  confidence: number;
  approved: boolean;
  executed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AutonomousPolicy {
  id: string;
  domain: AutonomousEnterpriseDomain;
  code: string;
  rule: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AutonomousEconomyItem {
  id: string;
  itemType: "AGENT" | "CAPABILITY" | "SERVICE" | "PLUGIN" | "BLUEPRINT";
  code: string;
  name: string;
  version: string;
  price: number;
  currency: string;
  licenseType: "TRIAL" | "SUBSCRIPTION" | "PERPETUAL" | "USAGE";
  status: "DRAFT" | "PUBLISHED" | "SUSPENDED";
  createdAt: string;
  updatedAt: string;
}