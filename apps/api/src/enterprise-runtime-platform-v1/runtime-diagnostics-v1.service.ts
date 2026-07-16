import { Injectable } from "@nestjs/common";
import { RuntimeDependencyResolverV1Service } from "./runtime-dependency-resolver-v1.service";
import { RuntimeHealthOrchestratorV1Service } from "./runtime-health-orchestrator-v1.service";
import { RuntimeServiceRegistryV1Service } from "./runtime-service-registry-v1.service";
import type { RuntimeDiagnosticRecordV1 } from "./enterprise-runtime-platform-v1.types";

@Injectable()
export class RuntimeDiagnosticsV1Service {
  private readonly records: RuntimeDiagnosticRecordV1[] = [];

  constructor(
    private readonly services: RuntimeServiceRegistryV1Service,
    private readonly dependencies: RuntimeDependencyResolverV1Service,
    private readonly health: RuntimeHealthOrchestratorV1Service,
  ) {}

  run(): RuntimeDiagnosticRecordV1 {
    const details: string[] = [];
    let status: RuntimeDiagnosticRecordV1["status"] = "PASS";

    for (const service of this.services.list()) {
      const dependencyResult = this.dependencies.resolve(service.id);

      if (!dependencyResult.resolved) {
        status = "FAIL";
        details.push(
          `${service.id}: unresolved dependencies=${dependencyResult.missing.join(",")}; circular=${dependencyResult.circular.join(",")}`,
        );
      }
    }

    const aggregateHealth = this.health.aggregate();

    if (aggregateHealth.status === "DEGRADED" && status === "PASS") {
      status = "WARN";
    }

    if (aggregateHealth.status === "UNHEALTHY") {
      status = "FAIL";
    }

    details.push(`services=${this.services.count()}`);
    details.push(`healthScore=${aggregateHealth.score}`);

    const record: RuntimeDiagnosticRecordV1 = {
      id: `runtime-diagnostic-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      category: "ENTERPRISE_RUNTIME",
      status,
      details,
      createdAt: new Date().toISOString(),
    };

    this.records.unshift(record);
    return this.clone(record);
  }

  list(): RuntimeDiagnosticRecordV1[] {
    return this.records.map((item) => this.clone(item));
  }

  count(): number {
    return this.records.length;
  }

  failedCount(): number {
    return this.records.filter((item) => item.status === "FAIL").length;
  }

  private clone(item: RuntimeDiagnosticRecordV1): RuntimeDiagnosticRecordV1 {
    return {
      ...item,
      details: [...item.details],
    };
  }
}
