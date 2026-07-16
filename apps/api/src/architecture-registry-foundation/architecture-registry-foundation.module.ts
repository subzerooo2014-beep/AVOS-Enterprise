import { Module } from "@nestjs/common";
import { ArchitectureRegistryFoundationController } from "./architecture-registry-foundation.controller";
import { ArchitectureRegistryFoundationService } from "./architecture-registry-foundation.service";

@Module({
  controllers: [ArchitectureRegistryFoundationController],
  providers: [ArchitectureRegistryFoundationService],
  exports: [ArchitectureRegistryFoundationService],
})
export class ArchitectureRegistryFoundationModule {}