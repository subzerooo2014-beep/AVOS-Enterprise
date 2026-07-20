import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";

@Injectable()
export class UrpRuntimeContextService {
  readonly runtimeId =
    process.env.AVOS_RUNTIME_ID ??
    "urp:" + process.pid + ":" + randomUUID();

  readonly startedAt = new Date().toISOString();

  correlationId(existing?: string): string {
    return existing ?? "urp-correlation:" + randomUUID();
  }

  operationId(prefix: string): string {
    return prefix + ":" + randomUUID();
  }

  status() {
    return {
      runtimeId: this.runtimeId,
      version: "URP-1.0.0",
      startedAt: this.startedAt,
      uptimeSeconds: process.uptime(),
      environment: process.env.NODE_ENV ?? "development",
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
    };
  }
}