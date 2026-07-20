import { Injectable } from '@nestjs/common';
import { PlatformCertificationService } from './platform-certification.service';
import { PlatformClosureReviewService } from './platform-closure-review.service';
import { Pack6Status } from './platform-closure.types';
import { ProductionReadinessService } from './production-readiness.service';

@Injectable()
export class Pack6Service {
  constructor(
    private readonly review: PlatformClosureReviewService,
    private readonly readiness: ProductionReadinessService,
    private readonly certification: PlatformCertificationService,
  ) {}

  status(): Pack6Status {
    const latestReview = this.review.getLatest();
    const latestReadiness = this.readiness.getLatest();
    const latestCertification = this.certification.getLatest();

    let platformState: Pack6Status['platformState'] = 'awaiting-review';

    if (latestReview) {
      platformState = 'reviewed';
    }

    if (
      latestReview?.status === 'passed' &&
      latestReadiness?.status === 'ready'
    ) {
      platformState = 'ready-for-certification';
    }

    if (latestCertification?.status === 'certified') {
      platformState = 'certified';
    }

    return {
      name: 'AVOS Unified Platform Closure',
      version: 'PC-P6-1.0.0',
      status: 'operational',
      layer: 'Unified Platform Closure, Certification & Production Readiness',
      platformState,
      latestReview,
      latestReadiness,
      latestCertification,
      controls: {
        unifiedCrossPackReview: true,
        architectureClosure: true,
        governanceClosure: true,
        learningClosure: true,
        organizationClosure: true,
        executionClosure: true,
        knowledgeClosure: true,
        operationsClosure: true,
        productionReadinessGate: true,
        humanFinalAuthority: true,
        globalComplianceReadinessGate: true,
        noCertificationWithBlockers: true,
        immutableCertificationEvidence: true,
      },
    };
  }
}