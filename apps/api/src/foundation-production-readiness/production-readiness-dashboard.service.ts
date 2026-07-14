import { Injectable } from '@nestjs/common';
import {
  FOUNDATION_PRODUCTION_READINESS_CAPABILITIES,
  FoundationReadinessDashboardSnapshot,
  ReadinessStatus,
} from './foundation-production-readiness.types';

@Injectable()
export class ProductionReadinessDashboardService {
  snapshot(input: {
    foundationScore?: number;
    architectureScore?: number;
    securityScore?: number;
    dataScore?: number;
    operationsScore?: number;
    releaseStatus?: ReadinessStatus;
  } = {}): FoundationReadinessDashboardSnapshot {
    return {
      generatedAt: new Date().toISOString(),
      foundationScore: Math.max(
        0,
        Math.min(100, Math.round(input.foundationScore ?? 75)),
      ),
      architectureScore: Math.max(
        0,
        Math.min(100, Math.round(input.architectureScore ?? 75)),
      ),
      securityScore: Math.max(
        0,
        Math.min(100, Math.round(input.securityScore ?? 75)),
      ),
      dataScore: Math.max(
        0,
        Math.min(100, Math.round(input.dataScore ?? 75)),
      ),
      operationsScore: Math.max(
        0,
        Math.min(100, Math.round(input.operationsScore ?? 75)),
      ),
      releaseStatus: input.releaseStatus ?? 'conditional',
      capabilityStatus: Object.fromEntries(
        FOUNDATION_PRODUCTION_READINESS_CAPABILITIES.map(
          (capability) => [capability, 'operational'],
        ),
      ) as FoundationReadinessDashboardSnapshot['capabilityStatus'],
    };
  }
}