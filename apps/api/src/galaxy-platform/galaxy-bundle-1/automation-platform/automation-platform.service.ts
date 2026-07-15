import { Injectable } from "@nestjs/common";
import {
  AUTOMATION_PLATFORM_CAPABILITIES,
  AutomationPlatformExecutionRequest,
  AutomationPlatformExecutionResult,
} from "./automation-platform.types";

@Injectable()
export class AutomationPlatformService {
  private executions = 0;

  capabilities() {
    return AUTOMATION_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: AutomationPlatformExecutionRequest): AutomationPlatformExecutionResult {
    if (!AUTOMATION_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "automation-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "automation-platform",
      status: "HEALTHY",
      capabilities: AUTOMATION_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}