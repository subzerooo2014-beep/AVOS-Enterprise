import { Injectable } from '@nestjs/common';

@Injectable()
export class RuntimeTrustService {
  calculate(input: {
    policyScore: number;
    healthScore: number;
    auditScore: number;
    provenanceScore: number;
  }): number {
    const values = [
      input.policyScore,
      input.healthScore,
      input.auditScore,
      input.provenanceScore,
    ].map((value) => Math.max(0, Math.min(100, value)));

    return Math.round(
      values.reduce((sum, value) => sum + value, 0) /
        values.length,
    );
  }
}