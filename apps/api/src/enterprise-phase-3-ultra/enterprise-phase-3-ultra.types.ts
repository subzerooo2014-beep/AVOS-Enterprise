export type Phase3Status = "READY" | "RUNNING" | "COMPLETED" | "BLOCKED";

export interface KnowledgeNode {
  id: string;
  type: string;
  key: string;
  value: string;
  confidence: number;
  createdAt: string;
}

export interface PartnerNode {
  id: string;
  name: string;
  role: string;
  trustScore: number;
  active: boolean;
}

export interface RegulationRule {
  id: string;
  jurisdiction: string;
  domain: string;
  rule: string;
  active: boolean;
}

export interface Phase3Execution {
  id: string;
  name: string;
  status: Phase3Status;
  score: number;
  startedAt: string;
  completedAt?: string;
}