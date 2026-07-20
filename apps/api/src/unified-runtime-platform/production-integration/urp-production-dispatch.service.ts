import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { UrpAdapterCatalogService } from "./urp-adapter-catalog.service";
import { UrpEndpointDiscoveryService } from "./urp-endpoint-discovery.service";
import {
  UrpDispatchRequest,
  UrpDiscoveredEndpoint,
} from "./urp-production.contracts";
import { UrpResilienceService } from "./urp-resilience.service";

@Injectable()
export class UrpProductionDispatchService {
  constructor(
    private readonly catalog: UrpAdapterCatalogService,
    private readonly discovery: UrpEndpointDiscoveryService,
    private readonly resilience: UrpResilienceService,
  ) {}

  async dispatch(input: UrpDispatchRequest) {
    this.catalog.get(input.unitKey);

    if (!input.requestedBy?.startsWith("human:") && input.operation === "command") {
      throw new Error(
        "Production command dispatch requires Human Final Authority.",
      );
    }

    const endpoint = await this.resolveEndpoint(
      input.unitKey,
      input.operation,
    );

    if (endpoint.status !== "available") {
      throw new Error(
        "No available production endpoint for " +
          input.unitKey +
          " operation " +
          input.operation,
      );
    }

    const correlationId =
      input.correlationId ?? "urp-production:" + randomUUID();

    const started = Date.now();
    const result = await this.resilience.execute(
      input.unitKey + ":" + input.operation,
      async () => {
        const response = await fetch(endpoint.url, {
          method: endpoint.method,
          headers: {
            "content-type": "application/json",
            "x-avos-correlation-id": correlationId,
            "x-avos-runtime-version": "URP-1.1.0",
          },
          body:
            endpoint.method === "POST"
              ? JSON.stringify({
                  name: input.name,
                  objective: input.name,
                  payload: input.payload ?? {},
                  requestedBy: input.requestedBy,
                  correlationId,
                })
              : undefined,
        });

        const text = await response.text();
        let body: unknown = text;

        try {
          body = text ? JSON.parse(text) : {};
        } catch {
          body = text;
        }

        if (!response.ok) {
          throw new Error(
            "Production dispatch failed with HTTP " +
              response.status +
              ": " +
              text.slice(0, 500),
          );
        }

        return {
          status: "completed",
          unitKey: input.unitKey,
          operation: input.operation,
          name: input.name,
          endpoint: endpoint.url,
          correlationId,
          statusCode: response.status,
          latencyMs: Date.now() - started,
          response: body,
          completedAt: new Date().toISOString(),
        };
      },
      {
        timeoutMs: input.timeoutMs,
        retries: input.retries,
      },
    );

    return result;
  }

  private async resolveEndpoint(
    unitKey: string,
    operation: "command" | "query",
  ): Promise<UrpDiscoveredEndpoint> {
    const direct = await this.discovery.discover(unitKey, operation);
    if (direct.status === "available") return direct;

    const health = await this.discovery.discover(unitKey, "health");
    return {
      ...health,
      operation,
    };
  }
}