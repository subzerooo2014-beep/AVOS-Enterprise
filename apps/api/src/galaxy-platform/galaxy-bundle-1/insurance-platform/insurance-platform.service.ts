import { Injectable } from "@nestjs/common";
import {
  INSURANCE_PLATFORM_CAPABILITIES,
  InsurancePlatformExecutionRequest,
  InsurancePlatformExecutionResult,
} from "./insurance-platform.types";

@Injectable()
export class InsurancePlatformService {
  private executions = 0;

  capabilities() {
    return INSURANCE_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: InsurancePlatformExecutionRequest): InsurancePlatformExecutionResult {
    if (!INSURANCE_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "insurance-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "insurance-platform",
      status: "HEALTHY",
      capabilities: INSURANCE_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}