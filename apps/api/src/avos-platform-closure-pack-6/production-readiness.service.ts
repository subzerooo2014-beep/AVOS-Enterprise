import { Injectable } from '@nestjs/common';
import { PlatformClosureReviewService } from './platform-closure-review.service';
import {
  ProductionReadinessAssessment,
} from './platform-closure.types';

@Injectable()
export class ProductionReadinessService {
  private latest?: ProductionReadinessAssessment;

  constructor(
    private readonly reviewService: PlatformClosureReviewService,
  ) {}

  assess(): ProductionReadinessAssessment {
    const review =
      this.reviewService.getLatest() ?? this.reviewService.run();

    const dimensions = {
      architecture: this.scoreFor(review, 'inventory'),
      governance: this.scoreFor(review, 'cognitive-governance'),
      learning: this.scoreFor(review, 'living-memory'),
      organization: this.scoreFor(review, 'digital-organization'),
      execution: this.scoreFor(review, 'execution-runtime'),
      knowledge: this.scoreFor(review, 'knowledge-runtime'),
      operations: this.scoreFor(review, 'operations-runtime'),
      compliance: this.scoreFor(review, 'global-compliance'),
      observability: this.scoreFor(review, 'operational-safety'),
      recovery: this.scoreFor(review, 'operational-safety'),
    };

    const values = Object.values(dimensions);
    const score = Math.round(
      values.reduce((sum, value) => sum + value, 0) / values.length,
    );

    const blockers = [...review.blockingIssues];

    const recommendations =
      blockers.length === 0
        ? [
            'Preserve certification evidence.',
            'Continue production observability.',
            'Require human approval for future strategic changes.',
          ]
        : blockers.map((blocker) => `Resolve blocker: ${blocker}`);

    this.latest = {
      id: `production-readiness-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      status: score === 100 && blockers.length === 0 ? 'ready' : 'not-ready',
      score,
      dimensions,
      blockers,
      recommendations,
      generatedAt: new Date().toISOString(),
    };

    return this.clone(this.latest);
  }

  getLatest(): ProductionReadinessAssessment | undefined {
    return this.latest ? this.clone(this.latest) : undefined;
  }

  private scoreFor(
    review: ReturnType<PlatformClosureReviewService['run']>,
    key: string,
  ): number {
    return review.checks.find((check) => check.key === key)?.score ?? 0;
  }

  private clone(
    assessment: ProductionReadinessAssessment,
  ): ProductionReadinessAssessment {
    return JSON.parse(
      JSON.stringify(assessment),
    ) as ProductionReadinessAssessment;
  }
}