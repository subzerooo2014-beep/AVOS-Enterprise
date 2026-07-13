import { Injectable } from "@nestjs/common";
import {
  VehicleAnalyticsInput,
  VehicleAnalyticsResult,
} from "./vehicle-analytics.types";

@Injectable()
export class VehicleEnterpriseAnalyticsService {
  calculate(
    input: VehicleAnalyticsInput,
  ): VehicleAnalyticsResult {
    const denominator = Math.max(input.totalListings, 1);

    const approvalRate = Math.round(
      (input.approvedListings / denominator) * 100,
    );

    const rejectionRate = Math.round(
      (input.rejectedListings / denominator) * 100,
    );

    const healthScore = Math.round(
      approvalRate * 0.35 +
        input.averageQualityScore * 0.35 +
        input.averageMarketScore * 0.3,
    );

    return {
      approvalRate,
      rejectionRate,
      healthScore,
      status:
        healthScore >= 80
          ? "HEALTHY"
          : healthScore >= 60
            ? "WATCH"
            : "CRITICAL",
    };
  }
}
