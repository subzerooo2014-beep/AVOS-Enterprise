import { Injectable } from "@nestjs/common";
import {
  DIGITAL_TWIN_PLATFORM_CAPABILITIES,
  DigitalTwinPlatformExecutionRequest,
  DigitalTwinPlatformExecutionResult,
} from "./digital-twin-platform.types";

@Injectable()
export class DigitalTwinPlatformService {
  private executions = 0;

  capabilities() {
    return DIGITAL_TWIN_PLATFORM_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
    }));
  }

  execute(request: DigitalTwinPlatformExecutionRequest): DigitalTwinPlatformExecutionResult {
    if (!DIGITAL_TWIN_PLATFORM_CAPABILITIES.includes(request.capability)) {
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
        domain: "digital-twin-platform",
        executionNumber: this.executions,
      },
    };
  }

  health() {
    return {
      domain: "digital-twin-platform",
      status: "HEALTHY",
      capabilities: DIGITAL_TWIN_PLATFORM_CAPABILITIES.length,
      executions: this.executions,
    };
  }
}