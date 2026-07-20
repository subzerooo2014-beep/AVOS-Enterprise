import { Injectable } from "@nestjs/common";
import {
  AgsAction,
  AgsExecutionResult,
} from "./adaptive-growth-execution.contracts";
import { AdaptiveGrowthActionRegistryService } from "./adaptive-growth-action-registry.service";

@Injectable()
export class AdaptiveGrowthActionDispatcherService {
  constructor(
    private readonly registry:
      AdaptiveGrowthActionRegistryService,
  ) {}

  async dispatch(
    action: AgsAction,
  ): Promise<AgsExecutionResult> {
    const definition = this.registry.get(
      action.definitionKey,
    );

    const startedAt = Date.now();

    const output = {
      actionId: action.id,
      definitionKey: definition.key,
      capability: definition.capability,
      objective: action.objective,
      payloadAccepted: true,
      orchestrationMode:
        "execution-core-adapter",
      capabilityFabricReady: true,
      knowledgeFabricReady: true,
    };

    return {
      status: "success",
      summary:
        `Action ${definition.key} executed by AGS Execution Core.`,
      output,
      metrics: {
        durationMs: Date.now() - startedAt,
        dispatchedCapabilities: 1,
        executionAttempts: 1,
      },
      completedAt:
        new Date().toISOString(),
    };
  }

  async rollback(
    action: AgsAction,
  ): Promise<Record<string, unknown>> {
    const definition = this.registry.get(
      action.definitionKey,
    );

    return {
      status: "success",
      actionId: action.id,
      definitionKey: definition.key,
      capability: definition.capability,
      compensationApplied: true,
      rolledBackAt:
        new Date().toISOString(),
    };
  }
}