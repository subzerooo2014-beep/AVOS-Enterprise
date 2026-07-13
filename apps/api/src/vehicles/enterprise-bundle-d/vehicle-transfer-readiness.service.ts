import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleTransferReadinessService {
  evaluate(input: {
    ownershipScore: number;
    complianceScore: number;
    paymentScore: number;
    identityScore: number;
  }) {
    const score = Math.round(
      input.ownershipScore * 0.3 +
      input.complianceScore * 0.25 +
      input.paymentScore * 0.25 +
      input.identityScore * 0.2,
    );

    return {
      score,
      ready: score >= 80,
    };
  }
}
