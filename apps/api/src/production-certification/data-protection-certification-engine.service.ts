import { Injectable } from '@nestjs/common';

@Injectable()
export class DataProtectionCertificationEngineService {
  evaluate(input: {
    encryptionAtRest: boolean;
    encryptionInTransit: boolean;
    piiClassification: boolean;
    retentionPolicies: boolean;
    deletionWorkflows: boolean;
    accessLogging: boolean;
    keyRotation: boolean;
  }) {
    const checks = Object.values(input);
    const score = Math.round(
      (checks.filter(Boolean).length / checks.length) * 100,
    );

    return {
      ...input,
      score,
      certified: score === 100,
    };
  }
}