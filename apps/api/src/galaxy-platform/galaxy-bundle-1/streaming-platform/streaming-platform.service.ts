import { Injectable } from "@nestjs/common";
import {
  STREAMING_PLATFORM_CAPABILITIES,
  StreamingPlatformExecutionRequest,
  StreamingPlatformExecutionResult,
} from "./streaming-platform.types";

@Injectable()
export class StreamingPlatformService {
  private executions = 0;

  capabilities() {
    return STREAMING_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: StreamingPlatformExecutionRequest): StreamingPlatformExecutionResult {
    if (!STREAMING_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "streaming-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "streaming-platform",
      status: "HEALTHY",
      capabilities: STREAMING_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}