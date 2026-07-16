import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  NervousSystemConsumer,
  NervousSystemProducer
} from "../enterprise-nervous-system-mega-pack-1.types";
import { NervousSystemTopicRegistryService } from "../topics/nervous-system-topic-registry.service";
import { NervousSystemAuditService } from "../observability/nervous-system-audit.service";

@Injectable()
export class NervousSystemEndpointRegistryService {
  private readonly producers =
    new Map<string, NervousSystemProducer>();

  private readonly consumers =
    new Map<string, NervousSystemConsumer>();

  constructor(
    private readonly topics: NervousSystemTopicRegistryService,
    private readonly audit: NervousSystemAuditService
  ) {
    this.seed();
  }

  listProducers() {
    return Array.from(this.producers.values());
  }

  listConsumers() {
    return Array.from(this.consumers.values());
  }

  getProducer(id: string) {
    const producer = this.producers.get(id);

    if (!producer) {
      throw new NotFoundException(
        `Nervous System producer not found: ${id}`
      );
    }

    return producer;
  }

  getConsumer(id: string) {
    const consumer = this.consumers.get(id);

    if (!consumer) {
      throw new NotFoundException(
        `Nervous System consumer not found: ${id}`
      );
    }

    return consumer;
  }

  registerProducer(
    input: Omit<NervousSystemProducer, "createdAt" | "updatedAt">,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    if (this.producers.has(input.id)) {
      throw new ConflictException(
        `Nervous System producer already exists: ${input.id}`
      );
    }

    for (const topic of input.allowedTopics) {
      this.topics.get(topic);
    }

    const now = new Date().toISOString();

    const producer: NervousSystemProducer = {
      ...input,
      allowedTopics: Array.from(new Set(input.allowedTopics)),
      createdAt: now,
      updatedAt: now
    };

    this.producers.set(producer.id, producer);

    this.audit.record({
      correlationId: context.correlationId,
      category: "producer",
      action: "nervous-system-producer-registered",
      subjectId: producer.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        serviceId: producer.serviceId
      }
    });

    return producer;
  }

  registerConsumer(
    input: Omit<NervousSystemConsumer, "createdAt" | "updatedAt">,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    if (this.consumers.has(input.id)) {
      throw new ConflictException(
        `Nervous System consumer already exists: ${input.id}`
      );
    }

    for (const topic of input.subscribedTopics) {
      this.topics.get(topic);
    }

    const now = new Date().toISOString();

    const consumer: NervousSystemConsumer = {
      ...input,
      subscribedTopics:
        Array.from(new Set(input.subscribedTopics)),
      maxConcurrency: Math.max(1, input.maxConcurrency),
      currentConcurrency: Math.max(0, input.currentConcurrency),
      createdAt: now,
      updatedAt: now
    };

    this.consumers.set(consumer.id, consumer);

    this.audit.record({
      correlationId: context.correlationId,
      category: "consumer",
      action: "nervous-system-consumer-registered",
      subjectId: consumer.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        serviceId: consumer.serviceId,
        subscriptions: consumer.subscribedTopics.length
      }
    });

    return consumer;
  }

  consumersForTopic(topic: string) {
    return this.listConsumers().filter(
      (consumer) =>
        consumer.status === "active" &&
        consumer.currentConcurrency < consumer.maxConcurrency &&
        consumer.subscribedTopics.includes(topic)
    );
  }

  updateConsumerConcurrency(
    id: string,
    delta: number
  ) {
    const current = this.getConsumer(id);

    const updated: NervousSystemConsumer = {
      ...current,
      currentConcurrency: Math.max(
        0,
        Math.min(
          current.maxConcurrency,
          current.currentConcurrency + delta
        )
      ),
      updatedAt: new Date().toISOString()
    };

    this.consumers.set(updated.id, updated);
    return updated;
  }

  summary() {
    const producers = this.listProducers();
    const consumers = this.listConsumers();

    return {
      producers: {
        total: producers.length,
        active: producers.filter((x) => x.active).length
      },
      consumers: {
        total: consumers.length,
        active: consumers.filter((x) => x.status === "active").length,
        degraded: consumers.filter((x) => x.status === "degraded").length,
        offline: consumers.filter((x) => x.status === "offline").length
      }
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const producers: NervousSystemProducer[] = [
      {
        id: "producer:enterprise-brain",
        name: "Enterprise Brain Producer",
        serviceId: "enterprise-brain",
        allowedTopics: [
          "avos.platform.events",
          "avos.brain.decisions",
          "avos.system.health"
        ],
        active: true,
        metadata: { seeded: true },
        createdAt: now,
        updatedAt: now
      },
      {
        id: "producer:enterprise-kernel",
        name: "Enterprise Kernel Producer",
        serviceId: "enterprise-kernel",
        allowedTopics: [
          "avos.platform.events",
          "avos.system.health"
        ],
        active: true,
        metadata: { seeded: true },
        createdAt: now,
        updatedAt: now
      }
    ];

    const consumers: NervousSystemConsumer[] = [
      {
        id: "consumer:enterprise-brain",
        name: "Enterprise Brain Consumer",
        serviceId: "enterprise-brain",
        subscribedTopics: [
          "avos.platform.events",
          "avos.system.health"
        ],
        maxConcurrency: 20,
        currentConcurrency: 0,
        status: "active",
        requiresHumanApprovalForCritical: true,
        metadata: { seeded: true },
        createdAt: now,
        updatedAt: now
      },
      {
        id: "consumer:enterprise-kernel",
        name: "Enterprise Kernel Consumer",
        serviceId: "enterprise-kernel",
        subscribedTopics: [
          "avos.brain.decisions",
          "avos.system.health"
        ],
        maxConcurrency: 20,
        currentConcurrency: 0,
        status: "active",
        requiresHumanApprovalForCritical: true,
        metadata: { seeded: true },
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const producer of producers) {
      this.producers.set(producer.id, producer);
    }

    for (const consumer of consumers) {
      this.consumers.set(consumer.id, consumer);
    }
  }
}
