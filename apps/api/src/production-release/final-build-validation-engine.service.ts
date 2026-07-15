import { Injectable } from '@nestjs/common';

@Injectable()
export class FinalBuildValidationEngineService {
  validate(input: {
    apiBuild: boolean;
    webBuild: boolean;
    packagesBuild: boolean;
    codegenBuild: boolean;
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