import { Injectable } from "@nestjs/common";
import {
  MARKETPLACE_PLATFORM_CAPABILITIES,
  MarketplacePlatformExecutionRequest,
  MarketplacePlatformExecutionResult,
} from "./marketplace-platform.types";

@Injectable()
export class MarketplacePlatformService {
  private executions = 0;

  capabilities() {
    return MARKETPLACE_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: MarketplacePlatformExecutionRequest): MarketplacePlatformExecutionResult {
    if (!MARKETPLACE_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "marketplace-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "marketplace-platform",
      status: "HEALTHY",
      capabilities: MARKETPLACE_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}