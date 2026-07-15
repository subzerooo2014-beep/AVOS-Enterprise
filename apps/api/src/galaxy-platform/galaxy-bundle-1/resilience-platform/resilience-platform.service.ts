import { Injectable } from "@nestjs/common";
import {
  RESILIENCE_PLATFORM_CAPABILITIES,
  ResiliencePlatformExecutionRequest,
  ResiliencePlatformExecutionResult,
} from "./resilience-platform.types";

@Injectable()
export class ResiliencePlatformService {
  private executions = 0;

  capabilities() {
    return RESILIENCE_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: ResiliencePlatformExecutionRequest): ResiliencePlatformExecutionResult {
    if (!RESILIENCE_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "resilience-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "resilience-platform",
      status: "HEALTHY",
      capabilities: RESILIENCE_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}