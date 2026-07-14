import { Injectable } from '@nestjs/common';
import { FoundationModule } from './foundation-production-readiness.types';

@Injectable()
export class EndToEndFoundationValidatorService {
  validate(modules: FoundationModule[]) {
    const scenarios = modules.map((module) => ({
      scenario: `${module.id}:end-to-end`,
      passed:
        module.registered &&
        module.buildPassing &&
        module.testsPassing &&
        module.verificationPassing,
      evidence: [
        `${module.id}:registered`,
        `${module.id}:build`,
        `${module.id}:tests`,
        `${module.id}:verification`,
      ],
    }));

    return {
      scenarios,
      passed: scenarios.every((scenario) => scenario.passed),
      passRate: Math.round(
        (scenarios.filter((scenario) => scenario.passed).length /
          Math.max(1, scenarios.length)) *
          100,
      ),
      failedScenarios: scenarios
        .filter((scenario) => !scenario.passed)
        .map((scenario) => scenario.scenario),
    };
  }
}