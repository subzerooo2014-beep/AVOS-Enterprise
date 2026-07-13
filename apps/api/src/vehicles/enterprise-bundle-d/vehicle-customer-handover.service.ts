import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleCustomerHandoverService {
  evaluate(input: {
    documentationScore: number;
    deliveryScore: number;
    onboardingScore: number;
    satisfactionScore: number;
  }) {
    const score = Math.round(
      input.documentationScore * 0.25 +
      input.deliveryScore * 0.25 +
      input.onboardingScore * 0.2 +
      input.satisfactionScore * 0.3,
    );

    return {
      score,
      status: score >= 80 ? "COMPLETE" : "FOLLOW_UP",
    };
  }
}
