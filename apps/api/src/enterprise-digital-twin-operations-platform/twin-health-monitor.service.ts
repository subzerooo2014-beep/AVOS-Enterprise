import { Injectable } from "@nestjs/common";
import { OperationalTwinRegistryService } from "./operational-twin-registry.service";
import type { TwinHealthRecord } from "./enterprise-digital-twin-operations.types";

@Injectable()
export class TwinHealthMonitorService {
  constructor(private readonly twins: OperationalTwinRegistryService) {}

  check(twinId: string): TwinHealthRecord {
    const twin = this.twins.get(twinId);
    const issues: string[] = [];
    let score = 100;

    if (twin.status === "DEGRADED") {
      issues.push("Twin status is degraded.");
      score -= 35;
    }

    if (twin.status === "OFFLINE") {
      issues.push("Twin source is offline.");
      score -= 70;
    }

    for (const [key, value] of Object.entries(twin.state)) {
      if (typeof value === "number" && value > 90) {
        issues.push(`State metric '${key}' exceeds the high threshold.`);
        score -= 10;
      }

      if (value === null || value === undefined) {
        issues.push(`State field '${key}' is missing.`);
        score -= 5;
      }
    }

    score = Math.max(0, score);

    return {
      twinId,
      score,
      status:
        score >= 75 ? "HEALTHY" : score >= 40 ? "DEGRADED" : "UNHEALTHY",
      issues,
      checkedAt: new Date().toISOString(),
    };
  }

  checkAll(): TwinHealthRecord[] {
    return this.twins.list().map((twin) => this.check(twin.id));
  }

  unhealthyCount(): number {
    return this.checkAll().filter((health) => health.status === "UNHEALTHY")
      .length;
  }
}
