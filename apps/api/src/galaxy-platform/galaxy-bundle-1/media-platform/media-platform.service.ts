import { Injectable } from "@nestjs/common";
import {
  MEDIA_PLATFORM_CAPABILITIES,
  MediaPlatformExecutionRequest,
  MediaPlatformExecutionResult,
} from "./media-platform.types";

@Injectable()
export class MediaPlatformService {
  private executions = 0;

  capabilities() {
    return MEDIA_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: MediaPlatformExecutionRequest): MediaPlatformExecutionResult {
    if (!MEDIA_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "media-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "media-platform",
      status: "HEALTHY",
      capabilities: MEDIA_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}