import { Module } from "@nestjs/common";
import { EnterpriseIntelligenceMeshController } from "./enterprise-intelligence-mesh.controller";
import { EnterpriseIntelligenceMeshService } from "./services/enterprise-intelligence-mesh.service";
import { MeshEventService } from "./services/mesh-event.service";
import { MeshIdService } from "./services/mesh-id.service";
import { MeshMemoryService } from "./services/mesh-memory.service";
import { MeshPolicyService } from "./services/mesh-policy.service";
import { MeshRegistryService } from "./services/mesh-registry.service";
import { MeshRouterService } from "./services/mesh-router.service";
import { MeshTraceService } from "./services/mesh-trace.service";

@Module({
  controllers: [EnterpriseIntelligenceMeshController],
  providers: [
    MeshIdService,
    MeshRegistryService,
    MeshTraceService,
    MeshEventService,
    MeshMemoryService,
    MeshPolicyService,
    MeshRouterService,
    EnterpriseIntelligenceMeshService
  ],
  exports: [
    MeshRegistryService,
    MeshEventService,
    MeshRouterService,
    EnterpriseIntelligenceMeshService
  ]
})
export class EnterpriseIntelligenceMeshModule {}