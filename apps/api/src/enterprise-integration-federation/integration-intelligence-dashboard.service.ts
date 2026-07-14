import { Injectable } from '@nestjs/common';
import {
  ENTERPRISE_INTEGRATION_FEDERATION_CAPABILITIES,
  IntegrationDashboardSnapshot,
} from './enterprise-integration-federation.types';

@Injectable()
export class IntegrationIntelligenceDashboardService {
  snapshot(input: {
    integrationHealth?: number;
    activeConnectors?: number;
    federationHealth?: number;
    synchronizationScore?: number;
    securityScore?: number;
    connectedRegions?: number;
  } = {}): IntegrationDashboardSnapshot {
    return {
      generatedAt: new Date().toISOString(),
      integrationHealth: Math.max(
        0,
        Math.min(100, Math.round(input.integrationHealth ?? 75)),
      ),
      activeConnectors: Math.max(
        0,
        Math.round(input.activeConnectors ?? 0),
      ),
      federationHealth: Math.max(
        0,
        Math.min(100, Math.round(input.federationHealth ?? 75)),
      ),
      synchronizationScore: Math.max(
        0,
        Math.min(100, Math.round(input.synchronizationScore ?? 75)),
      ),
      securityScore: Math.max(
        0,
        Math.min(100, Math.round(input.securityScore ?? 75)),
      ),
      connectedRegions: Math.max(
        0,
        Math.round(input.connectedRegions ?? 0),
      ),
      capabilityStatus: Object.fromEntries(
        ENTERPRISE_INTEGRATION_FEDERATION_CAPABILITIES.map((capability) => [
          capability,
          'operational',
        ]),
      ) as IntegrationDashboardSnapshot['capabilityStatus'],
    };
  }
}