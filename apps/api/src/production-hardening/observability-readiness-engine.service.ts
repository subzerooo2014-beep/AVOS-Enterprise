import { Injectable } from '@nestjs/common';
import { ObservabilityControl } from './production-hardening.types';

@Injectable()
export class ObservabilityReadinessEngineService {
  evaluate(controls: ObservabilityControl[]) {
    const evaluated = controls.map((control) => {
      const checks = [
        control.logs,
        control.metrics,
        control.traces,
        control.alerts,
        control.readiness,
        control.liveness,
      ];

      return {
        ...control,
        score: Math.round(
          (checks.filter(Boolean).length / checks.length) * 100,
        ),
      };
    });

    return {
      controls: evaluated,
      score: Math.round(
        evaluated.reduce((sum, control) => sum + control.score, 0) /
          Math.max(1, evaluated.length),
      ),
      incomplete: evaluated
        .filter((control) => control.score < 100)
        .map((control) => control.id),
    };
  }
}