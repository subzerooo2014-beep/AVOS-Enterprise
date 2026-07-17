import { Module } from "@nestjs/common";
import { ArchitectureQualityController } from "./quality.controller";
import { ArchitectureQualityService } from "./quality.service";

@Module({
  controllers: [ArchitectureQualityController],
  providers: [ArchitectureQualityService],
  exports: [ArchitectureQualityService],
})
export class ArchitectureQualityModule {}