import { Module } from "@nestjs/common";
import {
  ProductionMegaPackController
} from "./production-mega-pack.controller";
import {
  EnterpriseServiceMeshService
} from "./service-mesh.service";
import {
  UnifiedApiGatewayService
} from "./api-gateway.service";
import {
  EnterpriseEventStreamingService
} from "./event-streaming.service";
import {
  WorkflowOrchestrationService
} from "./workflow-orchestration.service";
import {
  EnterpriseObservabilityService
} from "./observability.service";
import {
  ZeroTrustSecurityService
} from "./zero-trust-security.service";
import {
  EnterpriseResiliencePlatformService
} from "./resilience-platform.service";
import {
  UnifiedPlatformProductionCertificationService
} from "./production-certification.service";

@Module({
  controllers: [ProductionMegaPackController],
  providers: [
    EnterpriseServiceMeshService,
    UnifiedApiGatewayService,
    EnterpriseEventStreamingService,
    WorkflowOrchestrationService,
    EnterpriseObservabilityService,
    ZeroTrustSecurityService,
    EnterpriseResiliencePlatformService,
    UnifiedPlatformProductionCertificationService
  ],
  exports: [
    EnterpriseServiceMeshService,
    UnifiedApiGatewayService,
    EnterpriseEventStreamingService,
    WorkflowOrchestrationService,
    EnterpriseObservabilityService,
    ZeroTrustSecurityService,
    EnterpriseResiliencePlatformService,
    UnifiedPlatformProductionCertificationService
  ]
})
export class ProductionMegaPackModule {}