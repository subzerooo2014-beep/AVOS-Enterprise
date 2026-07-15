import { Injectable } from '@nestjs/common';
import {
  PRODUCTION_CERTIFICATION_CAPABILITIES,
  ProductionCertificationDashboardSnapshot,
} from './production-certification.types';

@Injectable()
export class ProductionCertificationDashboardService {
  snapshot(
    input: Partial<ProductionCertificationDashboardSnapshot> = {},
  ): ProductionCertificationDashboardSnapshot {
    const clamp = (value: number) =>
      Math.max(0, Math.min(100, Math.round(value)));

    return {
      generatedAt: new Date().toISOString(),
      securityScore: clamp(input.securityScore ?? 0),
      performanceScore: clamp(input.performanceScore ?? 0),
      complianceScore: clamp(input.complianceScore ?? 0),
      loadTestScore: clamp(input.loadTestScore ?? 0),
      signoffScore: clamp(input.signoffScore ?? 0),
      certificationScore: clamp(input.certificationScore ?? 0),
      releaseStatus: input.releaseStatus ?? 'pending',
      capabilityStatus: Object.fromEntries(
        PRODUCTION_CERTIFICATION_CAPABILITIES.map(
          (capability) => [capability, 'operational'],
        ),
      ) as ProductionCertificationDashboardSnapshot['capabilityStatus'],
    };
  }
}