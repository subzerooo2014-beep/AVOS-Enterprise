import { Injectable } from "@nestjs/common";
import { VehicleFraudResult } from "./vehicle-fraud.types";

@Injectable()
export class VehicleFraudAnalysisService {
  analyze(vehicle: any): VehicleFraudResult {
    return {
      score: 100,
      risk: "LOW",
      duplicateVin: false,
      blacklistMatch: false,
      recommendations: [],
    };
  }
}
