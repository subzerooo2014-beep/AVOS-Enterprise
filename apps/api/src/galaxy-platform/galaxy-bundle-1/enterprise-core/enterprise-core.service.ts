import { Injectable } from "@nestjs/common";
import {
  ENTERPRISE_CORE_CAPABILITIES,
  EnterpriseCoreExecutionRequest,
  EnterpriseCoreExecutionResult,
} from "./enterprise-core.types";

@Injectable()
export class EnterpriseCoreService {
  private executions = 0;

  capabilities() {
    return ENTERPRISE_CORE_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: EnterpriseCoreExecutionRequest): EnterpriseCoreExecutionResult {
    if (!ENTERPRISE_CORE_CAPABILITIES.includes(request.capability)) {
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
        domain: "enterprise-core",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "enterprise-core",
      status: "HEALTHY",
      capabilities: ENTERPRISE_CORE_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}