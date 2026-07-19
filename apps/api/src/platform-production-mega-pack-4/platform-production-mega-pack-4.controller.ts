import { Body, Controller, Get, Post } from "@nestjs/common";
import { EventRegistryService } from "./event-registry.service";
import { EventContractsService } from "./event-contracts.service";
import { EventRoutingService } from "./event-routing.service";
import { EventStreamsService } from "./event-streams.service";
import { UnifiedMessagingService } from "./unified-messaging.service";
import { WorkflowIntegrationService } from "./workflow-integration.service";
import { DistributedCoordinationService } from "./distributed-coordination.service";
import { PlatformAutomationService } from "./platform-automation.service";
import { DeadLetterManagementService } from "./dead-letter-management.service";
import { EventObservabilityService } from "./event-observability.service";
import { PlatformEventMeshService } from "./platform-event-mesh.service";
import { PlatformProductionMegaPack4StatusService } from "./platform-production-mega-pack-4-status.service";
import { PlatformProductionMegaPack4AssuranceService } from "./platform-production-mega-pack-4-assurance.service";

@Controller("avos/platform/production/mega-pack-4")
export class PlatformProductionMegaPack4Controller {
  constructor(
    private readonly registry: EventRegistryService,
    private readonly contracts: EventContractsService,
    private readonly routing: EventRoutingService,
    private readonly streams: EventStreamsService,
    private readonly messaging: UnifiedMessagingService,
    private readonly workflows: WorkflowIntegrationService,
    private readonly coordination: DistributedCoordinationService,
    private readonly automation: PlatformAutomationService,
    private readonly deadLetters: DeadLetterManagementService,
    private readonly observability: EventObservabilityService,
    private readonly mesh: PlatformEventMeshService,
    private readonly statusService: PlatformProductionMegaPack4StatusService,
    private readonly assurance: PlatformProductionMegaPack4AssuranceService,
  ) {}

  @Get("status")
  status() {
    return this.statusService.status();
  }

  @Get("mesh/contracts")
  contractList() {
    return this.contracts.list();
  }

  @Post("mesh/contracts/register")
  contractRegister(@Body() body: any) {
    return this.contracts.register(body);
  }

  @Get("mesh/routes")
  routeList() {
    return this.routing.listRoutes();
  }

  @Post("mesh/routes/register")
  routeRegister(@Body() body: any) {
    return this.routing.registerRoute(body);
  }

  @Post("mesh/publish")
  publish(@Body() body: any) {
    return this.mesh.publishAndRoute(body);
  }

  @Get("mesh/messages")
  messages() {
    return this.messaging.list();
  }

  @Get("mesh/workflows")
  workflowBindings() {
    return this.workflows.listBindings();
  }

  @Get("mesh/automation")
  automationRules() {
    return this.automation.listRules();
  }

  @Get("mesh/coordination")
  coordinationLeases() {
    return this.coordination.list();
  }

  @Get("mesh/dead-letters")
  deadLettersList() {
    return this.deadLetters.list();
  }

  @Post("mesh/dead-letters/replay")
  deadLetterReplay(@Body() body: { id: string }) {
    return this.deadLetters.replay(body.id);
  }

  @Get("mesh/observability")
  observations() {
    return {
      metrics: this.observability.metrics(),
      observations: this.observability.list(),
    };
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