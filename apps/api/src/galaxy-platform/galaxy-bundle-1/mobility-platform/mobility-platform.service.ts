import { Injectable } from "@nestjs/common";
import {
  MOBILITY_PLATFORM_CAPABILITIES,
  MobilityPlatformExecutionRequest,
  MobilityPlatformExecutionResult,
} from "./mobility-platform.types";

@Injectable()
export class MobilityPlatformService {
  private executions = 0;

  capabilities() {
    return MOBILITY_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: MobilityPlatformExecutionRequest): MobilityPlatformExecutionResult {
    if (!MOBILITY_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "mobility-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "mobility-platform",
      status: "HEALTHY",
      capabilities: MOBILITY_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}