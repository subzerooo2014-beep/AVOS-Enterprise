import { Injectable } from "@nestjs/common";
import { PlatformHeartbeatService } from "./platform-heartbeat.service";
import { PlatformFailureService } from "./platform-failure.service";
import { PlatformRuntimeRegistryService } from "./platform-runtime-registry.service";

@Injectable()
export class PlatformDiagnosticsService {
  constructor(
    private readonly runtime: PlatformRuntimeRegistryService,
    private readonly heartbeat: PlatformHeartbeatService,
    private readonly failures: PlatformFailureService
  ) {}

  diagnose(serviceId: string) {
    const runtime = this.runtime.get(serviceId);
    const latestHeartbeat = this.heartbeat.latest(serviceId);
    const unresolvedFailures = this.failures.list(serviceId, true);

    const findings: string[] = [];

    if (!latestHeartbeat) {
      findings.push("No runtime heartbeat has been recorded.");
    }
    if (latestHeartbeat?.status === "degraded") {
      findings.push("Latest heartbeat reports degraded health.");
    }
    if (latestHeartbeat?.status === "unhealthy") {
      findings.push("Latest heartbeat reports unhealthy service state.");
    }
    if (unresolvedFailures.length > 0) {
      findings.push(`${unresolvedFailures.length} unresolved failure record(s).`);
    }
    if (runtime.state === "maintenance") {
      findings.push("Service is currently in maintenance mode.");
    }
    if (findings.length === 0) {
      findings.push("No operational problems detected.");
    }

    this.runtime.update(serviceId, runtime.state, {
      diagnostics: findings
    });

    return {
      serviceId,
      state: runtime.state,
      healthy:
        runtime.state === "running" &&
        unresolvedFailures.length === 0 &&
        latestHeartbeat?.status !== "unhealthy",
      latestHeartbeat,
      unresolvedFailures,
      findings,
      generatedAt: new Date().toISOString()
    };
  }
}