import { Injectable } from "@nestjs/common";
import {
  MODEL_PLATFORM_CAPABILITIES,
  ModelPlatformExecutionRequest,
  ModelPlatformExecutionResult,
} from "./model-platform.types";

@Injectable()
export class ModelPlatformService {
  private executions = 0;

  capabilities() {
    return MODEL_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: ModelPlatformExecutionRequest): ModelPlatformExecutionResult {
    if (!MODEL_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "model-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "model-platform",
      status: "HEALTHY",
      capabilities: MODEL_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}