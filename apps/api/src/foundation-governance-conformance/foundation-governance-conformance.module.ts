import { Module } from "@nestjs/common";
import { FoundationGovernanceConformanceController } from "./foundation-governance-conformance.controller";
import { FoundationGovernanceConformanceService } from "./foundation-governance-conformance.service";

@Module({
  controllers: [FoundationGovernanceConformanceController],
  providers: [FoundationGovernanceConformanceService],
  exports: [FoundationGovernanceConformanceService],
})
export class FoundationGovernanceConformanceModule {}