import { Injectable } from "@nestjs/common";
import {
  FINANCIAL_PLATFORM_CAPABILITIES,
  FinancialPlatformExecutionRequest,
  FinancialPlatformExecutionResult,
} from "./financial-platform.types";

@Injectable()
export class FinancialPlatformService {
  private executions = 0;

  capabilities() {
    return FINANCIAL_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: FinancialPlatformExecutionRequest): FinancialPlatformExecutionResult {
    if (!FINANCIAL_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "financial-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "financial-platform",
      status: "HEALTHY",
      capabilities: FINANCIAL_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}