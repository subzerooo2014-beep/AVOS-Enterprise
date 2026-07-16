import { Module } from "@nestjs/common";
import { CapabilityFabricModule } from "../capability-fabric/capability-fabric.module";
import { CapabilityRuntimeModule } from "../capability-runtime/capability-runtime.module";
import { CapabilityCompositionGraphService } from "./capability-composition-graph.service";
import { CapabilityDiscoveryService } from "./capability-discovery.service";
import { CapabilityOrchestrationController } from "./capability-orchestration.controller";
import { CapabilityOrchestrationRegistryService } from "./capability-orchestration-registry.service";
import { CapabilityOrchestrationService } from "./capability-orchestration.service";
import { CapabilityRoutingService } from "./capability-routing.service";

@Module({
  imports: [CapabilityFabricModule, CapabilityRuntimeModule],
  controllers: [CapabilityOrchestrationController],
  providers: [
    CapabilityOrchestrationService,
    CapabilityOrchestrationRegistryService,
    CapabilityCompositionGraphService,
    CapabilityDiscoveryService,
    CapabilityRoutingService,
  ],
  exports: [
    CapabilityOrchestrationService,
    CapabilityOrchestrationRegistryService,
    CapabilityDiscoveryService,
    CapabilityRoutingService,
  ],
})
export class CapabilityOrchestrationModule {}