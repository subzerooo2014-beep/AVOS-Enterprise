import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleRevenueAssuranceService {
  evaluate(input: {
    paymentIntegrity: number;
    marginScore: number;
    commissionScore: number;
    leakageRisk: number;
  }) {
    const score = Math.max(
      0,
      Math.round(
        input.paymentIntegrity * 0.35 +
        input.marginScore * 0.3 +
        input.commissionScore * 0.2 -
        input.leakageRisk * 0.15,
      ),
    );

    return {
      score,
      status: score >= 80 ? "ASSURED" : score >= 60 ? "REVIEW" : "AT_RISK",
    };
  }
}
