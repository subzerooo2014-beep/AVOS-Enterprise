import { Injectable } from "@nestjs/common";
import {
  CUSTOMER_PLATFORM_CAPABILITIES,
  CustomerPlatformExecutionRequest,
  CustomerPlatformExecutionResult,
} from "./customer-platform.types";

@Injectable()
export class CustomerPlatformService {
  private executions = 0;

  capabilities() {
    return CUSTOMER_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: CustomerPlatformExecutionRequest): CustomerPlatformExecutionResult {
    if (!CUSTOMER_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "customer-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "customer-platform",
      status: "HEALTHY",
      capabilities: CUSTOMER_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}