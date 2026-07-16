import { Module } from "@nestjs/common";
import { FoundationAiIntegrationV1Service } from "./foundation-ai-integration-v1.service";
import { FoundationBootstrapOrchestratorV1Service } from "./foundation-bootstrap-orchestrator-v1.service";
import { FoundationEventIntegrationV1Service } from "./foundation-event-integration-v1.service";
import { FoundationExecutionIntegrationV1Service } from "./foundation-execution-integration-v1.service";
import { FoundationHealthAggregationV1Service } from "./foundation-health-aggregation-v1.service";
import { FoundationIntegrationPlatformV1Controller } from "./foundation-integration-platform-v1.controller";
import { FoundationIntegrationPlatformV1Service } from "./foundation-integration-platform-v1.service";
import { FoundationRuntimeDependencyResolverV1Service } from "./foundation-runtime-dependency-resolver-v1.service";
import { FoundationUnifiedCapabilityRegistryV1Service } from "./foundation-unified-capability-registry-v1.service";
import { FoundationUnifiedModuleRegistryV1Service } from "./foundation-unified-module-registry-v1.service";

@Module({
  controllers: [FoundationIntegrationPlatformV1Controller],
  providers: [
    FoundationAiIntegrationV1Service,
    FoundationBootstrapOrchestratorV1Service,
    FoundationEventIntegrationV1Service,
    FoundationExecutionIntegrationV1Service,
    FoundationHealthAggregationV1Service,
    FoundationIntegrationPlatformV1Service,
    FoundationRuntimeDependencyResolverV1Service,
    FoundationUnifiedCapabilityRegistryV1Service,
    FoundationUnifiedModuleRegistryV1Service,
  ],
  exports: [
    FoundationAiIntegrationV1Service,
    FoundationBootstrapOrchestratorV1Service,
    FoundationEventIntegrationV1Service,
    FoundationExecutionIntegrationV1Service,
    FoundationHealthAggregationV1Service,
    FoundationIntegrationPlatformV1Service,
    FoundationRuntimeDependencyResolverV1Service,
    FoundationUnifiedCapabilityRegistryV1Service,
    FoundationUnifiedModuleRegistryV1Service,
  ],
})
export class FoundationIntegrationPlatformV1Module {}
