import { Injectable } from "@nestjs/common";
import { AdaptiveGrowthCapabilityDispatcherService } from "./adaptive-growth-capability-dispatcher.service";
import { AdaptiveGrowthEnterpriseEventBusService } from "./adaptive-growth-enterprise-event-bus.service";

@Injectable()
export class AdaptiveGrowthEnterpriseOrchestratorService {
  constructor(
    private readonly dispatcher: AdaptiveGrowthCapabilityDispatcherService,
    private readonly events: AdaptiveGrowthEnterpriseEventBusService,
  ) {}

  coordinate(input: {
    objective: string;
    capabilityKey: string;
    operation: string;
    payload?: Record<string, unknown>;
    requestedBy?: string;
    correlationId?: string;
  }) {
    const correlationId =
      input.correlationId ?? `ags-correlation:${Date.now()}`;

    this.events.publish({
      type: "ags.orchestration.started",
      source: "adaptive-growth-studio",
      correlationId,
      data: { objective: input.objective },
    });

    const invocation = this.dispatcher.dispatch({
      capabilityKey: input.capabilityKey,
      operation: input.operation,
      payload: input.payload,
      requestedBy: input.requestedBy,
    });

    this.events.publish({
      type: "ags.orchestration.completed",
      source: "adaptive-growth-studio",
      correlationId,
      data: {
        objective: input.objective,
        invocationId: invocation.id,
      },
    });

    return {
      correlationId,
      objective: input.objective,
      status: "completed",
      invocation,
    };
  }

  status() {
    return {
      name: "AGS Enterprise Orchestrator",
      status: "operational",
      capabilityFirst: true,
      crossPlatformExecution: true,
      distributedExecutionFoundation: true,
    };
  }
}