import { UrpProductionCertificationService } from "./production-integration/urp-production-certification.service";
import { UrpProductionVerificationService } from "./production-integration/urp-production-verification.service";
import { UrpProductionReadinessService } from "./production-integration/urp-production-readiness.service";
import { UrpProductionObservabilityService } from "./production-integration/urp-production-observability.service";
import { UrpProductionAuditService } from "./production-integration/urp-production-audit.service";
import { UrpDistributedRegistryService } from "./production-integration/urp-distributed-registry.service";
import { UrpProductionPersistenceService } from "./production-integration/urp-production-persistence.service";
import { UrpEventBridgeService } from "./production-integration/urp-event-bridge.service";
import { UrpProductionDispatchService } from "./production-integration/urp-production-dispatch.service";
import { UrpResilienceService } from "./production-integration/urp-resilience.service";
import { UrpEndpointDiscoveryService } from "./production-integration/urp-endpoint-discovery.service";
import { UrpAdapterCatalogService } from "./production-integration/urp-adapter-catalog.service";
import { UrpProductionController } from "./production-integration/urp-production.controller";
import { UrpCertificationService } from "./urp-certification.service";
import { UrpVerificationService } from "./urp-verification.service";
import { Module } from "@nestjs/common";
import { UrpBootstrapService } from "./urp-bootstrap.service";
import { UrpConfigurationService } from "./urp-configuration.service";
import { UrpController } from "./urp.controller";
import { UrpDiagnosticsService } from "./urp-diagnostics.service";
import { UrpFeatureFlagsService } from "./urp-feature-flags.service";
import { UrpHealthCenterService } from "./urp-health-center.service";
import { UrpLifecycleManagerService } from "./urp-lifecycle-manager.service";
import { UrpPlatformCatalogService } from "./urp-platform-catalog.service";
import { UrpResourceManagerService } from "./urp-resource-manager.service";
import { UrpRouterService } from "./urp-router.service";
import { UrpRuntimeContextService } from "./urp-runtime-context.service";
import { UrpRuntimeRegistryService } from "./urp-runtime-registry.service";
import { UrpVersionManagerService } from "./urp-version-manager.service";

@Module({
  controllers: [
    UrpProductionController,UrpController],
  providers: [
    UrpProductionCertificationService,
    UrpProductionVerificationService,
    UrpProductionReadinessService,
    UrpProductionObservabilityService,
    UrpProductionAuditService,
    UrpDistributedRegistryService,
    UrpProductionPersistenceService,
    UrpEventBridgeService,
    UrpProductionDispatchService,
    UrpResilienceService,
    UrpEndpointDiscoveryService,
    UrpAdapterCatalogService,
    UrpRuntimeContextService,
    UrpRuntimeRegistryService,
    UrpPlatformCatalogService,
    UrpLifecycleManagerService,
    UrpBootstrapService,
    UrpRouterService,
    UrpResourceManagerService,
    UrpHealthCenterService,
    UrpDiagnosticsService,
    UrpConfigurationService,
    UrpFeatureFlagsService,
    UrpVersionManagerService,
    UrpVerificationService,
    UrpCertificationService,
  ],
  exports: [
    UrpRuntimeRegistryService,
    UrpLifecycleManagerService,
    UrpRouterService,
    UrpHealthCenterService,
    UrpResourceManagerService,
  ],
})
export class UrpModule {}