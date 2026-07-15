import { Injectable } from "@nestjs/common";
import {
  INNOVATION_PLATFORM_CAPABILITIES,
  InnovationPlatformExecutionRequest,
  InnovationPlatformExecutionResult,
} from "./innovation-platform.types";

@Injectable()
export class InnovationPlatformService {
  private executions = 0;

  capabilities() {
    return INNOVATION_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: InnovationPlatformExecutionRequest): InnovationPlatformExecutionResult {
    if (!INNOVATION_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "innovation-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "innovation-platform",
      status: "HEALTHY",
      capabilities: INNOVATION_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}