import { Injectable } from "@nestjs/common";
import {
  PRICING_PLATFORM_CAPABILITIES,
  PricingPlatformExecutionRequest,
  PricingPlatformExecutionResult,
} from "./pricing-platform.types";

@Injectable()
export class PricingPlatformService {
  private executions = 0;

  capabilities() {
    return PRICING_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: PricingPlatformExecutionRequest): PricingPlatformExecutionResult {
    if (!PRICING_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "pricing-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "pricing-platform",
      status: "HEALTHY",
      capabilities: PRICING_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}