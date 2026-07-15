import { Injectable } from "@nestjs/common";
import {
  LEGAL_PLATFORM_CAPABILITIES,
  LegalPlatformExecutionRequest,
  LegalPlatformExecutionResult,
} from "./legal-platform.types";

@Injectable()
export class LegalPlatformService {
  private executions = 0;

  capabilities() {
    return LEGAL_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: LegalPlatformExecutionRequest): LegalPlatformExecutionResult {
    if (!LEGAL_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "legal-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "legal-platform",
      status: "HEALTHY",
      capabilities: LEGAL_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}