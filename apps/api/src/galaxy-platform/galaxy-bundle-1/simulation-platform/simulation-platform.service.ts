import { Injectable } from "@nestjs/common";
import {
  SIMULATION_PLATFORM_CAPABILITIES,
  SimulationPlatformExecutionRequest,
  SimulationPlatformExecutionResult,
} from "./simulation-platform.types";

@Injectable()
export class SimulationPlatformService {
  private executions = 0;

  capabilities() {
    return SIMULATION_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: SimulationPlatformExecutionRequest): SimulationPlatformExecutionResult {
    if (!SIMULATION_PLATFORM_CAPABILITIES.includes(request.capability)) {
      throw new Error(`Unsupported capability: ${request.capability}`);
    }

    if (!request.tenantId?.trim()) {
      throw new Error("tenantId is required");
    }

    if (!request.action?.trim()) {
      throw new Error("action is required");
    }

    this.executions += 1;

    return {
      capability: request.capability,
      action: request.action,
      tenantId: request.tenantId,
      success: true,
      status: "COMPLETED",
      timestamp: new Date().toISOString(),
      output: {
        payload: request.payload ?? {},
        domain: "simulation-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "simulation-platform",
      status: "HEALTHY",
      capabilities: SIMULATION_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}