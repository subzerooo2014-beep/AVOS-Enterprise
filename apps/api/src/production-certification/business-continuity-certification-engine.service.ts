import { Injectable } from '@nestjs/common';

@Injectable()
export class BusinessContinuityCertificationEngineService {
  evaluate(input: {
    backupsValidated: boolean;
    restoreValidated: boolean;
    failoverValidated: boolean;
    rollbackValidated: boolean;
    runbooksValidated: boolean;
    incidentEscalationValidated: boolean;
  }) {
    const checks = Object.values(input);
    const score = Math.round(
      (checks.filter(Boolean).length / checks.length) * 100,
    );

    return {
      ...input,
      score,
      certified: score === 100,
    };
  }
}