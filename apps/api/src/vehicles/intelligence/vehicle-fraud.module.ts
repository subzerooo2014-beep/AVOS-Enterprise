import { Module } from "@nestjs/common";
import { VehicleFraudAnalysisService } from "./vehicle-fraud-analysis.service";

@Module({
  providers: [VehicleFraudAnalysisService],
  exports: [VehicleFraudAnalysisService],
})
export class VehicleFraudModule {}
