import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { FoundationCompletionPack6Service } from "./foundation-completion-pack-6.service";
import { EventContractRegistryService } from "./contracts/event-contract-registry.service";
import { EnterpriseEventBackboneService } from "./events/enterprise-event-backbone.service";
import { EventSubscriptionRegistryService } from "./subscriptions/event-subscription-registry.service";
import { EnterpriseEventRouterService } from "./routing/enterprise-event-router.service";
import { AutonomousOrchestrationPlanService } from "./orchestration/autonomous-orchestration-plan.service";
import { AutonomousOrchestrationRuntimeService } from "./execution/autonomous-orchestration-runtime.service";
import { HumanApprovalGateService } from "./approval/human-approval-gate.service";
import { DeadLetterQueueService } from "./recovery/dead-letter-queue.service";
import { NervousSystemTraceService } from "./observability/nervous-system-trace.service";
import {
  EventContractDefinition,
  EventSubscription,
  NervousSystemEventPriority,
  OrchestrationStepDefinition
} from "./foundation-pack-6.types";

@Controller("foundation-completion-v6")
export class FoundationCompletionPack6Controller {
  constructor(
    private readonly pack: FoundationCompletionPack6Service,
    private readonly contracts: EventContractRegistryService,
    private readonly events: EnterpriseEventBackboneService,
    private readonly subscriptions: EventSubscriptionRegistryService,
    private readonly router: EnterpriseEventRouterService,
    private readonly plans: AutonomousOrchestrationPlanService,
    private readonly runtime: AutonomousOrchestrationRuntimeService,
    private readonly approvals: HumanApprovalGateService,
    private readonly deadLetters: DeadLetterQueueService,
    private readonly trace: NervousSystemTraceService
  ) {}

  @Get("status")
  status() {
    return this.pack.status();
  }

  @Get("verification")
  verification() {
    return this.pack.verification();
  }

  @Get("contracts")
  contractList() {
    return {
      summary: this.contracts.summary(),
      items: this.contracts.list()
    };
  }

  @Post("contracts")
  registerContract(
    @Body()
    body: Omit<EventContractDefinition, "createdAt" | "updatedAt">
  ) {
    return this.contracts.register(body);
  }

  @Post("contracts/validate")
  validateContractPayload(
    @Body()
    body: {
      eventType: string;
      version: string;
      payload: Record<string, unknown>;
    }
  ) {
    return this.contracts.validatePayload(
      body.eventType,
      body.version,
      body.payload
    );
  }

  @Get("subscriptions")
  subscriptionList() {
    return {
      summary: this.subscriptions.summary(),
      items: this.subscriptions.list()
    };
  }

  @Post("subscriptions")
  registerSubscription(
    @Body()
    body: Omit<EventSubscription, "createdAt" | "updatedAt">
  ) {
    return this.subscriptions.register(body);
  }

  @Post("subscriptions/:id/active")
  setSubscriptionActive(
    @Param("id") id: string,
    @Body() body: { active: boolean }
  ) {
    return this.subscriptions.setActive(id, body.active);
  }

  @Get("events")
  eventList() {
    return {
      summary: this.events.summary(),
      items: this.events.list()
    };
  }

  @Get("events/:id")
  event(@Param("id") id: string) {
    return this.events.get(id);
  }

  @Post("events")
  publishEvent(
    @Body()
    body: {
      eventType: string;
      eventVersion: string;
      sourceCapabilityId: string;
      sourceIdentityId: string;
      subjectId: string;
      correlationId: string;
      causationId?: string;
      priority: NervousSystemEventPriority;
      payload: Record<string, unknown>;
      metadata?: Record<string, unknown>;
      occurredAt?: string;
    }
  ) {
    return this.events.publish(body);
  }

  @Post("events/:id/route")
  routeEvent(@Param("id") id: string) {
    return this.router.route(id);
  }

  @Get("events/:id/deliveries")
  eventDeliveries(@Param("id") id: string) {
    return {
      eventId: id,
      items: this.router.byEvent(id)
    };
  }

  @Post("deliveries/:id/acknowledge")
  acknowledgeDelivery(
    @Param("id") id: string,
    @Body()
    body: {
      success: boolean;
      error?: string;
      actorIdentityId: string;
    }
  ) {
    return this.router.acknowledge(id, body);
  }

  @Get("orchestrations")
  orchestrationList() {
    return {
      summary: this.plans.summary(),
      items: this.plans.list()
    };
  }

  @Post("orchestrations")
  createOrchestration(
    @Body()
    body: {
      name: string;
      description: string;
      objective: string;
      correlationId: string;
      requestedByIdentityId: string;
      steps: OrchestrationStepDefinition[];
      context?: Record<string, unknown>;
    }
  ) {
    return this.plans.create(body);
  }

  @Get("orchestrations/:id")
  orchestration(@Param("id") id: string) {
    return this.runtime.snapshot(id);
  }

  @Post("orchestrations/:id/start")
  startOrchestration(
    @Param("id") id: string,
    @Body() body: { actorIdentityId: string }
  ) {
    return this.runtime.start(id, body.actorIdentityId);
  }

  @Post("orchestrations/:id/advance")
  advanceOrchestration(
    @Param("id") id: string,
    @Body() body: { actorIdentityId: string }
  ) {
    return this.runtime.advance(id, body.actorIdentityId);
  }

  @Post("orchestrations/:planId/steps/:stepId/complete")
  completeStep(
    @Param("planId") planId: string,
    @Param("stepId") stepId: string,
    @Body()
    body: {
      success: boolean;
      actorIdentityId: string;
      output?: Record<string, unknown>;
      error?: string;
    }
  ) {
    return this.runtime.completeStep(planId, stepId, body);
  }

  @Post("orchestrations/:planId/approvals/:approvalId/decide")
  decideApproval(
    @Param("planId") planId: string,
    @Param("approvalId") approvalId: string,
    @Body()
    body: {
      approved: boolean;
      approverIdentityId: string;
      decisionNote: string;
    }
  ) {
    return this.runtime.resumeAfterApproval(
      planId,
      approvalId,
      body
    );
  }

  @Get("approvals")
  approvalList() {
    return {
      summary: this.approvals.summary(),
      items: this.approvals.list()
    };
  }

  @Get("dead-letters")
  deadLetterList() {
    return {
      summary: this.deadLetters.summary(),
      items: this.deadLetters.list()
    };
  }

  @Post("dead-letters/:id/replay")
  replayDeadLetter(@Param("id") id: string) {
    return this.deadLetters.markReplayed(id);
  }

  @Get("trace")
  traceList() {
    return {
      summary: this.trace.summary(),
      items: this.trace.list()
    };
  }

  @Get("trace/correlation/:correlationId")
  traceByCorrelation(
    @Param("correlationId") correlationId: string
  ) {
    return {
      correlationId,
      events: this.events.byCorrelation(correlationId),
      trace: this.trace.byCorrelation(correlationId)
    };
  }
}
