import {
  Body,
  Controller,
  Get,
  Param,
  Post
} from "@nestjs/common";
import { EnterpriseNervousSystemMegaPack1Service } from "./enterprise-nervous-system-mega-pack-1.service";
import { NervousSystemContractRegistryService } from "./contracts/nervous-system-contract-registry.service";
import { NervousSystemTopicRegistryService } from "./topics/nervous-system-topic-registry.service";
import { NervousSystemEndpointRegistryService } from "./producers/nervous-system-endpoint-registry.service";
import { NervousSystemEventBusService } from "./routing/nervous-system-event-bus.service";
import { NervousSystemDeliveryService } from "./delivery/nervous-system-delivery.service";
import { NervousSystemRetryService } from "./retry/nervous-system-retry.service";
import { NervousSystemDeadLetterService } from "./dead-letter/nervous-system-dead-letter.service";
import { NervousSystemCorrelationService } from "./correlation/nervous-system-correlation.service";
import { NervousSystemHealthService } from "./health/nervous-system-health.service";
import { NervousSystemAuditService } from "./observability/nervous-system-audit.service";
import {
  NervousSystemConsumer,
  NervousSystemEventContract,
  NervousSystemEventEnvelope,
  NervousSystemProducer,
  NervousSystemTopic
} from "./enterprise-nervous-system-mega-pack-1.types";

@Controller("enterprise-nervous-system-v1")
export class EnterpriseNervousSystemMegaPack1Controller {
  constructor(
    private readonly pack: EnterpriseNervousSystemMegaPack1Service,
    private readonly contracts: NervousSystemContractRegistryService,
    private readonly topics: NervousSystemTopicRegistryService,
    private readonly endpoints: NervousSystemEndpointRegistryService,
    private readonly eventBus: NervousSystemEventBusService,
    private readonly deliveries: NervousSystemDeliveryService,
    private readonly retry: NervousSystemRetryService,
    private readonly deadLetters: NervousSystemDeadLetterService,
    private readonly traces: NervousSystemCorrelationService,
    private readonly health: NervousSystemHealthService,
    private readonly audit: NervousSystemAuditService
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
        NervousSystemEventContract,
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

  @Get("topics")
  topicList() {
    return {
      summary: this.topics.summary(),
      items: this.topics.list()
    };
  }

  @Post("topics")
  registerTopic(
    @Body()
    body: {
      topic: Omit<
        NervousSystemTopic,
        "createdAt" | "updatedAt"
      >;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.topics.register(
      body.topic,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Get("producers")
  producerList() {
    return {
      summary: this.endpoints.summary().producers,
      items: this.endpoints.listProducers()
    };
  }

  @Post("producers")
  registerProducer(
    @Body()
    body: {
      producer: Omit<
        NervousSystemProducer,
        "createdAt" | "updatedAt"
      >;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.endpoints.registerProducer(
      body.producer,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Get("consumers")
  consumerList() {
    return {
      summary: this.endpoints.summary().consumers,
      items: this.endpoints.listConsumers()
    };
  }

  @Post("consumers")
  registerConsumer(
    @Body()
    body: {
      consumer: Omit<
        NervousSystemConsumer,
        "createdAt" | "updatedAt"
      >;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.endpoints.registerConsumer(
      body.consumer,
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
      topic: string;
      producerId: string;
      key?: string;
      payload: unknown;
      headers?: Record<string, string>;
      priority?: NervousSystemEventEnvelope["priority"];
      correlationId: string;
      causationId?: string;
      traceId?: string;
      actorIdentityId: string;
      autoDeliver?: boolean;
    }
  ) {
    return this.eventBus.publish(body);
  }

  @Get("events")
  eventList() {
    return {
      summary: this.eventBus.summary(),
      items: this.eventBus.list()
    };
  }

  @Get("deliveries")
  deliveryList() {
    return {
      summary: this.deliveries.summary(),
      items: this.deliveries.list()
    };
  }

  @Post("deliveries/:id/retry")
  retryDelivery(
    @Param("id") id: string,
    @Body()
    body: {
      eventId: string;
      actorIdentityId: string;
    }
  ) {
    return this.retry.retry({
      deliveryId: id,
      event: this.eventBus.get(body.eventId),
      actorIdentityId: body.actorIdentityId
    });
  }

  @Get("dead-letters")
  deadLetterList() {
    return {
      summary: this.deadLetters.summary(),
      items: this.deadLetters.list()
    };
  }

  @Post("dead-letters/:id/mark-replayed")
  markDeadLetterReplayed(
    @Param("id") id: string
  ) {
    return this.deadLetters.markReplayed(id);
  }

  @Get("traces")
  traceList() {
    return {
      summary: this.traces.summary(),
      items: this.traces.list()
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
