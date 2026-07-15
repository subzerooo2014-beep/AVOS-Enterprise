import { Injectable } from '@nestjs/common';

@Injectable()
export class IncidentResponseReadinessEngineService {
  evaluate(input: {
    onCallDefined: boolean;
    severityMatrixDefined: boolean;
    escalationPolicyDefined: boolean;
    runbooksAvailable: boolean;
    postmortemProcessDefined: boolean;
    alertRoutingValidated: boolean;
  }) {
    const checks = Object.values(input);
    const score = Math.round(
      (checks.filter(Boolean).length / checks.length) * 100,
    );

    return {
      ...input,
      score,
      ready: score === 100,
    };
  }
}