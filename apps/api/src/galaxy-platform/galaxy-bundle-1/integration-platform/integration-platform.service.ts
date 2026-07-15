import { Injectable } from "@nestjs/common";
import {
  INTEGRATION_PLATFORM_CAPABILITIES,
  IntegrationPlatformExecutionRequest,
  IntegrationPlatformExecutionResult,
} from "./integration-platform.types";

@Injectable()
export class IntegrationPlatformService {
  private executions = 0;

  capabilities() {
    return INTEGRATION_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: IntegrationPlatformExecutionRequest): IntegrationPlatformExecutionResult {
    if (!INTEGRATION_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "integration-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "integration-platform",
      status: "HEALTHY",
      capabilities: INTEGRATION_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}