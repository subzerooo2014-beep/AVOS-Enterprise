export type AgsLiveIntelligence = {
  status: "operational" | "degraded";
  freshness: {
    generatedAt: string;
    maxSourceAgeSeconds: number;
  };
  sources: Array<{
    source: string;
    status: string;
    endpoint: string;
    latencyMs: number;
    observedAt: string;
    error?: string;
  }>;
  metrics: Array<{
    id: string;
    title: string;
    value: string | number;
    trend: number;
    status: "positive" | "neutral" | "warning";
    source: string;
    evidence: string[];
  }>;
  opportunities: Array<{
    id: string;
    title: string;
    score: number;
    confidence: number;
    source: string;
    rationale: string;
    requiresHumanApproval: boolean;
  }>;
  recommendations: Array<{
    id: string;
    title: string;
    confidence: number;
    impact: string;
    source: string;
    requiresHumanApproval: boolean;
  }>;
  knowledge: {
    documents: number;
    entities: number;
    relationships: number;
    confidence: number;
  };
  capabilities: {
    total: number;
    healthy: number;
    degraded: number;
    readinessScore: number;
  };
  growth: {
    score: number;
    activeStrategies: number;
    activeExperiments: number;
    revenueImpact: number;
    forecastConfidence: number;
  };
  humanFinalAuthority: true;
};