import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { EnterpriseServiceRegistryService } from "./enterprise-service-registry.service";
import { ServiceContractRegistryService } from "./service-contract-registry.service";
import { RetryPolicyService } from "./retry-policy.service";
import { CircuitBreakerService } from "./circuit-breaker.service";
import { IntelligentServiceRouterService } from "./intelligent-service-router.service";
import { ServiceMeshObservabilityService } from "./service-mesh-observability.service";
import { PlatformProductionMegaPack2StatusService } from "./platform-production-mega-pack-2-status.service";
import { PlatformProductionMegaPack2AssuranceService } from "./platform-production-mega-pack-2-assurance.service";

@Controller("avos/platform/production/mega-pack-2")
export class PlatformProductionMegaPack2Controller {
  constructor(
    private readonly registry: EnterpriseServiceRegistryService,
    private readonly contracts: ServiceContractRegistryService,
    private readonly retries: RetryPolicyService,
    private readonly circuits: CircuitBreakerService,
    private readonly router: IntelligentServiceRouterService,
    private readonly observability: ServiceMeshObservabilityService,
    private readonly statusService: PlatformProductionMegaPack2StatusService,
    private readonly assurance: PlatformProductionMegaPack2AssuranceService,
  ) {}

  @Get("status")
  status() {
    return this.statusService.status();
  }

  @Get("mesh/services")
  services() {
    return this.registry.list();
  }

  @Get("mesh/discover")
  discover(
    @Query("serviceKey") serviceKey: string,
    @Query("tags") tags?: string,
  ) {
    return this.registry.discover(
      serviceKey,
      tags ? tags.split(",").filter(Boolean) : [],
    );
  }

  @Get("mesh/contracts")
  contractsList() {
    return this.contracts.list();
  }

  @Post("mesh/contracts/register")
  registerContract(@Body() body: any) {
    return this.contracts.register(body);
  }

  @Post("mesh/route")
  route(@Body() body: { serviceKey: string }) {
    return this.router.route(body.serviceKey);
  }

  @Get("mesh/routes")
  routes() {
    return this.router.listDecisions();
  }

  @Post("mesh/retry/configure")
  configureRetry(@Body() body: any) {
    return this.retries.configure(body);
  }

  @Get("mesh/retry")
  retry(@Query("serviceKey") serviceKey: string) {
    return this.retries.get(serviceKey);
  }

  @Post("mesh/circuit/configure")
  configureCircuit(
    @Body()
    body: {
      serviceKey: string;
      failureThreshold: number;
      recoveryTimeoutMs: number;
    },
  ) {
    return this.circuits.configure(
      body.serviceKey,
      body.failureThreshold,
      body.recoveryTimeoutMs,
    );
  }

  @Get("mesh/circuit")
  circuit(@Query("serviceKey") serviceKey: string) {
    return this.circuits.get(serviceKey);
  }

  @Post("mesh/health/run")
  health() {
    return this.observability.health();
  }

  @Get("mesh/health/status")
  healthStatus() {
    return this.observability.latestHealth();
  }

  @Get("mesh/observations")
  observations(@Query("serviceKey") serviceKey?: string) {
    return this.observability.list(serviceKey);
  }

  @Post("verification/run")
  verification() {
    return this.assurance.verification();
  }

  @Post("smoke/run")
  smoke() {
    return this.assurance.smoke();
  }

  @Post("certification/certify")
  certify(@Body() body: { approvedBy: string }) {
    return this.assurance.certify(body.approvedBy);
  }

  @Get("certification/status")
  certificationStatus() {
    return this.assurance.certificationStatus();
  }
}