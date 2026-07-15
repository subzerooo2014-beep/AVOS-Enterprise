import { Injectable } from "@nestjs/common";
import {
  DECISION_PLATFORM_CAPABILITIES,
  DecisionPlatformExecutionRequest,
  DecisionPlatformExecutionResult,
} from "./decision-platform.types";

@Injectable()
export class DecisionPlatformService {
  private executions = 0;

  capabilities() {
    return DECISION_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: DecisionPlatformExecutionRequest): DecisionPlatformExecutionResult {
    if (!DECISION_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "decision-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "decision-platform",
      status: "HEALTHY",
      capabilities: DECISION_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}