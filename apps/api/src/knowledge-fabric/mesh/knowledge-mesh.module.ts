import { Module } from "@nestjs/common";
import { KnowledgeMeshConsistencyService } from "./knowledge-mesh-consistency.service";
import { KnowledgeMeshController } from "./knowledge-mesh.controller";
import { KnowledgeMeshEventService } from "./knowledge-mesh-event.service";
import { KnowledgeMeshHealthService } from "./knowledge-mesh-health.service";
import { KnowledgeMeshObservabilityService } from "./knowledge-mesh-observability.service";
import { KnowledgeMeshPolicyService } from "./knowledge-mesh-policy.service";
import { KnowledgeMeshRegistryService } from "./knowledge-mesh-registry.service";
import { KnowledgeMeshRoutingService } from "./knowledge-mesh-routing.service";
import { KnowledgeMeshRuntimeService } from "./knowledge-mesh-runtime.service";

@Module({
  controllers: [KnowledgeMeshController],
  providers: [
    KnowledgeMeshRegistryService,
    KnowledgeMeshRoutingService,
    KnowledgeMeshPolicyService,
    KnowledgeMeshConsistencyService,
    KnowledgeMeshEventService,
    KnowledgeMeshObservabilityService,
    KnowledgeMeshRuntimeService,
    KnowledgeMeshHealthService,
  ],
  exports: [
    KnowledgeMeshRegistryService,
    KnowledgeMeshRoutingService,
    KnowledgeMeshPolicyService,
    KnowledgeMeshConsistencyService,
    KnowledgeMeshEventService,
    KnowledgeMeshObservabilityService,
    KnowledgeMeshRuntimeService,
    KnowledgeMeshHealthService,
  ],
})
export class KnowledgeMeshModule {}