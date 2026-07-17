import { Module } from "@nestjs/common";
import { ArchitectureCompatibilityController } from "./compatibility.controller";
import { ArchitectureCompatibilityService } from "./compatibility.service";

@Module({
  controllers: [ArchitectureCompatibilityController],
  providers: [ArchitectureCompatibilityService],
  exports: [ArchitectureCompatibilityService],
})
export class ArchitectureCompatibilityModule {}