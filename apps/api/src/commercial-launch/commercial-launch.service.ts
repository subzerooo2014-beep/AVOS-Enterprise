import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { COMMERCIAL_LAUNCH_CAPABILITIES } from "./commercial-launch.registry";
import {
  CommercialLaunchExecutionRequest,
  CommercialLaunchExecutionResult,
} from "./commercial-launch.types";

@Injectable()
export class CommercialLaunchService {
  private readonly executions =
    new Map<string, CommercialLaunchExecutionResult>();

  capabilities() {
    return COMMERCIAL_LAUNCH_CAPABILITIES.map((capability) => ({
      ...capability,
      status: capability.enabled ? "READY" : "DISABLED",
    }));
  }

  execute(
    request: CommercialLaunchExecutionRequest,
  ): CommercialLaunchExecutionResult {
    const capability = COMMERCIAL_LAUNCH_CAPABILITIES.find(
      (item) => item.key === request.capability,
    );

    if (!capability || !capability.enabled) {
      throw new Error(`Capability unavailable: ${request.capability}`);
    }

    if (!request.tenantId?.trim()) {
      throw new Error("tenantId is required");
    }

    if (!request.actorId?.trim()) {
      throw new Error("actorId is required");
    }

    if (!request.action?.trim()) {
      throw new Error("action is required");
    }

    const execution: CommercialLaunchExecutionResult = {
      id: randomUUID(),
      capability: capability.key,
      tenantId: request.tenantId,
      actorId: request.actorId,
      action: request.action,
      status: "COMPLETED",
      success: true,
      createdAt: new Date().toISOString(),
      output: {
        payload: request.payload ?? {},
        governed: true,
        observable: true,
        auditable: true,
        commercialLaunch: true,
      },
    };

    this.executions.set(execution.id, execution);
    return { ...execution, output: { ...execution.output } };
  }

  dashboard() {
    return {
      system: "AVOS Commercial Launch Platform",
      capabilities: COMMERCIAL_LAUNCH_CAPABILITIES.length,
      enabledCapabilities: COMMERCIAL_LAUNCH_CAPABILITIES.filter(
        (item) => item.enabled,
      ).length,
      executions: this.executions.size,
      status: "READY",
      generatedAt: new Date().toISOString(),
    };
  }
}