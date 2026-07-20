export type AgsSourceName =
  | "adaptive-growth-platform"
  | "adaptive-growth-engine"
  | "knowledge-fabric"
  | "capability-fabric";

export interface AgsSourceSnapshot {
  source: AgsSourceName;
  status: "operational" | "degraded" | "unavailable";
  endpoint: string;
  latencyMs: number;
  observedAt: string;
  data: Record<string, unknown>;
  error?: string;
}

export interface AgsLiveMetric {
  id: string;
  title: string;
  value: string | number;
  trend: number;
  status: "positive" | "neutral" | "warning";
  source: AgsSourceName;
  evidence: string[];
}

export interface AgsLiveOpportunity {
  id: string;
  title: string;
  score: number;
  confidence: number;
  source: AgsSourceName;
  rationale: string;
  requiresHumanApproval: boolean;
}

export interface AgsLiveIntelligence {
  status: "operational" | "degraded";
  freshness: {
    generatedAt: string;
    maxSourceAgeSeconds: number;
  };
  sources: AgsSourceSnapshot[];
  metrics: AgsLiveMetric[];
  opportunities: AgsLiveOpportunity[];
  recommendations: Array<{
    id: string;
    title: string;
    confidence: number;
    impact: string;
    source: AgsSourceName;
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
}