export type UltimatePlatformCapability =
  | "ENTERPRISE_DIGITAL_TWIN"
  | "SIMULATION_CENTER"
  | "AI_RESEARCH_LAB"
  | "INNOVATION_MARKETPLACE"
  | "ENTERPRISE_BENCHMARK_CENTER"
  | "GLOBAL_KPI_OBSERVATORY"
  | "STRATEGIC_PORTFOLIO_MANAGER"
  | "ENTERPRISE_INVESTMENT_ANALYZER"
  | "ENTERPRISE_MA_CENTER"
  | "CORPORATE_VENTURE_STUDIO"
  | "INNOVATION_PIPELINE"
  | "IDEA_VALIDATION_ENGINE"
  | "ENTERPRISE_SCORECARDS"
  | "EXECUTIVE_COCKPIT"
  | "BOARD_INTELLIGENCE"
  | "CORPORATE_PLANNING_CENTER"
  | "LONG_TERM_ROADMAP_MANAGER"
  | "CAPABILITY_HEATMAP"
  | "PLATFORM_MATURITY_DASHBOARD"
  | "ENTERPRISE_MISSION_CONTROL"
  | "UNIFIED_OPERATIONS_HUB"
  | "GLOBAL_EXECUTIVE_DASHBOARD"
  | "STRATEGIC_INTELLIGENCE_CENTER"
  | "ENTERPRISE_INSIGHTS_HUB"
  | "FUTURE_SCENARIO_CENTER"
  | "TRANSFORMATION_OFFICE"
  | "EXECUTION_EXCELLENCE"
  | "PORTFOLIO_GOVERNANCE"
  | "INNOVATION_GOVERNANCE"
  | "ULTIMATE_COMMAND_CENTER";

export interface UltimatePortfolioItem {
  id: string;
  tenantId: string;
  capability: UltimatePlatformCapability;
  code: string;
  name: string;
  owner: string;
  objective: string;
  investmentAmount: number;
  currency: string;
  strategicScore: number;
  maturityScore: number;
  riskScore: number;
  status: "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

export interface UltimateScenario {
  id: string;
  portfolioItemId: string;
  name: string;
  assumptions: Record<string, string | number | boolean>;
  projectedValue: number;
  projectedRisk: number;
  recommendation: string;
  createdAt: string;
}

export interface UltimateScorecard {
  id: string;
  portfolioItemId: string;
  kpiName: string;
  targetValue: number;
  actualValue: number;
  unit: string;
  status: "ON_TRACK" | "AT_RISK" | "OFF_TRACK";
  recordedAt: string;
}