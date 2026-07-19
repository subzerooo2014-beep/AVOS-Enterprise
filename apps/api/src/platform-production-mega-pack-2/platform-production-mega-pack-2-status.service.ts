import { Injectable } from "@nestjs/common";
import { EnterpriseServiceRegistryService } from "./enterprise-service-registry.service";
import { ServiceContractRegistryService } from "./service-contract-registry.service";
import { IntelligentServiceRouterService } from "./intelligent-service-router.service";
import { ServiceMeshObservabilityService } from "./service-mesh-observability.service";

@Injectable()
export class PlatformProductionMegaPack2StatusService {
  constructor(
    private readonly registry: EnterpriseServiceRegistryService,
    private readonly contracts: ServiceContractRegistryService,
    private readonly router: IntelligentServiceRouterService,
    private readonly observability: ServiceMeshObservabilityService,
  ) {}

  status(): Record<string, unknown> {
    const services = this.registry.list();

    return {
      name: "AVOS Platform Production Integration — Mega Pack 2",
      version: "PPI-MP2-1.0.0",
      status: "operational",
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
      components: {
        enterpriseServiceMesh: true,
        serviceDiscovery: true,
        serviceRegistry: true,
        serviceContracts: true,
        intelligentRouting: true,
        loadBalancing: true,
        circuitBreaker: true,
        retryPolicies: true,
        serviceHealth: true,
        serviceObservability: true,
      },
      metrics: {
        serviceInstances: services.length,
        healthyInstances: services.filter((service) =>
          ["healthy", "certified"].includes(service.status),
        ).length,
        serviceContracts: this.contracts.list().length,
        routeDecisions: this.router.listDecisions().length,
        observations: this.observability.list().length,
      },
      latestHealth: this.observability.latestHealth(),
    };
  }
}