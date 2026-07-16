import { Injectable } from "@nestjs/common";
import { RuntimeServiceRegistryV1Service } from "./runtime-service-registry-v1.service";
import type { RuntimeHealthRecordV1 } from "./enterprise-runtime-platform-v1.types";

@Injectable()
export class RuntimeHealthOrchestratorV1Service {
  private readonly records = new Map<string, RuntimeHealthRecordV1>();

  constructor(private readonly services: RuntimeServiceRegistryV1Service) {}

  evaluate(
    serviceId: string,
    checks: Record<string, boolean>,
  ): RuntimeHealthRecordV1 {
    const service = this.services.get(serviceId);
    const entries = Object.entries(checks);
    const passed = entries.filter(([, value]) => value).length;
    const score = entries.length === 0 ? 100 : (passed / entries.length) * 100;
    const issues = entries
      .filter(([, value]) => !value)
      .map(([key]) => `Readiness check '${key}' failed.`);

    if (service.status === "FAILED") {
      issues.push("Service runtime status is FAILED.");
    }

    const normalizedScore =
      service.status === "FAILED" ? Math.min(score, 20) : score;

    const record: RuntimeHealthRecordV1 = {
      serviceId,
      score: normalizedScore,
      status:
        normalizedScore >= 80
          ? "HEALTHY"
          : normalizedScore >= 50
            ? "DEGRADED"
            : "UNHEALTHY",
      checks: { ...checks },
      issues,
      checkedAt: new Date().toISOString(),
    };

    this.records.set(serviceId, record);

    if (record.status === "DEGRADED") {
      this.services.transition(serviceId, "DEGRADED");
    }

    if (record.status === "UNHEALTHY") {
      this.services.transition(serviceId, "FAILED");
    }

    return this.clone(record);
  }

  aggregate(): {
    status: "HEALTHY" | "DEGRADED" | "UNHEALTHY";
    score: number;
    records: RuntimeHealthRecordV1[];
  } {
    const records = this.list();
    const score =
      records.length === 0
        ? 100
        : records.reduce((total, item) => total + item.score, 0) /
          records.length;

    return {
      status:
        score >= 80 ? "HEALTHY" : score >= 50 ? "DEGRADED" : "UNHEALTHY",
      score,
      records,
    };
  }

  list(): RuntimeHealthRecordV1[] {
    return Array.from(this.records.values()).map((item) => this.clone(item));
  }

  count(): number {
    return this.records.size;
  }

  unhealthyCount(): number {
    return this.list().filter((item) => item.status === "UNHEALTHY").length;
  }

  private clone(item: RuntimeHealthRecordV1): RuntimeHealthRecordV1 {
    return {
      ...item,
      checks: { ...item.checks },
      issues: [...item.issues],
    };
  }
}
