import { Injectable } from "@nestjs/common";
import { VehicleInspectionIntelligenceResult } from "./vehicle-inspection-intelligence.types";

@Injectable()
export class VehicleInspectionIntelligenceService {
  analyze(vehicle: any): VehicleInspectionIntelligenceResult {
    const riskSignals: string[] = [];

    if (!vehicle?.vin) riskSignals.push("missing_vin");
    if (Number(vehicle?.mileage ?? 0) > 250_000) riskSignals.push("high_mileage");
    if (vehicle?.accidentHistory === true) riskSignals.push("accident_history");

    const score = Math.max(0, 100 - riskSignals.length * 25);

    return {
      score,
      status: score >= 80 ? "READY" : score >= 50 ? "REVIEW_REQUIRED" : "INSPECTION_REQUIRED",
      riskSignals,
      recommendations: riskSignals.length > 0 ? ["schedule_vehicle_inspection"] : [],
    };
  }
}
