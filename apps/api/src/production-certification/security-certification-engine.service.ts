import { Injectable } from '@nestjs/common';
import { CertificationControl } from './production-certification.types';

@Injectable()
export class SecurityCertificationEngineService {
  certify(controls: CertificationControl[]) {
    const required = controls.filter((control) => control.required);
    const passed = required.filter((control) => control.passed);

    const score = Math.round(
      (passed.length / Math.max(1, required.length)) * 100,
    );

    return {
      controls,
      score,
      certified: score === 100,
      failures: required
        .filter((control) => !control.passed)
        .map((control) => control.id),
      evidenceCount: controls.reduce(
        (sum, control) => sum + control.evidence.length,
        0,
      ),
    };
  }
}