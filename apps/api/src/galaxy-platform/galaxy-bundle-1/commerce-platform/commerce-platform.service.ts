import { Injectable } from "@nestjs/common";
import {
  COMMERCE_PLATFORM_CAPABILITIES,
  CommercePlatformExecutionRequest,
  CommercePlatformExecutionResult,
} from "./commerce-platform.types";

@Injectable()
export class CommercePlatformService {
  private executions = 0;

  capabilities() {
    return COMMERCE_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: CommercePlatformExecutionRequest): CommercePlatformExecutionResult {
    if (!COMMERCE_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "commerce-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "commerce-platform",
      status: "HEALTHY",
      capabilities: COMMERCE_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}