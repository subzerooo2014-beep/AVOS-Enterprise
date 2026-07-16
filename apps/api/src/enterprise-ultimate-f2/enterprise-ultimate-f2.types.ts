export type F2Capability =
  | "AI_COMMAND_CENTER_V2"
  | "ENTERPRISE_DECISION_CENTER"
  | "EXECUTIVE_DASHBOARD"
  | "CEO_WORKSPACE"
  | "AI_MISSION_CENTER"
  | "SMART_NOTIFICATION_ENGINE_V2"
  | "ENTERPRISE_KPI_DASHBOARD"
  | "ENTERPRISE_LIVE_TIMELINE"
  | "BUSINESS_HEALTH_MONITOR"
  | "REVENUE_INTELLIGENCE"
  | "COST_INTELLIGENCE"
  | "PROFIT_INTELLIGENCE"
  | "CUSTOMER_INTELLIGENCE"
  | "VEHICLE_INTELLIGENCE_DASHBOARD"
  | "SALES_INTELLIGENCE_DASHBOARD"
  | "MARKETING_INTELLIGENCE_DASHBOARD"
  | "FINANCE_INTELLIGENCE_DASHBOARD"
  | "OPERATIONS_INTELLIGENCE_DASHBOARD"
  | "INVENTORY_INTELLIGENCE_DASHBOARD"
  | "RISK_INTELLIGENCE_DASHBOARD"
  | "ENTERPRISE_AI_INBOX"
  | "ENTERPRISE_AI_TASKS"
  | "ENTERPRISE_ACTION_CENTER"
  | "EXECUTIVE_REPORTS_ENGINE"
  | "ENTERPRISE_INSIGHTS_ENGINE"
  | "STRATEGY_DASHBOARD"
  | "GOAL_TRACKING_ENGINE"
  | "OKR_DASHBOARD"
  | "EXECUTIVE_ANALYTICS"
  | "LIVE_ENTERPRISE_METRICS";

export interface F2Metric {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  category: string;
  value: number;
  target?: number;
  unit: string;
  status: "HEALTHY" | "ATTENTION" | "CRITICAL";
  recordedAt: string;
}

export interface F2Decision {
  id: string;
  tenantId: string;
  title: string;
  decisionType: string;
  rationale: string;
  confidence: number;
  impact: number;
  approved: boolean;
  executed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface F2Task {
  id: string;
  tenantId: string;
  title: string;
  owner: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "OPEN" | "RUNNING" | "COMPLETED" | "FAILED";
  dueAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface F2Insight {
  id: string;
  tenantId: string;
  insightType: string;
  title: string;
  summary: string;
  confidence: number;
  actions: string[];
  createdAt: string;
}

export interface F2Goal {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  target: number;
  actual: number;
  unit: string;
  progress: number;
  status: "ON_TRACK" | "AT_RISK" | "OFF_TRACK";
  createdAt: string;
  updatedAt: string;
}