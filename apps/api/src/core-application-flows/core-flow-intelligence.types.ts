export type FlowRecommendation = {
  id: string;
  executionId: string;
  category: string;
  title: string;
  rationale: string;
  confidence: number;
  priority: number;
  createdAt: string;
};

export type FlowAnomaly = {
  id: string;
  executionId: string;
  metric: string;
  actual: number;
  expected: number;
  deviation: number;
  severity: "low" | "medium" | "high" | "critical";
  detectedAt: string;
};

export type FlowForecast = {
  id: string;
  flow: string;
  horizon: string;
  expectedVolume: number;
  expectedDurationMs: number;
  confidence: number;
  generatedAt: string;
};

export type FlowOptimizationPlan = {
  id: string;
  flow: string;
  objective: string;
  actions: string[];
  expectedImprovementPercent: number;
  status: "draft" | "approved" | "executed";
  createdAt: string;
};
