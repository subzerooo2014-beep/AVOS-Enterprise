import { Injectable } from "@nestjs/common";
import {
  ANALYTICS_PLATFORM_CAPABILITIES,
  AnalyticsPlatformExecutionRequest,
  AnalyticsPlatformExecutionResult,
} from "./analytics-platform.types";

@Injectable()
export class AnalyticsPlatformService {
  private executions = 0;

  capabilities() {
    return ANALYTICS_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: AnalyticsPlatformExecutionRequest): AnalyticsPlatformExecutionResult {
    if (!ANALYTICS_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "analytics-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "analytics-platform",
      status: "HEALTHY",
      capabilities: ANALYTICS_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}