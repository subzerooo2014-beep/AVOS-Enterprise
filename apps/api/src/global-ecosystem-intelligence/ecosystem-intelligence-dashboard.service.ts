import { Injectable } from '@nestjs/common';
import {
  EcosystemDashboardSnapshot,
  GLOBAL_ECOSYSTEM_INTELLIGENCE_CAPABILITIES,
} from './global-ecosystem-intelligence.types';

@Injectable()
export class EcosystemIntelligenceDashboardService {
  snapshot(input: {
    ecosystemHealth?: number;
    activePartners?: number;
    atRiskPartners?: number;
    trustScore?: number;
    integrationHealth?: number;
    opportunityValue?: number;
  } = {}): EcosystemDashboardSnapshot {
    return {
      generatedAt: new Date().toISOString(),
      ecosystemHealth: Math.max(
        0,
        Math.min(100, Math.round(input.ecosystemHealth ?? 75)),
      ),
      activePartners: Math.max(0, Math.round(input.activePartners ?? 0)),
      atRiskPartners: Math.max(0, Math.round(input.atRiskPartners ?? 0)),
      trustScore: Math.max(
        0,
        Math.min(100, Math.round(input.trustScore ?? 75)),
      ),
      integrationHealth: Math.max(
        0,
        Math.min(100, Math.round(input.integrationHealth ?? 75)),
      ),
      opportunityValue: Math.max(
        0,
        Math.round(input.opportunityValue ?? 0),
      ),
      capabilityStatus: Object.fromEntries(
        GLOBAL_ECOSYSTEM_INTELLIGENCE_CAPABILITIES.map((capability) => [
          capability,
          'operational',
        ]),
      ) as EcosystemDashboardSnapshot['capabilityStatus'],
    };
  }
}