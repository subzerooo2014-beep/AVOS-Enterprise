import { Injectable } from "@nestjs/common";

@Injectable()
export class TrustScoreEngineService {
  calculate(input: {
    readonly compliance: number;
    readonly explainability: number;
    readonly traceability: number;
    readonly provenance: number;
    readonly auditValid: boolean;
  }): number {
    const score =
      input.compliance * 0.3 +
      input.explainability * 0.2 +
      input.traceability * 0.2 +
      input.provenance * 0.2 +
      (input.auditValid ? 100 : 0) * 0.1;

    return Number(Math.max(0, Math.min(100, score)).toFixed(2));
  }
}
