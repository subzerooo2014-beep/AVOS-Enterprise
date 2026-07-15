import { Injectable } from "@nestjs/common";
import {
  AGENT_PLATFORM_CAPABILITIES,
  AgentPlatformExecutionRequest,
  AgentPlatformExecutionResult,
} from "./agent-platform.types";

@Injectable()
export class AgentPlatformService {
  private executions = 0;

  capabilities() {
    return AGENT_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: AgentPlatformExecutionRequest): AgentPlatformExecutionResult {
    if (!AGENT_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "agent-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "agent-platform",
      status: "HEALTHY",
      capabilities: AGENT_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}