import { Injectable } from '@nestjs/common';

@Injectable()
export class FinalSmokeValidationEngineService {
  validate(input: {
    apiSmoke: boolean;
    webSmoke: boolean;
    mobileSmoke: boolean;
    healthSmoke: boolean;
  }) {
    const checks = Object.values(input);
    const score = Math.round(
      (checks.filter(Boolean).length / checks.length) * 100,
    );

    return {
      ...input,
      score,
      passed: score === 100,
    };
  }
}