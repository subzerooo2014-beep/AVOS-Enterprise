import { Module } from "@nestjs/common";
import { ArchitectureRiskController } from "./risk.controller";
import { ArchitectureRiskService } from "./risk.service";

@Module({
  controllers: [ArchitectureRiskController],
  providers: [ArchitectureRiskService],
  exports: [ArchitectureRiskService],
})
export class ArchitectureRiskModule {}