import { Injectable } from "@nestjs/common";
import { IntegrationExecutionObservabilityService } from "./integration-execution-observability.service";
import { IntegrationRoutingService } from "./integration-routing.service";

@Injectable()
export class WebhookOrchestratorService {
  constructor(
    private readonly routing: IntegrationRoutingService,
    private readonly observability: IntegrationExecutionObservabilityService,
  ) {}

  dispatch(
    operation: string,
    payload: Record<string, unknown>,
  ): {
    success: boolean;
    dispatched: number;
    routes: unknown[];
  } {
    const routes = this.routing.resolve(operation);

    const dispatched = routes.map((route) => {
      const execution = this.observability.begin(route.id, route.target);
      this.observability.complete(execution.id);

      return {
        route,
        executionId: execution.id,
        payload,
      };
    });

    return {
      success: true,
      dispatched: dispatched.length,
      routes: dispatched,
    };
  }
}
