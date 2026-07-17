import { Module } from "@nestjs/common";
import { CapabilityDependencyGraphService } from "./capability-dependency-graph.service";
import { CapabilityFabricController } from "./capability-fabric.controller";
import { CapabilityFoundationValidatorService } from "./capability-foundation-validator.service";
import { CapabilityRegistryService } from "./capability-registry.service";

@Module({
  controllers: [CapabilityFabricController],
  providers: [
    CapabilityRegistryService,
    CapabilityFoundationValidatorService,
    CapabilityDependencyGraphService,
  ],
  exports: [
    CapabilityRegistryService,
    CapabilityFoundationValidatorService,
    CapabilityDependencyGraphService,
  ],
})
export class CapabilityFabricModule {}