import { Injectable } from "@nestjs/common";
import { AdaptiveGrowthUltimateIdService } from "./adaptive-growth-ultimate-id.service";
import { AdaptiveGrowthUltimateStoreService } from "./adaptive-growth-ultimate-store.service";
import { AdaptiveGrowthCapabilityRegistryService } from "./adaptive-growth-capability-registry.service";

@Injectable()
export class AdaptiveGrowthCapabilityDispatcherService {
  constructor(
    private readonly ids: AdaptiveGrowthUltimateIdService,
    private readonly store: AdaptiveGrowthUltimateStoreService,
    private readonly registry: AdaptiveGrowthCapabilityRegistryService,
  ) {}

  dispatch(input: {
    workflowId?: string;
    capabilityKey: string;
    operation: string;
    payload?: Record<string, unknown>;
    requestedBy?: string;
  }) {
    const capability = this.registry.resolve(input.capabilityKey);

    if (!capability.operations.includes(input.operation)) {
      throw new Error(
        `Operation ${input.operation} is not registered for ${input.capabilityKey}`,
      );
    }

    const now = new Date().toISOString();
    const invocation = {
      id: this.ids.create("ags-capability-invocation"),
      workflowId: input.workflowId,
      capabilityKey: input.capabilityKey,
      operation: input.operation,
      payload: input.payload ?? {},
      requestedBy: input.requestedBy ?? "system:ags-ultimate",
      status: "completed" as const,
      attempts: 1,
      result: {
        accepted: true,
        capabilityOwner: capability.owner,
        operation: input.operation,
        coordinatedThrough: "AGS Ultimate Orchestrator",
      },
      createdAt: now,
      updatedAt: now,
    };

    this.store.invocations.set(invocation.id, invocation);
    return invocation;
  }

  list() {
    return [...this.store.invocations.values()];
  }

  status() {
    return {
      status: "operational",
      invocations: this.store.invocations.size,
      distributedExecutionFoundation: true,
      capabilityFabricIntegrated: true,
    };
  }
}