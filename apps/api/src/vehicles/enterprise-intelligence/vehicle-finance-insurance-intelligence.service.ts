import { Injectable } from "@nestjs/common";
import {
  VehicleFinanceInsuranceInput,
  VehicleFinanceInsuranceResult,
} from "./vehicle-finance-insurance.types";

@Injectable()
export class VehicleFinanceInsuranceIntelligenceService {
  evaluate(
    input: VehicleFinanceInsuranceInput,
  ): VehicleFinanceInsuranceResult {
    const highRisk =
      input.fraudRisk === "HIGH" ||
      input.qualityScore < 50 ||
      input.vehicleAge > 20;

    const mediumRisk =
      !highRisk &&
      (input.fraudRisk === "MEDIUM" ||
        input.qualityScore < 70 ||
        input.vehicleAge > 10);

    const riskBand = highRisk
      ? "HIGH"
      : mediumRisk
        ? "MEDIUM"
        : "LOW";

    const financeEligible =
      riskBand !== "HIGH" &&
      input.vehiclePrice > 0 &&
      input.qualityScore >= 60;

    const insuranceEligible =
      input.fraudRisk !== "HIGH" &&
      input.qualityScore >= 50;

    return {
      financeEligible,
      insuranceEligible,
      riskBand,
      maxFinanceRatio:
        riskBand === "LOW"
          ? 0.8
          : riskBand === "MEDIUM"
            ? 0.6
            : 0,
      reasons: [
        `risk-band:${riskBand}`,
        `finance-eligible:${financeEligible}`,
        `insurance-eligible:${insuranceEligible}`,
      ],
    };
  }
}
