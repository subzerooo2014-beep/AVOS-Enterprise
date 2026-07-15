import { Injectable } from "@nestjs/common";
import {
  PARTNER_PLATFORM_CAPABILITIES,
  PartnerPlatformExecutionRequest,
  PartnerPlatformExecutionResult,
} from "./partner-platform.types";

@Injectable()
export class PartnerPlatformService {
  private executions = 0;

  capabilities() {
    return PARTNER_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: PartnerPlatformExecutionRequest): PartnerPlatformExecutionResult {
    if (!PARTNER_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "partner-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "partner-platform",
      status: "HEALTHY",
      capabilities: PARTNER_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}