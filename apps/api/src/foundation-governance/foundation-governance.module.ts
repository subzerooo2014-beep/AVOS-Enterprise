import { Module } from "@nestjs/common";
import { FoundationGovernanceController } from "./foundation-governance.controller";
import { FoundationGovernanceService } from "./foundation-governance.service";

@Module({
  controllers: [FoundationGovernanceController],
  providers: [FoundationGovernanceService],
  exports: [FoundationGovernanceService],
})
export class FoundationGovernanceModule {}