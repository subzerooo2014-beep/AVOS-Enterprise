import { Injectable } from "@nestjs/common";
import {
  OPERATIONS_PLATFORM_CAPABILITIES,
  OperationsPlatformExecutionRequest,
  OperationsPlatformExecutionResult,
} from "./operations-platform.types";

@Injectable()
export class OperationsPlatformService {
  private executions = 0;

  capabilities() {
    return OPERATIONS_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: OperationsPlatformExecutionRequest): OperationsPlatformExecutionResult {
    if (!OPERATIONS_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "operations-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "operations-platform",
      status: "HEALTHY",
      capabilities: OPERATIONS_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}