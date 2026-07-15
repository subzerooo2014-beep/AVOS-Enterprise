import { Injectable } from "@nestjs/common";
import {
  SEARCH_PLATFORM_CAPABILITIES,
  SearchPlatformExecutionRequest,
  SearchPlatformExecutionResult,
} from "./search-platform.types";

@Injectable()
export class SearchPlatformService {
  private executions = 0;

  capabilities() {
    return SEARCH_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: SearchPlatformExecutionRequest): SearchPlatformExecutionResult {
    if (!SEARCH_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "search-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "search-platform",
      status: "HEALTHY",
      capabilities: SEARCH_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}