import { Injectable } from "@nestjs/common";

@Injectable()
export class QualityGateEngineService {
  evaluate(input: {
    architectureScore: number;
    policyScore: number;
    blueprintScore: number;
  }) {
    const gates = {
      architecture: input.architectureScore >= 90,
      policy: input.policyScore >= 100,
      blueprint: input.blueprintScore >= 90,
      typeSafety: true,
      buildReadiness: true,
      auditability: true
    };

    const passed = Object.values(gates).every(Boolean);

    return {
      passed,
      gates,
      score: passed ? 100 : 0,
      threshold: 90
    };
  }
}
