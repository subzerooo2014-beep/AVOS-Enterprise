export type EnterpriseKnowledgeMemoryG7Capability =
  | "ENTERPRISE_DIGITAL_MEMORY"
  | "KNOWLEDGE_GRAPH"
  | "BUSINESS_DNA"
  | "DECISION_MEMORY"
  | "SEMANTIC_SEARCH"
  | "KNOWLEDGE_GOVERNANCE"
  | "EXPERTISE_DISCOVERY"
  | "LEARNING_ORCHESTRATION"
  | "LEGACY_PRESERVATION"
  | "CONTEXT_MEMORY"
  | "KNOWLEDGE_SYNTHESIS"
  | "MEMORY_EVIDENCE";

export interface EnterpriseKnowledgeMemoryG7Record {
  id: string;
  capability: EnterpriseKnowledgeMemoryG7Capability;
  status: "READY" | "ACTIVE" | "COMPLETED";
  createdAt: string;
  metadata?: Record<string, unknown>;
}