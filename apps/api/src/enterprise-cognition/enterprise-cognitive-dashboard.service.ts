import { Injectable } from '@nestjs/common';
import {
  CognitiveDashboardSnapshot,
  ENTERPRISE_COGNITION_CAPABILITIES,
} from './enterprise-cognition.types';

@Injectable()
export class EnterpriseCognitiveDashboardService {
  snapshot(
    cognitionScore = 75,
    reasoningConfidence = 0.75,
    organizationalReadiness = 75,
    activeDomains = 1,
  ): CognitiveDashboardSnapshot {
    return {
      generatedAt: new Date().toISOString(),
      cognitionScore: Math.max(0, Math.min(100, Math.round(cognitionScore))),
      reasoningConfidence: Math.max(
        0,
        Math.min(100, Math.round(reasoningConfidence * 100)),
      ),
      organizationalReadiness: Math.max(
        0,
        Math.min(100, Math.round(organizationalReadiness)),
      ),
      activeDomains,
      capabilityStatus: Object.fromEntries(
        ENTERPRISE_COGNITION_CAPABILITIES.map((capability) => [
          capability,
          'operational',
        ]),
      ) as CognitiveDashboardSnapshot['capabilityStatus'],
    };
  }
}