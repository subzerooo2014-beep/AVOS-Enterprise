import { Injectable } from '@nestjs/common';
import {
  PRODUCTION_HARDENING_CAPABILITIES,
  ProductionHardeningDashboardSnapshot,
} from './production-hardening.types';

@Injectable()
export class ProductionHardeningDashboardService {
  snapshot(
    input: Partial<ProductionHardeningDashboardSnapshot> = {},
  ): ProductionHardeningDashboardSnapshot {
    return {
      generatedAt: new Date().toISOString(),
      securityScore: Math.max(
        0,
        Math.min(100, Math.round(input.securityScore ?? 0)),
      ),
      performanceScore: Math.max(
        0,
        Math.min(100, Math.round(input.performanceScore ?? 0)),
      ),
      scalabilityScore: Math.max(
        0,
        Math.min(100, Math.round(input.scalabilityScore ?? 0)),
      ),
      reliabilityScore: Math.max(
        0,
        Math.min(100, Math.round(input.reliabilityScore ?? 0)),
      ),
      recoveryScore: Math.max(
        0,
        Math.min(100, Math.round(input.recoveryScore ?? 0)),
      ),
      observabilityScore: Math.max(
        0,
        Math.min(100, Math.round(input.observabilityScore ?? 0)),
      ),
      productionReadinessScore: Math.max(
        0,
        Math.min(
          100,
          Math.round(input.productionReadinessScore ?? 0),
        ),
      ),
      capabilityStatus: Object.fromEntries(
        PRODUCTION_HARDENING_CAPABILITIES.map(
          (capability) => [capability, 'operational'],
        ),
      ) as ProductionHardeningDashboardSnapshot['capabilityStatus'],
    };
  }
}