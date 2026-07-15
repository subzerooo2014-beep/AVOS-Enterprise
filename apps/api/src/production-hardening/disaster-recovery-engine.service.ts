import { Injectable } from '@nestjs/common';
import { RecoveryScenario } from './production-hardening.types';

@Injectable()
export class DisasterRecoveryEngineService {
  evaluate(scenarios: RecoveryScenario[]) {
    const evaluated = scenarios.map((scenario) => ({
      ...scenario,
      ready:
        scenario.backupAvailable &&
        scenario.restoreTested &&
        scenario.rollbackTested &&
        scenario.recoveryTimeMinutes <= 60 &&
        scenario.recoveryPointMinutes <= 15,
    }));

    return {
      scenarios: evaluated,
      score: Math.round(
        (evaluated.filter((scenario) => scenario.ready).length /
          Math.max(1, evaluated.length)) *
          100,
      ),
      blockers: evaluated
        .filter((scenario) => !scenario.ready)
        .map((scenario) => scenario.id),
    };
  }
}