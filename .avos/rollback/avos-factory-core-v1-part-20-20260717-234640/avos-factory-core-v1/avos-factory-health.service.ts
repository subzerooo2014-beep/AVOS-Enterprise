import { Injectable } from "@nestjs/common";
import {
  FactoryHealthReport
} from "./avos-factory-operational.contracts";
import {
  AvosFactoryAuditService
} from "./avos-factory-audit.service";
import {
  AvosFactoryIdempotencyService
} from "./avos-factory-idempotency.service";
import {
  AvosFactoryLockService
} from "./avos-factory-lock.service";
import {
  AvosFactoryRuntimeService
} from "./avos-factory-runtime.service";
import {
  ProjectExecutionHistoryService
} from "./project-execution-history.service";
import {
  ProjectKindRegistryService
} from "./project-kind-registry.service";

@Injectable()
export class AvosFactoryHealthService {
  constructor(
    private readonly runtime:
      AvosFactoryRuntimeService,
    private readonly locks:
      AvosFactoryLockService,
    private readonly idempotency:
      AvosFactoryIdempotencyService,
    private readonly audit:
      AvosFactoryAuditService,
    private readonly executionHistory:
      ProjectExecutionHistoryService,
    private readonly projectKinds:
      ProjectKindRegistryService
  ) {}

  calculate(): FactoryHealthReport {
    const runtime =
      this.runtime.status();

    const checks: Record<string, boolean> = {
      runtimeHealthy:
        runtime.status === "healthy",
      humanFinalAuthority:
        runtime.humanFinalAuthority === true,
      allComponentsActive:
        Object.values(runtime.components)
          .every(Boolean),
      projectKindsAvailable:
        this.projectKinds.count() >= 3,
      concurrencyWithinPolicy:
        this.locks.countActive() < 5
    };

    const passed =
      Object.values(checks)
        .filter(Boolean)
        .length;

    const score = Math.round(
      (passed / Object.keys(checks).length) * 100
    );

    const reasons =
      Object.entries(checks)
        .filter(([, value]) => !value)
        .map(([name]) => name);

    return {
      system: "AVOS Factory Core V1",
      status:
        score === 100
          ? "healthy"
          : score >= 70
            ? "warning"
            : "critical",
      score,
      checks,
      metrics: {
        activeLeases:
          this.locks.countActive(),
        idempotencyRecords:
          this.idempotency.count(),
        auditEvents:
          this.audit.count(),
        executionHistoryRecords:
          this.executionHistory.count(),
        registeredProjectKinds:
          this.projectKinds.count()
      },
      reasons,
      humanFinalAuthority: true,
      calculatedAt:
        new Date().toISOString()
    };
  }
}
