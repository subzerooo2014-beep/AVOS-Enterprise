import { Injectable } from "@nestjs/common";
import {
  GALAXY_2_DOMAIN_090_CAPABILITIES,
  Galaxy2Domain090ExecutionRequest,
  Galaxy2Domain090ExecutionResult,
} from "./galaxy-2-domain-090.types";

@Injectable()
export class Galaxy2Domain090Service {
  private executions = 0;

  capabilities() {
    return GALAXY_2_DOMAIN_090_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: Galaxy2Domain090ExecutionRequest): Galaxy2Domain090ExecutionResult {
    if (!GALAXY_2_DOMAIN_090_CAPABILITIES.includes(request.capability)) {
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
        domain: "galaxy-2-domain-090",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "galaxy-2-domain-090",
      status: "HEALTHY",
      capabilities: GALAXY_2_DOMAIN_090_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}