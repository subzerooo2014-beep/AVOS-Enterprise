import { Injectable } from "@nestjs/common";
import {
  OBSERVABILITY_PLATFORM_CAPABILITIES,
  ObservabilityPlatformExecutionRequest,
  ObservabilityPlatformExecutionResult,
} from "./observability-platform.types";

@Injectable()
export class ObservabilityPlatformService {
  private executions = 0;

  capabilities() {
    return OBSERVABILITY_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: ObservabilityPlatformExecutionRequest): ObservabilityPlatformExecutionResult {
    if (!OBSERVABILITY_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "observability-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "observability-platform",
      status: "HEALTHY",
      capabilities: OBSERVABILITY_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}