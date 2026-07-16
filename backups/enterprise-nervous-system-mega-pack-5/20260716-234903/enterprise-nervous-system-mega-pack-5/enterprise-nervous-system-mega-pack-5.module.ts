import { Module } from "@nestjs/common";
import { EnterpriseNervousSystemMegaPack5Controller } from "./enterprise-nervous-system-mega-pack-5.controller";
import { EnterpriseNervousSystemMegaPack5Service } from "./enterprise-nervous-system-mega-pack-5.service";
import { MeshAuditService } from "./observability/mesh-audit.service";
import { MeshRegistryService } from "./registry/mesh-registry.service";
import { MeshDiscoveryService } from "./discovery/mesh-discovery.service";
import { MeshCircuitBreakerService } from "./resilience/mesh-circuit-breaker.service";
import { MeshBulkheadService } from "./resilience/mesh-bulkhead.service";
import { MeshPolicyService } from "./policies/mesh-policy.service";
import { MeshRoutingService } from "./routing/mesh-routing.service";
import { MeshCapabilityCommunicationService } from "./capabilities/mesh-capability-communication.service";
import { MeshHealthService } from "./health/mesh-health.service";

@Module({
  controllers: [
    EnterpriseNervousSystemMegaPack5Controller
  ],
  providers: [
    EnterpriseNervousSystemMegaPack5Service,
    MeshAuditService,
    MeshRegistryService,
    MeshDiscoveryService,
    MeshCircuitBreakerService,
    MeshBulkheadService,
    MeshPolicyService,
    MeshRoutingService,
    MeshCapabilityCommunicationService,
    MeshHealthService
  ],
  exports: [
    EnterpriseNervousSystemMegaPack5Service,
    MeshAuditService,
    MeshRegistryService,
    MeshDiscoveryService,
    MeshCircuitBreakerService,
    MeshBulkheadService,
    MeshPolicyService,
    MeshRoutingService,
    MeshCapabilityCommunicationService,
    MeshHealthService
  ]
})
export class EnterpriseNervousSystemMegaPack5Module {}
