import { Injectable } from "@nestjs/common";
import {
  IDENTITY_PLATFORM_CAPABILITIES,
  IdentityPlatformExecutionRequest,
  IdentityPlatformExecutionResult,
} from "./identity-platform.types";

@Injectable()
export class IdentityPlatformService {
  private executions = 0;

  capabilities() {
    return IDENTITY_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: IdentityPlatformExecutionRequest): IdentityPlatformExecutionResult {
    if (!IDENTITY_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "identity-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "identity-platform",
      status: "HEALTHY",
      capabilities: IDENTITY_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}