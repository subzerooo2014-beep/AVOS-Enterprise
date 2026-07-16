export type IntelligenceComponentType =
  | "AI_CORE"
  | "DECISION"
  | "RECOMMENDATION"
  | "RISK"
  | "RULE"
  | "MODEL"
  | "PROMPT"
  | "FEATURE"
  | "AGENT"
  | "ANALYTICS"
  | "UNKNOWN";

export interface IntelligenceComponentRecord {
  id: string;
  name: string;
  type: IntelligenceComponentType;
  filePath: string;
  domain: string;
  version: string;
  capabilities: string[];
  dependencies: string[];
  status: "DISCOVERED" | "ACTIVE";
  discoveredAt: string;
}

export interface DecisionRequest {
  id?: string;
  domain: string;
  action: string;
  context: Record<string, unknown>;
  correlationId?: string;
}

export interface DecisionResult {
  id: string;
  requestId: string;
  domain: string;
  action: string;
  outcome: "APPROVE" | "REJECT" | "REVIEW" | "NO_DECISION";
  confidence: number;
  reasons: string[];
  appliedRules: string[];
  modelId?: string;
  createdAt: string;
}

export interface IntelligenceRule {
  id: string;
  name: string;
  domain: string;
  version: string;
  priority: number;
  enabled: boolean;
  condition: Record<string, unknown>;
  effect: "APPROVE" | "REJECT" | "REVIEW";
}

export interface IntelligenceModelRecord {
  id: string;
  name: string;
  provider: string;
  version: string;
  status: "ACTIVE" | "INACTIVE" | "EXPERIMENTAL";
  capabilities: string[];
}

export interface PromptTemplateRecord {
  id: string;
  name: string;
  version: string;
  template: string;
  variables: string[];
  enabled: boolean;
}

export interface FeatureRecord {
  key: string;
  entityId: string;
  value: unknown;
  version: number;
  updatedAt: string;
}

export interface IntelligenceMetrics {
  components: number;
  decisions: number;
  approvals: number;
  rejections: number;
  reviews: number;
  rules: number;
  models: number;
  prompts: number;
  features: number;
}

export interface IntelligenceHealth {
  success: boolean;
  system: string;
  version: string;
  status: "READY" | "DEGRADED";
  metrics: IntelligenceMetrics;
  components: Record<string, string>;
}
