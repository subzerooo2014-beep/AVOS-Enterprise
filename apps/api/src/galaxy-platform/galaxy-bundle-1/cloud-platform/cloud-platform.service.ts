import { Injectable } from "@nestjs/common";
import {
  CLOUD_PLATFORM_CAPABILITIES,
  CloudPlatformExecutionRequest,
  CloudPlatformExecutionResult,
} from "./cloud-platform.types";

@Injectable()
export class CloudPlatformService {
  private executions = 0;

  capabilities() {
    return CLOUD_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: CloudPlatformExecutionRequest): CloudPlatformExecutionResult {
    if (!CLOUD_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "cloud-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "cloud-platform",
      status: "HEALTHY",
      capabilities: CLOUD_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}