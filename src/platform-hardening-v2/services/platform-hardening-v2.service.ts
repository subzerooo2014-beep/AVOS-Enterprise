import { Injectable } from "@nestjs/common";
import { CircuitBreakerService } from "./circuit-breaker.service";
import { DependencyHealthRegistryService } from "./dependency-health-registry.service";
import { OperationalReadinessService } from "./operational-readiness.service";
import { RuntimeMetricsService } from "./runtime-metrics.service";

@Injectable()
export class PlatformHardeningV2Service {
  constructor(
    private readonly readiness: OperationalReadinessService,
    private readonly metrics: RuntimeMetricsService,
    private readonly dependencyRegistry:
      DependencyHealthRegistryService,
    private readonly circuitBreaker: CircuitBreakerService,
  ) {}

  getStatus() {
    return {
      success: true,
      system: "AVOS Platform Hardening",
      version: "v2",
      phase: "resilience-and-operational-readiness",
      environment: process.env.NODE_ENV ?? "development",
      live: true,
      capabilities: {
        livenessChecks: true,
        readinessChecks: true,
        dependencyHealthRegistry: true,
        runtimeMetrics: true,
        timeoutProtection: true,
        retryPolicies: true,
        circuitBreakers: true,
        degradedStateDetection: true,
        databaseProbe: true,
        eventLoopProbe: true,
        memoryProbe: true,
      },
      registeredDependencyChecks:
        this.dependencyRegistry.listRegisteredChecks(),
      timestamp: new Date().toISOString(),
      uptimeSeconds: Number(process.uptime().toFixed(3)),
    };
  }

  async getOperationalSnapshot() {
    const [readiness, metrics] = await Promise.all([
      this.readiness.getReadiness(),
      this.metrics.getMetrics(),
    ]);

    return {
      success: readiness.ready,
      system: "AVOS Enterprise Production",
      hardeningVersion: "v2",
      readiness,
      metrics,
      circuits: this.circuitBreaker.getAllSnapshots(),
      generatedAt: new Date().toISOString(),
    };
  }
}
