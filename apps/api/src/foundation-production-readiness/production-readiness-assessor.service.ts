import { Injectable } from '@nestjs/common';
import {
  ReadinessCheck,
  ReadinessStatus,
} from './foundation-production-readiness.types';

@Injectable()
export class ProductionReadinessAssessorService {
  assess(checks: ReadinessCheck[]) {
    const score = Math.round(
      checks.reduce((sum, check) => sum + check.score, 0) /
        Math.max(1, checks.length),
    );
    const blockers = checks.flatMap((check) => check.blockers);
    const failedRequired = checks.filter((check) => !check.passed);

    const status: ReadinessStatus =
      blockers.length > 0 || score < 70
        ? 'blocked'
        : failedRequired.length > 0 || score < 90
          ? 'conditional'
          : 'ready';

    return {
      score,
      status,
      blockers,
      failedChecks: failedRequired.map((check) => check.id),
      passedChecks: checks
        .filter((check) => check.passed)
        .map((check) => check.id),
    };
  }
}