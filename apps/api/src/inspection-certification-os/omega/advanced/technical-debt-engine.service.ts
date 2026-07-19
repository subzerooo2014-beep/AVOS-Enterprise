import { Injectable } from "@nestjs/common";

@Injectable()
export class TechnicalDebtEngineService {
  calculate(input: {
    readonly findings: number;
    readonly critical: number;
    readonly warnings: number;
  }) {
    const score = Math.min(
      100,
      input.findings * 2 + input.critical * 15 + input.warnings * 4,
    );

    return {
      score,
      level:
        score >= 70 ? "critical" : score >= 40 ? "high" : score >= 20 ? "medium" : "low",
    };
  }
}
