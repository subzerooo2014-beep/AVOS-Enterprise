import { Module } from "@nestjs/common";
import { ArchitectureCompliancePlatformController } from "./architecture-compliance-platform.controller";
import { ArchitectureCompliancePlatformService } from "./architecture-compliance-platform.service";

@Module({
  controllers: [ArchitectureCompliancePlatformController],
  providers: [ArchitectureCompliancePlatformService],
  exports: [ArchitectureCompliancePlatformService],
})
export class ArchitectureCompliancePlatformModule {}