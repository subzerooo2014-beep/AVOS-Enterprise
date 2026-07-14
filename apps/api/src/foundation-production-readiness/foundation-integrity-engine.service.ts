import { Injectable } from '@nestjs/common';
import { FoundationModule } from './foundation-production-readiness.types';

@Injectable()
export class FoundationIntegrityEngineService {
  evaluate(modules: FoundationModule[]) {
    const evaluated = modules.map((module) => {
      const checks = [
        module.registered,
        module.buildPassing,
        module.testsPassing,
        module.verificationPassing,
      ];
      const score = Math.round(
        (checks.filter(Boolean).length / checks.length) * 100,
      );

      return {
        ...module,
        score,
        healthy: score === 100,
      };
    });

    return {
      modules: evaluated,
      foundationScore: Math.round(
        evaluated.reduce((sum, module) => sum + module.score, 0) /
          Math.max(1, evaluated.length),
      ),
      unhealthyModules: evaluated
        .filter((module) => !module.healthy)
        .map((module) => module.id),
    };
  }
}