import { Injectable } from '@nestjs/common';

@Injectable()
export class InputValidationHardeningEngineService {
  evaluate(input: {
    globalValidationPipe: boolean;
    whitelistEnabled: boolean;
    forbidUnknownValues: boolean;
    transformEnabled: boolean;
    dtoCoveragePercent: number;
  }) {
    const checks = [
      input.globalValidationPipe,
      input.whitelistEnabled,
      input.forbidUnknownValues,
      input.transformEnabled,
      input.dtoCoveragePercent >= 90,
    ];

    const score = Math.round(
      (checks.filter(Boolean).length / checks.length) * 100,
    );

    return {
      ...input,
      score,
      hardened: score === 100,
    };
  }
}