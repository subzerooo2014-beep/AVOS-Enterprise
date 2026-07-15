import { Injectable } from "@nestjs/common";
import {
  SUPPORT_PLATFORM_CAPABILITIES,
  SupportPlatformExecutionRequest,
  SupportPlatformExecutionResult,
} from "./support-platform.types";

@Injectable()
export class SupportPlatformService {
  private executions = 0;

  capabilities() {
    return SUPPORT_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: SupportPlatformExecutionRequest): SupportPlatformExecutionResult {
    if (!SUPPORT_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "support-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "support-platform",
      status: "HEALTHY",
      capabilities: SUPPORT_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}