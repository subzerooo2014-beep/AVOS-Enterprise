import {
  V5EventContract,
  V5GatewayRoute,
  V5MicroserviceDefinition,
  V5SagaDefinition,
} from "./contracts";

export interface V5IntegrationTestPlan {
  serviceTests: Array<{
    service: string;
    scenarios: string[];
  }>;
  gatewayTests: Array<{
    route: string;
    scenarios: string[];
  }>;
  eventTests: Array<{
    event: string;
    scenarios: string[];
  }>;
  sagaTests: Array<{
    saga: string;
    scenarios: string[];
  }>;
}

export class V5IntegrationTestPlanGenerator {
  generate(
    services: readonly V5MicroserviceDefinition[],
    routes: readonly V5GatewayRoute[],
    events: readonly V5EventContract[],
    sagas: readonly V5SagaDefinition[],
  ): V5IntegrationTestPlan {
    return {
      serviceTests: services.map((service) => ({
        service: service.key,
        scenarios: [
          "health endpoint returns healthy",
          "readiness endpoint returns ready",
          "service contract is honored",
        ],
      })),
      gatewayTests: routes.map((route) => ({
        route: route.path,
        scenarios: [
          "route resolves to target service",
          "timeout policy is applied",
          "retry policy is applied",
        ],
      })),
      eventTests: events.map((event) => ({
        event: event.key,
        scenarios: [
          "schema validation passes",
          "consumer receives event",
          "dead-letter path handles failures",
        ],
      })),
      sagaTests: sagas.map((saga) => ({
        saga: saga.key,
        scenarios: [
          "happy path completes",
          "compensation executes on failure",
          "idempotency prevents duplicate effects",
        ],
      })),
    };
  }
}
