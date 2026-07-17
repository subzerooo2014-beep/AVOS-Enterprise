import { Module } from "@nestjs/common";
import { ArchitectureGovernanceController } from "./governance.controller";
import { ArchitectureGovernanceService } from "./governance.service";

@Module({
  controllers: [ArchitectureGovernanceController],
  providers: [ArchitectureGovernanceService],
  exports: [ArchitectureGovernanceService],
})
export class ArchitectureGovernanceModule {}