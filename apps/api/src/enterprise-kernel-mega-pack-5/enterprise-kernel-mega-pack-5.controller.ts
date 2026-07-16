import {
  Body,
  Controller,
  Get,
  Param,
  Post
} from "@nestjs/common";
import { EnterpriseKernelMegaPack5Service } from "./enterprise-kernel-mega-pack-5.service";
import { KernelMessageContractRegistryService } from "./contracts/kernel-message-contract-registry.service";
import { KernelSubscriptionRegistryService } from "./delivery/kernel-subscription-registry.service";
import { KernelEventBusService } from "./events/kernel-event-bus.service";
import { KernelCommandBusService } from "./commands/kernel-command-bus.service";
import { KernelQueryBusService } from "./queries/kernel-query-bus.service";
import { KernelDeliveryService } from "./delivery/kernel-delivery.service";
import { KernelDeadLetterService } from "./dead-letter/kernel-dead-letter.service";
import { KernelOrchestrationService } from "./orchestration/kernel-orchestration.service";
import { KernelMessagingHealthService } from "./health/kernel-messaging-health.service";
import { KernelMessagingAuditService } from "./observability/kernel-messaging-audit.service";
import {
  KernelExecutionStep,
  KernelMessageContract,
  KernelSubscription
} from "./enterprise-kernel-mega-pack-5.types";

@Controller("enterprise-kernel-v5")
export class EnterpriseKernelMegaPack5Controller {
  constructor(
    private readonly pack: EnterpriseKernelMegaPack5Service,
    private readonly contracts: KernelMessageContractRegistryService,
    private readonly subscriptions: KernelSubscriptionRegistryService,
    private readonly events: KernelEventBusService,
    private readonly commands: KernelCommandBusService,
    private readonly queries: KernelQueryBusService,
    private readonly delivery: KernelDeliveryService,
    private readonly deadLetters: KernelDeadLetterService,
    private readonly orchestration: KernelOrchestrationService,
    private readonly health: KernelMessagingHealthService,
    private readonly audit: KernelMessagingAuditService
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
    body: {
      contract: Omit<
        KernelMessageContract,
        "createdAt" | "updatedAt"
      >;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.contracts.register(
      body.contract,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
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
    body: {
      subscription: Omit<
        KernelSubscription,
        "createdAt" | "updatedAt"
      >;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.subscriptions.register(
      body.subscription,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Post("events/publish")
  publishEvent(
    @Body()
    body: {
      contractId: string;
      payload: Record<string, unknown>;
      producerId: string;
      actorIdentityId: string;
      correlationId: string;
      causationId?: string;
      traceId?: string;
      headers?: Record<string, string>;
      simulateFailureForConsumerIds?: string[];
    }
  ) {
    return this.events.publish(body);
  }

  @Get("events")
  eventList() {
    return {
      summary: this.events.summary(),
      items: this.events.list()
    };
  }

  @Post("commands/dispatch")
  dispatchCommand(
    @Body()
    body: {
      contractId: string;
      payload: Record<string, unknown>;
      producerId: string;
      actorIdentityId: string;
      correlationId: string;
      causationId?: string;
      traceId?: string;
      headers?: Record<string, string>;
      simulateFailure?: boolean;
    }
  ) {
    return this.commands.dispatch(body);
  }

  @Get("commands")
  commandList() {
    return {
      summary: this.commands.summary(),
      commands: this.commands.listCommands(),
      results: this.commands.listResults()
    };
  }

  @Post("queries/execute")
  executeQuery(
    @Body()
    body: {
      contractId: string;
      payload: Record<string, unknown>;
      producerId: string;
      actorIdentityId: string;
      correlationId: string;
      traceId?: string;
    }
  ) {
    return this.queries.execute(body);
  }

  @Get("queries")
  queryList() {
    return {
      summary: this.queries.summary(),
      queries: this.queries.listQueries(),
      results: this.queries.listResults()
    };
  }

  @Get("delivery/attempts")
  deliveryAttempts() {
    return {
      summary: this.delivery.summary(),
      items: this.delivery.listAttempts()
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
  replayDeadLetter(
    @Param("id") id: string,
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.deadLetters.markReplayed({
      deadLetterId: id,
      ...body
    });
  }

  @Post("orchestration/plans")
  createPlan(
    @Body()
    body: {
      name: string;
      description: string;
      steps: Array<Omit<
        KernelExecutionStep,
        "status" | "startedAt" | "completedAt" | "result" | "error"
      >>;
      correlationId: string;
      traceId?: string;
      createdByIdentityId: string;
      reversible: boolean;
    }
  ) {
    return this.orchestration.createPlan(body);
  }

  @Get("orchestration/plans")
  planList() {
    return {
      summary: this.orchestration.summary(),
      items: this.orchestration.listPlans()
    };
  }

  @Post("orchestration/plans/:id/approve")
  approvePlan(
    @Param("id") id: string,
    @Body()
    body: {
      approvedByIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.orchestration.approve({
      planId: id,
      ...body
    });
  }

  @Post("orchestration/plans/:id/execute")
  executePlan(
    @Param("id") id: string,
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.orchestration.execute({
      planId: id,
      ...body
    });
  }

  @Post("orchestration/plans/:id/compensate")
  compensatePlan(
    @Param("id") id: string,
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.orchestration.compensate({
      planId: id,
      ...body
    });
  }

  @Get("orchestration/traces")
  orchestrationTraces() {
    return {
      total: this.orchestration.listTraces().length,
      items: this.orchestration.listTraces()
    };
  }

  @Post("health/calculate")
  calculateHealth(
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.health.calculate(body);
  }

  @Get("health")
  healthList() {
    return {
      summary: this.health.summary(),
      items: this.health.list()
    };
  }

  @Get("audit")
  auditList() {
    return {
      summary: this.audit.summary(),
      items: this.audit.list()
    };
  }
}
