import { Injectable } from '@nestjs/common';
import {
  EnterpriseMission,
  ExecutionPolicy,
} from './autonomous-enterprise-operations.types';

@Injectable()
export class EnterpriseExecutionPolicyEngineService {
  evaluate(
    mission: EnterpriseMission,
    policies: ExecutionPolicy[],
  ): {
    allowed: boolean;
    requiredApproval: boolean;
    violations: string[];
  } {
    const riskScore = Math.max(
      0,
      100 - mission.priority + mission.dependencies.length * 5,
    );

    const violations = policies
      .filter((policy) => riskScore > policy.maxRiskScore)
      .map((policy) => `${policy.id}:risk-threshold-exceeded`);

    return {
      allowed: violations.length === 0,
      requiredApproval: policies.some((policy) => policy.requiresApproval),
      violations,
    };
  }
}