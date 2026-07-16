import {
  ConflictException,
  Injectable
} from "@nestjs/common";
import { NervousSystemEventEnvelope } from "../enterprise-nervous-system-mega-pack-1.types";
import { NervousSystemContractRegistryService } from "../contracts/nervous-system-contract-registry.service";
import { NervousSystemTopicRegistryService } from "../topics/nervous-system-topic-registry.service";
import { NervousSystemEndpointRegistryService } from "../producers/nervous-system-endpoint-registry.service";
import { NervousSystemDeliveryService } from "../delivery/nervous-system-delivery.service";
import { NervousSystemCorrelationService } from "../correlation/nervous-system-correlation.service";
import { NervousSystemAuditService } from "../observability/nervous-system-audit.service";

@Injectable()
export class NervousSystemEventBusService {
  private readonly events =
    new Map<string, NervousSystemEventEnvelope>();

  private readonly topicSequence =
    new Map<string, number>();

  constructor(
    private readonly contracts: NervousSystemContractRegistryService,
    private readonly topics: NervousSystemTopicRegistryService,
    private readonly endpoints: NervousSystemEndpointRegistryService,
    private readonly deliveries: NervousSystemDeliveryService,
    private readonly correlation: NervousSystemCorrelationService,
    private readonly audit: NervousSystemAuditService
  ) {}

  list() {
    return Array.from(this.events.values());
  }

  get(id: string) {
    const event = this.events.get(id);

    if (!event) {
      throw new Error(`Nervous System event not found: ${id}`);
    }

    return event;
  }

  publish(input: {
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
  }) {
    const producer = this.endpoints.getProducer(input.producerId);

    if (!producer.active) {
      throw new ConflictException(
        `Producer is not active: ${producer.id}`
      );
    }

    this.topics.get(input.topic);

    if (!producer.allowedTopics.includes(input.topic)) {
      throw new ConflictException(
        `Producer cannot publish to topic: ${input.topic}`
      );
    }

    const traceId =
      input.traceId ??
      `nervous-trace:${Date.now()}`;

    const headers = {
      ...(input.headers ?? {}),
      "x-avos-correlation-id": input.correlationId,
      "x-avos-trace-id": traceId
    };

    const validation = this.contracts.validateEnvelope({
      contractId: input.contractId,
      topic: input.topic,
      producerId: input.producerId,
      headers
    });

    if (!validation.valid) {
      throw new ConflictException({
        message: "Event envelope failed contract validation.",
        checks: validation.checks
      });
    }

    const sequence =
      (this.topicSequence.get(input.topic) ?? 0) + 1;

    this.topicSequence.set(input.topic, sequence);

    const event: NervousSystemEventEnvelope = {
      id: `nervous-event:${Date.now()}:${this.events.size + 1}`,
      contractId: input.contractId,
      topic: input.topic,
      producerId: input.producerId,
      key: input.key,
      payload: input.payload,
      headers,
      priority: input.priority ?? "normal",
      correlationId: input.correlationId,
      causationId: input.causationId,
      traceId,
      sequence,
      createdAt: new Date().toISOString()
    };

    this.events.set(event.id, event);

    this.correlation.attachEvent(
      event.correlationId,
      event.traceId,
      event.id
    );

    const deliveries =
      this.deliveries.createForEvent(event);

    const deliveryResults =
      input.autoDeliver === false
        ? deliveries
        : deliveries.map((delivery) =>
            this.deliveries.deliver(
              delivery.id,
              event
            )
          );

    this.audit.record({
      correlationId: event.correlationId,
      category: "event",
      action: "nervous-system-event-published",
      subjectId: event.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        topic: event.topic,
        sequence: event.sequence,
        deliveries: deliveries.length
      }
    });

    return {
      event,
      deliveries: deliveryResults
    };
  }

  summary() {
    const events = this.list();

    return {
      total: events.length,
      critical:
        events.filter((x) => x.priority === "critical").length,
      topics: new Set(events.map((x) => x.topic)).size,
      correlated:
        events.filter((x) => x.correlationId.length > 0).length
    };
  }
}
