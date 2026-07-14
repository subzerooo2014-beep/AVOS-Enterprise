export const ENTERPRISE_VALUE_OPTIMIZATION_CAPABILITIES = [
  'enterprise-value-intelligence-engine',
  'business-performance-intelligence',
  'continuous-optimization-engine',
  'enterprise-bottleneck-analyzer',
  'resource-efficiency-optimizer',
  'enterprise-cost-intelligence',
  'revenue-intelligence-engine',
  'profitability-intelligence',
  'enterprise-roi-intelligence',
  'enterprise-value-forecast-engine',
  'performance-benchmark-engine',
  'enterprise-optimization-dashboard',
] as const;

export type EnterpriseValueOptimizationCapability =
  (typeof ENTERPRISE_VALUE_OPTIMIZATION_CAPABILITIES)[number];

export interface PerformanceMetric {
  id: string;
  name: string;
  actual: number;
  target: number;
  weight: number;
  unit: string;
}

export interface CostRecord {
  id: string;
  category: string;
  amount: number;
  avoidablePercent: number;
}

export interface RevenueRecord {
  id: string;
  stream: string;
  amount: number;
  growthRate: number;
  marginPercent: number;
}

export interface ResourceUsage {
  id: string;
  resource: string;
  capacity: number;
  used: number;
  cost: number;
}

export interface ProcessStage {
  id: string;
  name: string;
  throughput: number;
  waitTime: number;
  errorRate: number;
}

export interface OptimizationAction {
  id: string;
  area: string;
  action: string;
  expectedValue: number;
  effort: number;
  confidence: number;
}

export interface ValueForecast {
  horizonDays: number;
  currentValue: number;
  projectedValue: number;
  projectedGrowthPercent: number;
  confidence: number;
}

export interface OptimizationDashboardSnapshot {
  generatedAt: string;
  enterpriseValueScore: number;
  performanceScore: number;
  costEfficiency: number;
  profitabilityScore: number;
  roiScore: number;
  optimizationOpportunityValue: number;
  capabilityStatus: Record<
    EnterpriseValueOptimizationCapability,
    'operational'
  >;
}