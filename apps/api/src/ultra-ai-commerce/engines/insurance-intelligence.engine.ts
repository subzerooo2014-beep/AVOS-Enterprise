import { Injectable } from "@nestjs/common";
import { round } from "../ultra-ai-commerce.utils";

@Injectable()
export class InsuranceIntelligenceEngine {
  estimate(input: { vehicleValue: number; driverAge: number; claimsCount: number; vehicleAge: number; usageType: string }) {
    let rate = 0.025;
    if (input.driverAge < 25) rate += 0.01;
    rate += input.claimsCount * 0.006;
    rate += Math.min(0.02, input.vehicleAge * 0.001);
    if (input.usageType === "COMMERCIAL") rate += 0.015;
    return { annualPremiumEstimate: round(input.vehicleValue * rate), riskBand: rate >= 0.06 ? "HIGH" : rate >= 0.04 ? "MEDIUM" : "LOW" };
  }
}
