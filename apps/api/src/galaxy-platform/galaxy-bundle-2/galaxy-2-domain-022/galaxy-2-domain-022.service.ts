import { Injectable } from "@nestjs/common";
import {
  GALAXY_2_DOMAIN_022_CAPABILITIES,
  Galaxy2Domain022ExecutionRequest,
  Galaxy2Domain022ExecutionResult,
} from "./galaxy-2-domain-022.types";

@Injectable()
export class Galaxy2Domain022Service {
  private executions = 0;

  capabilities() {
    return GALAXY_2_DOMAIN_022_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: Galaxy2Domain022ExecutionRequest): Galaxy2Domain022ExecutionResult {
    if (!GALAXY_2_DOMAIN_022_CAPABILITIES.includes(request.capability)) {
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
        domain: "galaxy-2-domain-022",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "galaxy-2-domain-022",
      status: "HEALTHY",
      capabilities: GALAXY_2_DOMAIN_022_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}