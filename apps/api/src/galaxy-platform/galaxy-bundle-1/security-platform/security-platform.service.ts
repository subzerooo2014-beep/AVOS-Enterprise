import { Injectable } from "@nestjs/common";
import {
  SECURITY_PLATFORM_CAPABILITIES,
  SecurityPlatformExecutionRequest,
  SecurityPlatformExecutionResult,
} from "./security-platform.types";

@Injectable()
export class SecurityPlatformService {
  private executions = 0;

  capabilities() {
    return SECURITY_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: SecurityPlatformExecutionRequest): SecurityPlatformExecutionResult {
    if (!SECURITY_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "security-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "security-platform",
      status: "HEALTHY",
      capabilities: SECURITY_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}