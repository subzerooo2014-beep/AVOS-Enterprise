import { Injectable } from '@nestjs/common';
import {
  PRODUCTION_RELEASE_CAPABILITIES,
  ProductionReleaseDashboardSnapshot,
} from './production-release.types';

@Injectable()
export class ProductionReleaseDashboardService {
  snapshot(
    input: Partial<ProductionReleaseDashboardSnapshot> = {},
  ): ProductionReleaseDashboardSnapshot {
    const clamp = (value: number) =>
      Math.max(0, Math.min(100, Math.round(value)));

    return {
      generatedAt: new Date().toISOString(),
      buildScore: clamp(input.buildScore ?? 0),
      testScore: clamp(input.testScore ?? 0),
      certificationScore: clamp(input.certificationScore ?? 0),
      artifactScore: clamp(input.artifactScore ?? 0),
      approvalScore: clamp(input.approvalScore ?? 0),
      releaseScore: clamp(input.releaseScore ?? 0),
      releaseStatus: input.releaseStatus ?? 'pending',
      capabilityStatus: Object.fromEntries(
        PRODUCTION_RELEASE_CAPABILITIES.map(
          (capability) => [capability, 'operational'],
        ),
      ) as ProductionReleaseDashboardSnapshot['capabilityStatus'],
    };
  }
}