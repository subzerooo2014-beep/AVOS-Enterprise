import { Injectable } from "@nestjs/common";
import {
  CONTENT_PLATFORM_CAPABILITIES,
  ContentPlatformExecutionRequest,
  ContentPlatformExecutionResult,
} from "./content-platform.types";

@Injectable()
export class ContentPlatformService {
  private executions = 0;

  capabilities() {
    return CONTENT_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: ContentPlatformExecutionRequest): ContentPlatformExecutionResult {
    if (!CONTENT_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "content-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "content-platform",
      status: "HEALTHY",
      capabilities: CONTENT_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}