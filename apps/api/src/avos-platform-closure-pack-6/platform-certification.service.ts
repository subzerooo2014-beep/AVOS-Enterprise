import { Injectable } from '@nestjs/common';
import { PlatformClosureReviewService } from './platform-closure-review.service';
import { ProductionReadinessService } from './production-readiness.service';
import {
  PlatformClosureCertification,
} from './platform-closure.types';

@Injectable()
export class PlatformCertificationService {
  private latest?: PlatformClosureCertification;
  private readonly history: PlatformClosureCertification[] = [];

  constructor(
    private readonly reviewService: PlatformClosureReviewService,
    private readonly readinessService: ProductionReadinessService,
  ) {}

  certify(approvedBy: string): PlatformClosureCertification {
    if (!approvedBy.toLowerCase().startsWith('human:')) {
      throw new Error('Platform closure certification requires Human Final Authority.');
    }

    const review =
      this.reviewService.getLatest() ?? this.reviewService.run();
    const readiness =
      this.readinessService.getLatest() ??
      this.readinessService.assess();

    if (
      review.status !== 'passed' ||
      review.score !== 100 ||
      review.blockingIssues.length > 0
    ) {
      throw new Error('Platform closure review has blocking issues.');
    }

    if (readiness.status !== 'ready' || readiness.score !== 100) {
      throw new Error('Platform is not production ready.');
    }

    this.latest = {
      id: `platform-closure-certification-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      name: 'AVOS Unified Platform Closure Certification',
      version: 'PC-P6-1.0.0',
      status: 'certified',
      score: 100,
      approvedBy,
      reviewId: review.id,
      readinessId: readiness.id,
      checks: {
        inventoryComplete: true,
        cognitiveGovernanceOperational: true,
        livingMemoryOperational: true,
        digitalOrganizationOperational: true,
        executionRuntimeOperational: true,
        knowledgeRuntimeOperational: true,
        autonomousOperationsOperational: true,
        humanFinalAuthority: true,
        livingVisionAlignment: true,
        globalComplianceReadinessGate: true,
        productionReadiness: true,
        noBlockingIssues: true,
      },
      certifiedAt: new Date().toISOString(),
    };

    this.history.push(
      JSON.parse(
        JSON.stringify(this.latest),
      ) as PlatformClosureCertification,
    );

    return this.clone(this.latest);
  }

  getLatest(): PlatformClosureCertification | undefined {
    return this.latest ? this.clone(this.latest) : undefined;
  }

  list(): PlatformClosureCertification[] {
    return this.history.map((item) => this.clone(item));
  }

  private clone(
    certification: PlatformClosureCertification,
  ): PlatformClosureCertification {
    return JSON.parse(
      JSON.stringify(certification),
    ) as PlatformClosureCertification;
  }
}