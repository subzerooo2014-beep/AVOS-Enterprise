import { Injectable } from '@nestjs/common';
import {
  ENTERPRISE_VALUE_OPTIMIZATION_CAPABILITIES,
  OptimizationDashboardSnapshot,
} from './enterprise-value-optimization.types';

@Injectable()
export class EnterpriseOptimizationDashboardService {
  snapshot(input: {
    enterpriseValueScore?: number;
    performanceScore?: number;
    costEfficiency?: number;
    profitabilityScore?: number;
    roiScore?: number;
    optimizationOpportunityValue?: number;
  } = {}): OptimizationDashboardSnapshot {
    return {
      generatedAt: new Date().toISOString(),
      enterpriseValueScore: Math.max(
        0,
        Math.min(100, Math.round(input.enterpriseValueScore ?? 75)),
      ),
      performanceScore: Math.max(
        0,
        Math.min(100, Math.round(input.performanceScore ?? 75)),
      ),
      costEfficiency: Math.max(
        0,
        Math.min(100, Math.round(input.costEfficiency ?? 75)),
      ),
      profitabilityScore: Math.max(
        0,
        Math.min(100, Math.round(input.profitabilityScore ?? 75)),
      ),
      roiScore: Math.max(
        0,
        Math.min(100, Math.round(input.roiScore ?? 75)),
      ),
      optimizationOpportunityValue: Math.max(
        0,
        Math.round(input.optimizationOpportunityValue ?? 0),
      ),
      capabilityStatus: Object.fromEntries(
        ENTERPRISE_VALUE_OPTIMIZATION_CAPABILITIES.map((capability) => [
          capability,
          'operational',
        ]),
      ) as OptimizationDashboardSnapshot['capabilityStatus'],
    };
  }
}