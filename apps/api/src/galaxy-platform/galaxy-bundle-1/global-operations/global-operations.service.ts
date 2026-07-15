import { Injectable } from "@nestjs/common";
import {
  GLOBAL_OPERATIONS_CAPABILITIES,
  GlobalOperationsExecutionRequest,
  GlobalOperationsExecutionResult,
} from "./global-operations.types";

@Injectable()
export class GlobalOperationsService {
  private executions = 0;

  capabilities() {
    return GLOBAL_OPERATIONS_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: GlobalOperationsExecutionRequest): GlobalOperationsExecutionResult {
    if (!GLOBAL_OPERATIONS_CAPABILITIES.includes(request.capability)) {
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
        domain: "global-operations",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "global-operations",
      status: "HEALTHY",
      capabilities: GLOBAL_OPERATIONS_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}