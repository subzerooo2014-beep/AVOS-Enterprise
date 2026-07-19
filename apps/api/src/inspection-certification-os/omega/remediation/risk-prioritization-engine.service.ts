import { Injectable } from "@nestjs/common";
import { RemediationSeverity } from "./omega-remediation.types";

@Injectable()
export class RiskPrioritizationEngineService {
  calculate(input: {
    readonly severity: RemediationSeverity;
    readonly likelihood?: number;
    readonly exposure?: number;
    readonly businessImpact?: number;
  }): number {
    const severityWeights: Record<RemediationSeverity, number> = {
      info: 10,
      low: 25,
      medium: 50,
      high: 75,
      critical: 100,
    };

    const likelihood = this.normalize(input.likelihood ?? 60);
    const exposure = this.normalize(input.exposure ?? 50);
    const businessImpact = this.normalize(input.businessImpact ?? 70);

    const score =
      severityWeights[input.severity] * 0.45 +
      likelihood * 0.2 +
      exposure * 0.15 +
      businessImpact * 0.2;

    return Number(Math.max(0, Math.min(100, score)).toFixed(2));
  }

  prioritize<T extends { readonly riskScore: number }>(
    items: readonly T[],
  ): readonly T[] {
    return [...items].sort((left, right) => right.riskScore - left.riskScore);
  }

  private normalize(value: number): number {
    return Math.max(0, Math.min(100, value));
  }
}
