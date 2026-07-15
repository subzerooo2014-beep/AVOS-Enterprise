import { Injectable } from "@nestjs/common";
import {
  EVENT_PLATFORM_CAPABILITIES,
  EventPlatformExecutionRequest,
  EventPlatformExecutionResult,
} from "./event-platform.types";

@Injectable()
export class EventPlatformService {
  private executions = 0;

  capabilities() {
    return EVENT_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: EventPlatformExecutionRequest): EventPlatformExecutionResult {
    if (!EVENT_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "event-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "event-platform",
      status: "HEALTHY",
      capabilities: EVENT_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}