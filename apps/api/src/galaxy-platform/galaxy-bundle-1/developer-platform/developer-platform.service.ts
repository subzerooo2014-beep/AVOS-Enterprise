import { Injectable } from "@nestjs/common";
import {
  DEVELOPER_PLATFORM_CAPABILITIES,
  DeveloperPlatformExecutionRequest,
  DeveloperPlatformExecutionResult,
} from "./developer-platform.types";

@Injectable()
export class DeveloperPlatformService {
  private executions = 0;

  capabilities() {
    return DEVELOPER_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: DeveloperPlatformExecutionRequest): DeveloperPlatformExecutionResult {
    if (!DEVELOPER_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "developer-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "developer-platform",
      status: "HEALTHY",
      capabilities: DEVELOPER_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}