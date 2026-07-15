import { Injectable } from "@nestjs/common";
import {
  GOVERNANCE_PLATFORM_CAPABILITIES,
  GovernancePlatformExecutionRequest,
  GovernancePlatformExecutionResult,
} from "./governance-platform.types";

@Injectable()
export class GovernancePlatformService {
  private executions = 0;

  capabilities() {
    return GOVERNANCE_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: GovernancePlatformExecutionRequest): GovernancePlatformExecutionResult {
    if (!GOVERNANCE_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "governance-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "governance-platform",
      status: "HEALTHY",
      capabilities: GOVERNANCE_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}