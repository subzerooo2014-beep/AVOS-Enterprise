import { Injectable } from '@nestjs/common';
import {
  ReadinessCheck,
  ReleaseEvidence,
} from './foundation-production-readiness.types';
import { ProductionReadinessAssessorService } from './production-readiness-assessor.service';
import { FoundationEvidenceRegistryService } from './foundation-evidence-registry.service';

@Injectable()
export class ReleaseGateOrchestratorService {
  constructor(
    private readonly readiness: ProductionReadinessAssessorService,
    private readonly evidence: FoundationEvidenceRegistryService,
  ) {}

  evaluate(
    checks: ReadinessCheck[],
    evidence: ReleaseEvidence[],
  ) {
    for (const item of evidence) {
      this.evidence.register(item);
    }

    const readiness = this.readiness.assess(checks);
    const registry = this.evidence.summary();

    return {
      readiness,
      evidence: registry,
      releaseApproved:
        readiness.status === 'ready' &&
        registry.unverified.length === 0,
    };
  }
}