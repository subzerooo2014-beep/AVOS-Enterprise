import { Injectable } from "@nestjs/common";
import {
  KNOWLEDGE_PLATFORM_CAPABILITIES,
  KnowledgePlatformExecutionRequest,
  KnowledgePlatformExecutionResult,
} from "./knowledge-platform.types";

@Injectable()
export class KnowledgePlatformService {
  private executions = 0;

  capabilities() {
    return KNOWLEDGE_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: KnowledgePlatformExecutionRequest): KnowledgePlatformExecutionResult {
    if (!KNOWLEDGE_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "knowledge-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "knowledge-platform",
      status: "HEALTHY",
      capabilities: KNOWLEDGE_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}