import { Injectable } from "@nestjs/common";
import {
  GROWTH_PLATFORM_CAPABILITIES,
  GrowthPlatformExecutionRequest,
  GrowthPlatformExecutionResult,
} from "./growth-platform.types";

@Injectable()
export class GrowthPlatformService {
  private executions = 0;

  capabilities() {
    return GROWTH_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: GrowthPlatformExecutionRequest): GrowthPlatformExecutionResult {
    if (!GROWTH_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "growth-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "growth-platform",
      status: "HEALTHY",
      capabilities: GROWTH_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}