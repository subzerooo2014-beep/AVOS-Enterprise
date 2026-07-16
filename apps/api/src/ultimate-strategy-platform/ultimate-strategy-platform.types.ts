export type UltimateStrategyPlatformCapability =
  | "STRATEGIC_PORTFOLIO_MANAGER"
  | "INVESTMENT_ANALYZER"
  | "MA_CENTER"
  | "VENTURE_STUDIO"
  | "FUTURE_SCENARIO_CENTER"
  | "TRANSFORMATION_OFFICE"
  | "PLATFORM_MATURITY_DASHBOARD"
  | "ULTIMATE_COMMAND_CENTER"
  | "STRATEGIC_RISK_RADAR"
  | "EXECUTIVE_EVIDENCE";

export interface UltimateStrategyPlatformRecord {
  id: string;
  capability: UltimateStrategyPlatformCapability;
  status: "READY" | "ACTIVE" | "COMPLETED";
  createdAt: string;
  metadata?: Record<string, unknown>;
}