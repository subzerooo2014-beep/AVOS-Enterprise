import { Injectable } from "@nestjs/common";

@Injectable()
export class EnterpriseResilienceLabService {
  simulate(input: {
    liquidityScore: number;
    operationalScore: number;
    supplierScore: number;
    recoveryScore: number;
  }) {
    const resilienceScore = Math.round(
      input.liquidityScore * 0.25 +
        input.operationalScore * 0.3 +
        input.supplierScore * 0.2 +
        input.recoveryScore * 0.25,
    );

    return {
      resilienceScore,
      level:
        resilienceScore >= 80
          ? "RESILIENT"
          : resilienceScore >= 60
            ? "STABLE"
            : "VULNERABLE",
    };
  }
}
