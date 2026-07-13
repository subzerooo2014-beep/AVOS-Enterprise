import { Injectable } from "@nestjs/common";
import { VehicleFraudAnalysisService } from "./vehicle-fraud-analysis.service";
import { VehicleInspectionIntelligenceService } from "./vehicle-inspection-intelligence.service";
import { VehicleIntelligenceResult, VehicleRiskLevel } from "./vehicle-intelligence.types";
import { VehicleMarketAnalysisService } from "./vehicle-market-analysis.service";
import { VehiclePricingAiService } from "./vehicle-pricing-ai.service";

@Injectable()
export class VehicleEnterpriseOrchestratorService {
  constructor(
    private readonly fraud: VehicleFraudAnalysisService,
    private readonly pricing: VehiclePricingAiService,
    private readonly market: VehicleMarketAnalysisService,
    private readonly inspection: VehicleInspectionIntelligenceService,
  ) {}

  analyze(vehicle: any): VehicleIntelligenceResult {
    const fraud = this.fraud.analyze(vehicle);
    const market = this.market.analyze(vehicle);
    const inspection = this.inspection.analyze(vehicle);
    const pricing = this.pricing.estimatePrice(Number(vehicle?.basePrice ?? vehicle?.price ?? 0));

    const pricingScore = Math.round(pricing.confidence * 100);
    const confidence = Math.round(
      (fraud.score + market.score + inspection.score + pricingScore) / 4,
    );

    const risk: VehicleRiskLevel =
      fraud.risk === "HIGH" || inspection.score < 50
        ? "HIGH"
        : fraud.risk === "MEDIUM" || confidence < 75
          ? "MEDIUM"
          : "LOW";

    return {
      fraudScore: fraud.score,
      marketScore: market.score,
      inspectionScore: inspection.score,
      pricingScore,
      confidence,
      risk,
      recommendations: [
        ...fraud.recommendations,
        ...market.recommendations,
        ...inspection.recommendations,
      ],
    };
  }
}
