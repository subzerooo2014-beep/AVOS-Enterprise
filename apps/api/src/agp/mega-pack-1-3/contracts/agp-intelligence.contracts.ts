export interface GrowthSignal {
  id: string;
  source: string;
  type: string;
  value: number;
  confidence: number;
  evidence: string[];
  observedAt: string;
}

export interface GrowthOpportunity {
  id: string;
  title: string;
  category: string;
  description: string;
  score: number;
  priority: "low" | "medium" | "high" | "critical";
  confidence: number;
  expectedImpact: number;
  risk: "low" | "medium" | "high";
  evidence: string[];
  recommendedActions: string[];
  requiresHumanApproval: boolean;
  status: "identified" | "reviewing" | "approved" | "rejected";
  createdAt: string;
}

export interface GrowthRecommendation {
  id: string;
  objective: string;
  recommendation: string;
  rationale: string[];
  confidence: number;
  expectedImpact: number;
  requiresHumanApproval: boolean;
  generatedAt: string;
}

export interface GrowthDecision {
  id: string;
  objective: string;
  selectedOption: string;
  alternatives: string[];
  rationale: string[];
  evidence: string[];
  confidence: number;
  risk: "low" | "medium" | "high";
  requiresHumanApproval: boolean;
  approvedBy?: string;
  decidedAt: string;
}