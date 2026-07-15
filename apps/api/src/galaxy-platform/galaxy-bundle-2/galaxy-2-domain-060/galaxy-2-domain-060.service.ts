import { Injectable } from "@nestjs/common";
import {
  GALAXY_2_DOMAIN_060_CAPABILITIES,
  Galaxy2Domain060ExecutionRequest,
  Galaxy2Domain060ExecutionResult,
} from "./galaxy-2-domain-060.types";

@Injectable()
export class Galaxy2Domain060Service {
  private executions = 0;

  capabilities() {
    return GALAXY_2_DOMAIN_060_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: Galaxy2Domain060ExecutionRequest): Galaxy2Domain060ExecutionResult {
    if (!GALAXY_2_DOMAIN_060_CAPABILITIES.includes(request.capability)) {
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
        domain: "galaxy-2-domain-060",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "galaxy-2-domain-060",
      status: "HEALTHY",
      capabilities: GALAXY_2_DOMAIN_060_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}