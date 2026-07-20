export interface EnterpriseIntegrationRecord {
  id: string;
  name: string;
  category:
    | "crm"
    | "marketplace"
    | "media"
    | "finance"
    | "workflow"
    | "notification"
    | "analytics"
    | "event";
  boundary: "adapter";
  status: "configured" | "operational" | "degraded";
  capabilities: string[];
  lastCheckedAt: string;
}

export interface ExecutiveGrowthDashboard {
  name: string;
  version: string;
  score: number;
  summary: {
    campaigns: number;
    activeCampaigns: number;
    experiments: number;
    revenue: number;
    forecast: number;
    attributedRevenue: number;
    integrationsHealthy: number;
    integrationsTotal: number;
  };
  alerts: string[];
  recommendations: string[];
  humanFinalAuthority: boolean;
  globalComplianceReadinessGate: boolean;
  generatedAt: string;
}

export interface AgpPack46Verification {
  id: string;
  status: "passed" | "failed";
  score: number;
  checks: Record<string, boolean>;
  findings: string[];
  generatedAt: string;
}

export interface AgpPack46Certification {
  id: string;
  name: string;
  version: string;
  status: "certified" | "rejected";
  score: number;
  checks: Record<string, boolean>;
  blockingFindings: string[];
  approvedBy: string;
  certifiedAt: string;
  generatedAt: string;
}