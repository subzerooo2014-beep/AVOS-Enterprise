import { Injectable } from "@nestjs/common";
import {
  GOVERNMENT_PLATFORM_CAPABILITIES,
  GovernmentPlatformExecutionRequest,
  GovernmentPlatformExecutionResult,
} from "./government-platform.types";

@Injectable()
export class GovernmentPlatformService {
  private executions = 0;

  capabilities() {
    return GOVERNMENT_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: GovernmentPlatformExecutionRequest): GovernmentPlatformExecutionResult {
    if (!GOVERNMENT_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "government-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "government-platform",
      status: "HEALTHY",
      capabilities: GOVERNMENT_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}