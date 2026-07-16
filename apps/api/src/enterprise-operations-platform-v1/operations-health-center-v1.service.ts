import { Injectable } from "@nestjs/common";
import type { OperationsServiceStatusV1 } from "./enterprise-operations-platform-v1.types";

@Injectable()
export class OperationsHealthCenterV1Service {
  private readonly statuses = new Map<string, OperationsServiceStatusV1>();

  report(
    id: string,
    name: string,
    score: number,
    latencyMs: number,
    errorRate: number,
    details: string[] = [],
  ): OperationsServiceStatusV1 {
    const normalizedScore = Math.max(0, Math.min(100, score));

    const status: OperationsServiceStatusV1 = {
      id,
      name,
      status:
        normalizedScore >= 80 && errorRate < 0.05
          ? "HEALTHY"
          : normalizedScore >= 50 && errorRate < 0.2
            ? "DEGRADED"
            : "UNHEALTHY",
      score: normalizedScore,
      latencyMs,
      errorRate,
      details: [...details],
      updatedAt: new Date().toISOString(),
    };

    this.statuses.set(id, status);
    return this.clone(status);
  }

  list(): OperationsServiceStatusV1[] {
    return Array.from(this.statuses.values()).map((item) => this.clone(item));
  }

  count(): number {
    return this.statuses.size;
  }

  healthyCount(): number {
    return this.list().filter((item) => item.status === "HEALTHY").length;
  }

  degradedCount(): number {
    return this.list().filter((item) => item.status === "DEGRADED").length;
  }

  unhealthyCount(): number {
    return this.list().filter((item) => item.status === "UNHEALTHY").length;
  }

  aggregate(): {
    overallStatus: "HEALTHY" | "DEGRADED" | "UNHEALTHY";
    healthScore: number;
  } {
    const services = this.list();

    if (services.length === 0) {
      return { overallStatus: "HEALTHY", healthScore: 100 };
    }

    const healthScore =
      services.reduce((total, item) => total + item.score, 0) / services.length;

    return {
      overallStatus:
        healthScore >= 80
          ? "HEALTHY"
          : healthScore >= 50
            ? "DEGRADED"
            : "UNHEALTHY",
      healthScore,
    };
  }

  private clone(item: OperationsServiceStatusV1): OperationsServiceStatusV1 {
    return { ...item, details: [...item.details] };
  }
}
