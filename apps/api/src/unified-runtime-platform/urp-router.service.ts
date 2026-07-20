import { Injectable } from "@nestjs/common";
import {
  UrpCommand,
  UrpEvent,
  UrpQuery,
  UrpRoute,
} from "./urp.contracts";
import { UrpRuntimeContextService } from "./urp-runtime-context.service";
import { UrpRuntimeRegistryService } from "./urp-runtime-registry.service";

type Handler = (message: any) => unknown | Promise<unknown>;

@Injectable()
export class UrpRouterService {
  private readonly routes = new Map<string, UrpRoute>();
  private readonly handlers = new Map<string, Handler>();
  private readonly events: UrpEvent[] = [];

  constructor(
    private readonly context: UrpRuntimeContextService,
    private readonly registry: UrpRuntimeRegistryService,
  ) {}

  registerRoute(route: UrpRoute, handler?: Handler) {
    this.registry.get(route.target);
    this.routes.set(route.key, route);
    if (handler) this.handlers.set(route.key, handler);
    return route;
  }

  async command(input: {
    name: string;
    target: string;
    payload?: unknown;
    requestedBy?: string;
    correlationId?: string;
  }) {
    const command: UrpCommand = {
      id: this.context.operationId("urp-command"),
      name: input.name,
      target: input.target,
      payload: input.payload ?? {},
      requestedBy: input.requestedBy ?? "human:khalifa",
      correlationId: this.context.correlationId(input.correlationId),
      createdAt: new Date().toISOString(),
    };

    return this.dispatch("command", command.name, command.target, command);
  }

  async query(input: {
    name: string;
    target: string;
    payload?: unknown;
    requestedBy?: string;
    correlationId?: string;
  }) {
    const query: UrpQuery = {
      id: this.context.operationId("urp-query"),
      name: input.name,
      target: input.target,
      payload: input.payload ?? {},
      requestedBy: input.requestedBy ?? "human:khalifa",
      correlationId: this.context.correlationId(input.correlationId),
      createdAt: new Date().toISOString(),
    };

    return this.dispatch("query", query.name, query.target, query);
  }

  publish(input: {
    topic: string;
    type: string;
    source: string;
    payload?: unknown;
    correlationId?: string;
  }) {
    this.registry.get(input.source);

    const event: UrpEvent = {
      id: this.context.operationId("urp-event"),
      topic: input.topic,
      type: input.type,
      source: input.source,
      payload: input.payload ?? {},
      correlationId: this.context.correlationId(input.correlationId),
      occurredAt: new Date().toISOString(),
    };

    this.events.unshift(event);
    this.events.splice(500);
    return event;
  }

  recentEvents(limit = 100) {
    return this.events.slice(0, Math.min(Math.max(limit, 1), 500));
  }

  listRoutes() {
    return [...this.routes.values()];
  }

  private async dispatch(
    type: UrpRoute["type"],
    name: string,
    target: string,
    message: unknown,
  ) {
    const targetUnit = this.registry.get(target);
    if (targetUnit.status !== "operational") {
      throw new Error("Target runtime unit is not operational: " + target);
    }

    const route = [...this.routes.values()]
      .filter(
        (item) =>
          item.enabled &&
          item.type === type &&
          item.target === target &&
          (item.key === name || item.key === "*"),
      )
      .sort((a, b) => a.priority - b.priority)[0];

    if (!route) {
      return {
        status: "accepted",
        routedTo: target,
        route: "default-runtime-adapter",
        message,
      };
    }

    const handler = this.handlers.get(route.key);
    return handler
      ? handler(message)
      : { status: "accepted", routedTo: target, route, message };
  }
}