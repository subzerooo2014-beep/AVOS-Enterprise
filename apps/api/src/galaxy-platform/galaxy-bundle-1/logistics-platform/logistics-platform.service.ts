import { Injectable } from "@nestjs/common";
import {
  LOGISTICS_PLATFORM_CAPABILITIES,
  LogisticsPlatformExecutionRequest,
  LogisticsPlatformExecutionResult,
} from "./logistics-platform.types";

@Injectable()
export class LogisticsPlatformService {
  private executions = 0;

  capabilities() {
    return LOGISTICS_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: LogisticsPlatformExecutionRequest): LogisticsPlatformExecutionResult {
    if (!LOGISTICS_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "logistics-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "logistics-platform",
      status: "HEALTHY",
      capabilities: LOGISTICS_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}