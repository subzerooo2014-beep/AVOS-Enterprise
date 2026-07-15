import { Injectable } from "@nestjs/common";
import {
  FEATURE_PLATFORM_CAPABILITIES,
  FeaturePlatformExecutionRequest,
  FeaturePlatformExecutionResult,
} from "./feature-platform.types";

@Injectable()
export class FeaturePlatformService {
  private executions = 0;

  capabilities() {
    return FEATURE_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: FeaturePlatformExecutionRequest): FeaturePlatformExecutionResult {
    if (!FEATURE_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "feature-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "feature-platform",
      status: "HEALTHY",
      capabilities: FEATURE_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}