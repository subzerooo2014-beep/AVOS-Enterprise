import { Injectable } from "@nestjs/common";
import {
  DATA_PLATFORM_CAPABILITIES,
  DataPlatformExecutionRequest,
  DataPlatformExecutionResult,
} from "./data-platform.types";

@Injectable()
export class DataPlatformService {
  private executions = 0;

  capabilities() {
    return DATA_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: DataPlatformExecutionRequest): DataPlatformExecutionResult {
    if (!DATA_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "data-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "data-platform",
      status: "HEALTHY",
      capabilities: DATA_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}