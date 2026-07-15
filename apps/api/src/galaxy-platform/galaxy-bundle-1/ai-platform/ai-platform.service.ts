import { Injectable } from "@nestjs/common";
import {
  AI_PLATFORM_CAPABILITIES,
  AiPlatformExecutionRequest,
  AiPlatformExecutionResult,
} from "./ai-platform.types";

@Injectable()
export class AiPlatformService {
  private executions = 0;

  capabilities() {
    return AI_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: AiPlatformExecutionRequest): AiPlatformExecutionResult {
    if (!AI_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "ai-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "ai-platform",
      status: "HEALTHY",
      capabilities: AI_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}