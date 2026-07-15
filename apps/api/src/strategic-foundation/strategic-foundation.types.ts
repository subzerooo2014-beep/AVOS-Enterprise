export type StrategicDomain =
  | "CORE_PLATFORM"
  | "BUSINESS"
  | "GOVERNANCE"
  | "EXECUTIVE"
  | "GROWTH"
  | "TRUST";

export type StrategicDecision =
  | "APPROVE"
  | "REJECT"
  | "REDESIGN"
  | "DEFER"
  | "REQUIRE_HUMAN_APPROVAL";

export interface StrategicCapabilityDefinition {
  key: string;
  name: string;
  domain: StrategicDomain;
  reusable: boolean;
  multiIndustry: boolean;
  constitutionalAlignment: string[];
  status: "ACTIVE" | "PLANNED" | "DEFERRED";
}

export interface StrategicRegistrySnapshot {
  platforms: string[];
  industries: string[];
  capabilities: StrategicCapabilityDefinition[];
  generatedAt: string;
}

export interface FutureDevelopmentProposal {
  tenantId: string;
  actorId: string;
  key: string;
  title: string;
  targetIndustries: string[];
  buildsOnExistingFoundation: boolean;
  reusableAcrossIndustries: boolean;
  constitutionalAlignment: string[];
  introducesDuplicateCapability: boolean;
  increasesUncontrolledComplexity: boolean;
  context?: Record<string, unknown>;
}

export interface FutureDevelopmentEvaluation {
  id: string;
  proposalKey: string;
  decision: StrategicDecision;
  score: number;
  reasons: string[];
  requiredActions: string[];
  humanFinalDecisionRequired: boolean;
  createdAt: string;
}

export interface ExecutiveStrategicBrief {
  id: string;
  tenantId: string;
  objective: string;
  platformReadiness: number;
  growthReadiness: number;
  trustReadiness: number;
  governanceReadiness: number;
  recommendations: string[];
  humanFinalDecisionRequired: true;
  createdAt: string;
}

export interface StrategicAuditRecord {
  id: string;
  tenantId: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  payload: Record<string, unknown>;
  createdAt: string;
}