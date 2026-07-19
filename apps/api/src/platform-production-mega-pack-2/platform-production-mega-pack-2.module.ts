import { Module } from "@nestjs/common";
import { ServiceMeshFileStoreService } from "./service-mesh-file-store.service";
import { EnterpriseServiceRegistryService } from "./enterprise-service-registry.service";
import { ServiceContractRegistryService } from "./service-contract-registry.service";
import { RetryPolicyService } from "./retry-policy.service";
import { CircuitBreakerService } from "./circuit-breaker.service";
import { IntelligentServiceRouterService } from "./intelligent-service-router.service";
import { ServiceMeshObservabilityService } from "./service-mesh-observability.service";
import { PlatformProductionMegaPack2StatusService } from "./platform-production-mega-pack-2-status.service";
import { PlatformProductionMegaPack2AssuranceService } from "./platform-production-mega-pack-2-assurance.service";
import { PlatformProductionMegaPack2Controller } from "./platform-production-mega-pack-2.controller";

@Module({
  controllers: [PlatformProductionMegaPack2Controller],
  providers: [
    ServiceMeshFileStoreService,
    EnterpriseServiceRegistryService,
    ServiceContractRegistryService,
    RetryPolicyService,
    CircuitBreakerService,
    IntelligentServiceRouterService,
    ServiceMeshObservabilityService,
    PlatformProductionMegaPack2StatusService,
    PlatformProductionMegaPack2AssuranceService,
  ],
  exports: [
    EnterpriseServiceRegistryService,
    ServiceContractRegistryService,
    RetryPolicyService,
    CircuitBreakerService,
    IntelligentServiceRouterService,
    ServiceMeshObservabilityService,
    PlatformProductionMegaPack2StatusService,
  ],
})
export class PlatformProductionMegaPack2Module {}