import { Injectable } from "@nestjs/common";
import {
  POLICY_PLATFORM_CAPABILITIES,
  PolicyPlatformExecutionRequest,
  PolicyPlatformExecutionResult,
} from "./policy-platform.types";

@Injectable()
export class PolicyPlatformService {
  private executions = 0;

  capabilities() {
    return POLICY_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: PolicyPlatformExecutionRequest): PolicyPlatformExecutionResult {
    if (!POLICY_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "policy-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "policy-platform",
      status: "HEALTHY",
      capabilities: POLICY_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}