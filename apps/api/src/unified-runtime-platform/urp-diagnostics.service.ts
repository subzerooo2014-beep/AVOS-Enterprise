import { Injectable } from "@nestjs/common";
import { UrpHealthCenterService } from "./urp-health-center.service";
import { UrpRouterService } from "./urp-router.service";
import { UrpRuntimeRegistryService } from "./urp-runtime-registry.service";

@Injectable()
export class UrpDiagnosticsService {
  constructor(
    private readonly health: UrpHealthCenterService,
    private readonly registry: UrpRuntimeRegistryService,
    private readonly router: UrpRouterService,
  ) {}

  run() {
    const health = this.health.evaluate();
    const findings: Array<Record<string, unknown>> = [];

    if (!health.dependencies.valid) {
      findings.push({
        severity: "blocking",
        area: "dependency-graph",
        details: health.dependencies.findings,
      });
    }

    if (health.registry.failed > 0) {
      findings.push({
        severity: "blocking",
        area: "runtime-units",
        failedUnits: health.registry.failed,
      });
    }

    return {
      status: findings.some((item) => item.severity === "blocking")
        ? "failed"
        : "passed",
      findings,
      routes: this.router.listRoutes().length,
      units: this.registry.list().length,
      health,
      diagnosedAt: new Date().toISOString(),
    };
  }
}