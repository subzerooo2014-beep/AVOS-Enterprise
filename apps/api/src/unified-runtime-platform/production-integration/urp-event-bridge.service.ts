import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { UrpAdapterCatalogService } from "./urp-adapter-catalog.service";
import { UrpEndpointDiscoveryService } from "./urp-endpoint-discovery.service";
import { UrpBridgeEvent } from "./urp-production.contracts";
import { UrpResilienceService } from "./urp-resilience.service";

@Injectable()
export class UrpEventBridgeService {
  private readonly recent: UrpBridgeEvent[] = [];

  constructor(
    private readonly catalog: UrpAdapterCatalogService,
    private readonly discovery: UrpEndpointDiscoveryService,
    private readonly resilience: UrpResilienceService,
  ) {}

  async bridge(input: Omit<UrpBridgeEvent, "id" | "correlationId" | "occurredAt"> & {
    correlationId?: string;
  }) {
    this.catalog.get(input.source);

    const event: UrpBridgeEvent = {
      id: "urp-bridge-event:" + randomUUID(),
      topic: input.topic,
      type: input.type,
      source: input.source,
      target: input.target,
      payload: input.payload,
      correlationId: input.correlationId ?? "urp-correlation:" + randomUUID(),
      occurredAt: new Date().toISOString(),
    };

    this.recent.unshift(event);
    this.recent.splice(1000);

    const targets = input.target
      ? [this.catalog.get(input.target)]
      : this.catalog
          .list()
          .filter(
            (adapter) =>
              adapter.key !== input.source &&
              adapter.eventTopics.some((pattern) =>
                this.matches(pattern, input.topic),
              ),
          );

    const deliveries = [];

    for (const target of targets) {
      const endpoint = await this.discovery.discover(target.key, "event");

      if (endpoint.status !== "available") {
        deliveries.push({
          target: target.key,
          status: "skipped",
          reason: "No event endpoint discovered.",
        });
        continue;
      }

      try {
        const delivery = await this.resilience.execute(
          target.key + ":event",
          async () => {
            const response = await fetch(endpoint.url, {
              method: endpoint.method,
              headers: {
                "content-type": "application/json",
                "x-avos-correlation-id": event.correlationId,
              },
              body: JSON.stringify(event),
            });

            if (!response.ok) {
              throw new Error(
                "Event bridge HTTP failure: " + response.status,
              );
            }

            return {
              target: target.key,
              status: "delivered",
              statusCode: response.status,
            };
          },
          { timeoutMs: 4000, retries: 1 },
        );

        deliveries.push(delivery);
      } catch (error) {
        deliveries.push({
          target: target.key,
          status: "isolated-failure",
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return {
      event,
      deliveries,
      bridgedAt: new Date().toISOString(),
    };
  }

  list(limit = 100) {
    return this.recent.slice(0, Math.min(Math.max(limit, 1), 1000));
  }

  private matches(pattern: string, topic: string) {
    if (pattern === "*") return true;
    if (pattern.endsWith("*")) {
      return topic.startsWith(pattern.slice(0, -1));
    }
    return pattern === topic;
  }
}