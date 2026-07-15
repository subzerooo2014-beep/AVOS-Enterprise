export type IntelligenceCapability =
  | "ENTERPRISE_BRAIN"
  | "DECISION_GRAPH"
  | "KNOWLEDGE_MEMORY"
  | "AGENT_ORCHESTRATION"
  | "SCENARIO_SIMULATION"
  | "PREDICTIVE_INTELLIGENCE"
  | "STRATEGIC_PLANNING"
  | "RISK_INTELLIGENCE"
  | "MARKET_INTELLIGENCE"
  | "CUSTOMER_INTELLIGENCE"
  | "OPERATIONS_INTELLIGENCE"
  | "FINANCIAL_INTELLIGENCE"
  | "ECOSYSTEM_INTELLIGENCE"
  | "POLICY_INTELLIGENCE"
  | "REGULATORY_INTELLIGENCE"
  | "EXPLAINABILITY"
  | "AI_GOVERNANCE"
  | "MODEL_REGISTRY"
  | "PROMPT_REGISTRY"
  | "TOOL_REGISTRY"
  | "AGENT_REGISTRY"
  | "MEMORY_REGISTRY"
  | "KNOWLEDGE_GRAPH"
  | "DECISION_AUDIT"
  | "HUMAN_APPROVAL"
  | "AUTONOMOUS_EXECUTION"
  | "LEARNING_FEEDBACK"
  | "QUALITY_EVALUATION"
  | "INTELLIGENCE_HEALTH"
  | "INTELLIGENCE_COMMAND_CENTER";

export interface IntelligenceNode {
  id: string;
  tenantId: string;
  capability: IntelligenceCapability;
  code: string;
  name: string;
  nodeType: "MODEL" | "AGENT" | "TOOL" | "MEMORY" | "POLICY" | "DECISION" | "KNOWLEDGE";
  status: "DRAFT" | "ACTIVE" | "SUSPENDED" | "RETIRED";
  version: string;
  owner: string;
  metadata: Record<string, string | number | boolean>;
  createdAt: string;
  updatedAt: string;
}

export interface IntelligenceDecision {
  id: string;
  tenantId: string;
  subjectId: string;
  decisionType: string;
  requestedBy: string;
  confidence: number;
  outcome: string;
  reasoningSummary: string;
  factors: string[];
  requiresApproval: boolean;
  approvalStatus: "NOT_REQUIRED" | "PENDING" | "APPROVED" | "REJECTED";
  executionStatus: "NOT_STARTED" | "RUNNING" | "COMPLETED" | "FAILED";
  createdAt: string;
  updatedAt: string;
}

export interface IntelligenceScenario {
  id: string;
  tenantId: string;
  name: string;
  assumptions: Record<string, string | number | boolean>;
  projectedOutcomes: Record<string, number>;
  riskScore: number;
  opportunityScore: number;
  recommendation: string;
  createdAt: string;
}

export interface IntelligenceFeedback {
  id: string;
  decisionId: string;
  actualOutcome: string;
  score: number;
  notes: string;
  createdAt: string;
}