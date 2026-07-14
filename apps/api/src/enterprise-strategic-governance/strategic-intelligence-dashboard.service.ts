import { Injectable } from '@nestjs/common';
import {
  ENTERPRISE_STRATEGIC_GOVERNANCE_CAPABILITIES,
  StrategicDashboardSnapshot,
} from './enterprise-strategic-governance.types';

@Injectable()
export class StrategicIntelligenceDashboardService {
  snapshot(input: {
    strategyScore?: number;
    objectiveCompletion?: number;
    portfolioValue?: number;
    riskExposure?: number;
    kpiHealth?: number;
  } = {}): StrategicDashboardSnapshot {
    return {
      generatedAt: new Date().toISOString(),
      strategyScore: Math.max(
        0,
        Math.min(100, Math.round(input.strategyScore ?? 75)),
      ),
      objectiveCompletion: Math.max(
        0,
        Math.min(100, Math.round(input.objectiveCompletion ?? 70)),
      ),
      portfolioValue: Math.max(0, Math.round(input.portfolioValue ?? 0)),
      riskExposure: Math.max(0, Math.round(input.riskExposure ?? 0)),
      kpiHealth: Math.max(
        0,
        Math.min(100, Math.round(input.kpiHealth ?? 75)),
      ),
      capabilityStatus: Object.fromEntries(
        ENTERPRISE_STRATEGIC_GOVERNANCE_CAPABILITIES.map((capability) => [
          capability,
          'operational',
        ]),
      ) as StrategicDashboardSnapshot['capabilityStatus'],
    };
  }
}