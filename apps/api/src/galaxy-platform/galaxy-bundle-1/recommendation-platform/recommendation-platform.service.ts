import { Injectable } from "@nestjs/common";
import {
  RECOMMENDATION_PLATFORM_CAPABILITIES,
  RecommendationPlatformExecutionRequest,
  RecommendationPlatformExecutionResult,
} from "./recommendation-platform.types";

@Injectable()
export class RecommendationPlatformService {
  private executions = 0;

  capabilities() {
    return RECOMMENDATION_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: RecommendationPlatformExecutionRequest): RecommendationPlatformExecutionResult {
    if (!RECOMMENDATION_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "recommendation-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "recommendation-platform",
      status: "HEALTHY",
      capabilities: RECOMMENDATION_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}