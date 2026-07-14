import { Injectable } from '@nestjs/common';
import { EnterpriseOkr } from './enterprise-strategic-governance.types';

@Injectable()
export class AutonomousOkrEngineService {
  evaluate(okrs: EnterpriseOkr[]) {
    return okrs.map((okr) => {
      const keyResults = okr.keyResults.map((keyResult) => ({
        ...keyResult,
        progress:
          keyResult.target === 0
            ? 100
            : Math.max(
                0,
                Math.min(100, (keyResult.actual / keyResult.target) * 100),
              ),
      }));

      return {
        ...okr,
        keyResults,
        progress: Math.round(
          keyResults.reduce((sum, keyResult) => sum + keyResult.progress, 0) /
            Math.max(1, keyResults.length),
        ),
      };
    });
  }
}