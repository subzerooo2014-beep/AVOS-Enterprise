import { Injectable } from "@nestjs/common";
import {
  AUDIT_PLATFORM_CAPABILITIES,
  AuditPlatformExecutionRequest,
  AuditPlatformExecutionResult,
} from "./audit-platform.types";

@Injectable()
export class AuditPlatformService {
  private executions = 0;

  capabilities() {
    return AUDIT_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: AuditPlatformExecutionRequest): AuditPlatformExecutionResult {
    if (!AUDIT_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "audit-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "audit-platform",
      status: "HEALTHY",
      capabilities: AUDIT_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}