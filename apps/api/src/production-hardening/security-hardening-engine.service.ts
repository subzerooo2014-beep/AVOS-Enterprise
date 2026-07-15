import { Injectable } from '@nestjs/common';
import { SecurityControl } from './production-hardening.types';

@Injectable()
export class SecurityHardeningEngineService {
  audit(controls: SecurityControl[]) {
    const required = controls.filter((control) => control.required);
    const enabledRequired = required.filter((control) => control.enabled);

    const score = Math.round(
      (enabledRequired.length / Math.max(1, required.length)) * 100,
    );

    return {
      controls,
      score,
      passed: score === 100,
      missingRequired: required
        .filter((control) => !control.enabled)
        .map((control) => control.id),
      evidenceCount: controls.reduce(
        (sum, control) => sum + control.evidence.length,
        0,
      ),
    };
  }
}