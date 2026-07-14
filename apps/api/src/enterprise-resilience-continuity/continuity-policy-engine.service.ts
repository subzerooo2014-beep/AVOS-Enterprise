import { Injectable } from '@nestjs/common';
import {
  ContinuityPolicy,
  CriticalDependency,
} from './enterprise-resilience-continuity.types';

@Injectable()
export class ContinuityPolicyEngineService {
  evaluate(
    dependencies: CriticalDependency[],
    policies: ContinuityPolicy[],
  ) {
    const violations = dependencies.flatMap((dependency) =>
      policies.flatMap((policy) => {
        const dependencyViolations: string[] = [];

        if (
          dependency.recoveryTimeObjectiveMinutes >
          policy.maximumRecoveryTimeMinutes
        ) {
          dependencyViolations.push(
            `${dependency.id}:${policy.id}:rto-exceeded`,
          );
        }

        return dependencyViolations;
      }),
    );

    return {
      compliant: violations.length === 0,
      violations,
      executiveApprovalRequired: policies.some(
        (policy) => policy.requiresExecutiveApproval,
      ),
    };
  }
}