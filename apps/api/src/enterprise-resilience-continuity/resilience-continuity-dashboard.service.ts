import { Injectable } from '@nestjs/common';
import {
  ENTERPRISE_RESILIENCE_CONTINUITY_CAPABILITIES,
  ResilienceDashboardSnapshot,
} from './enterprise-resilience-continuity.types';

@Injectable()
export class ResilienceContinuityDashboardService {
  snapshot(input: {
    resilienceScore?: number;
    riskExposure?: number;
    continuityReadiness?: number;
    activeIncidents?: number;
    recoveryCapacity?: number;
  } = {}): ResilienceDashboardSnapshot {
    return {
      generatedAt: new Date().toISOString(),
      resilienceScore: Math.max(
        0,
        Math.min(100, Math.round(input.resilienceScore ?? 75)),
      ),
      riskExposure: Math.max(
        0,
        Math.round(input.riskExposure ?? 0),
      ),
      continuityReadiness: Math.max(
        0,
        Math.min(100, Math.round(input.continuityReadiness ?? 75)),
      ),
      activeIncidents: Math.max(
        0,
        Math.round(input.activeIncidents ?? 0),
      ),
      recoveryCapacity: Math.max(
        0,
        Math.min(100, Math.round(input.recoveryCapacity ?? 75)),
      ),
      capabilityStatus: Object.fromEntries(
        ENTERPRISE_RESILIENCE_CONTINUITY_CAPABILITIES.map((capability) => [
          capability,
          'operational',
        ]),
      ) as ResilienceDashboardSnapshot['capabilityStatus'],
    };
  }
}