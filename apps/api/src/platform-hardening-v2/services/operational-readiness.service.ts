import { Injectable } from "@nestjs/common";
import { DependencyStatus } from "../enums/dependency-status.enum";
import { ReadinessState } from "../enums/readiness-state.enum";
import { HealthSnapshot } from "../interfaces/health-snapshot.interface";
import { DependencyHealthRegistryService } from "./dependency-health-registry.service";

@Injectable()
export class OperationalReadinessService {
  constructor(
    private readonly dependencyRegistry:
      DependencyHealthRegistryService,
  ) {}

  getLiveness() {
    return {
      success: true,
      live: true,
      system: "AVOS Enterprise Production",
      component: "Production Hardening V2",
      version: "v2",
      processId: process.pid,
      uptimeSeconds: Number(process.uptime().toFixed(3)),
      timestamp: new Date().toISOString(),
    };
  }

  async getReadiness(): Promise<HealthSnapshot> {
    const dependencies =
      await this.dependencyRegistry.runAll();

    const summary = {
      total: dependencies.length,
      healthy: dependencies.filter(
        (item) => item.status === DependencyStatus.HEALTHY,
      ).length,
      degraded: dependencies.filter(
        (item) => item.status === DependencyStatus.DEGRADED,
      ).length,
      unhealthy: dependencies.filter(
        (item) => item.status === DependencyStatus.UNHEALTHY,
      ).length,
      unknown: dependencies.filter(
        (item) => item.status === DependencyStatus.UNKNOWN,
      ).length,
      criticalFailures: dependencies.filter(
        (item) =>
          item.critical &&
          item.status === DependencyStatus.UNHEALTHY,
      ).length,
    };

    const ready = summary.criticalFailures === 0;

    let state = ReadinessState.READY;

    if (!ready) {
      state = ReadinessState.NOT_READY;
    } else if (
      summary.degraded > 0 ||
      summary.unhealthy > 0 ||
      summary.unknown > 0
    ) {
      state = ReadinessState.DEGRADED;
    }

    return {
      system: "AVOS Enterprise Production",
      version: "Production Hardening V2",
      environment: process.env.NODE_ENV ?? "development",
      state,
      ready,
      live: true,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Number(process.uptime().toFixed(3)),
      dependencies,
      summary,
    };
  }
}
