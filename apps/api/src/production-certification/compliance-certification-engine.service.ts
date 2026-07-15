import { Injectable } from '@nestjs/common';
import { ComplianceRequirement } from './production-certification.types';

@Injectable()
export class ComplianceCertificationEngineService {
  certify(requirements: ComplianceRequirement[]) {
    const required = requirements.filter(
      (requirement) => requirement.required,
    );
    const compliant = required.filter(
      (requirement) => requirement.compliant,
    );

    const score = Math.round(
      (compliant.length / Math.max(1, required.length)) * 100,
    );

    return {
      requirements,
      score,
      certified: score === 100,
      failures: required
        .filter((requirement) => !requirement.compliant)
        .map((requirement) => requirement.id),
    };
  }
}