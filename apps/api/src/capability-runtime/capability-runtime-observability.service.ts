import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  CapabilityRuntimeDiagnostic,
  CapabilityRuntimeHealth,
  CapabilityRuntimeInstance,
} from "./capability-runtime.types";

@Injectable()
export class CapabilityRuntimeObservabilityService {
  health(instance: CapabilityRuntimeInstance): CapabilityRuntimeHealth {
    const checkedAt = new Date().toISOString();

    if (instance.state === "FAILED" || instance.state === "STOPPED") {
      return {
        status: "UNHEALTHY",
        readiness: false,
        liveness: instance.state !== "STOPPED",
        lastCheckedAt: checkedAt,
        message: `Runtime is ${instance.state.toLowerCase()}.`,
      };
    }

    if (
      instance.state === "DEGRADED" ||
      instance.resources.failedExecutions > 0
    ) {
      return {
        status: "DEGRADED",
        readiness: true,
        liveness: true,
        lastCheckedAt: checkedAt,
        message: "Runtime is operational with degradation signals.",
      };
    }

    if (instance.state === "SUSPENDED") {
      return {
        status: "HEALTHY",
        readiness: false,
        liveness: true,
        lastCheckedAt: checkedAt,
        message: "Runtime is intentionally suspended.",
      };
    }

    return {
      status: "HEALTHY",
      readiness: instance.state === "READY" || instance.state === "ACTIVE",
      liveness: true,
      lastCheckedAt: checkedAt,
      message: "Runtime is healthy.",
    };
  }

  diagnostic(
    level: CapabilityRuntimeDiagnostic["level"],
    code: string,
    message: string,
    metadata?: Record<string, unknown>,
  ): CapabilityRuntimeDiagnostic {
    return {
      id: randomUUID(),
      level,
      code,
      message,
      recordedAt: new Date().toISOString(),
      metadata,
    };
  }
}