import { Injectable } from "@nestjs/common";
import {
  REVENUE_PLATFORM_CAPABILITIES,
  RevenuePlatformExecutionRequest,
  RevenuePlatformExecutionResult,
} from "./revenue-platform.types";

@Injectable()
export class RevenuePlatformService {
  private executions = 0;

  capabilities() {
    return REVENUE_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: RevenuePlatformExecutionRequest): RevenuePlatformExecutionResult {
    if (!REVENUE_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "revenue-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "revenue-platform",
      status: "HEALTHY",
      capabilities: REVENUE_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}