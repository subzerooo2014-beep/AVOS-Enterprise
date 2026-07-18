import {
  Controller,
  Get,
  Query
} from "@nestjs/common";
import {
  AvosFactoryAuditService
} from "./avos-factory-audit.service";
import {
  AvosFactoryDiagnosticsService
} from "./avos-factory-diagnostics.service";
import {
  AvosFactoryGovernanceService
} from "./avos-factory-governance.service";
import {
  AvosFactoryHealthService
} from "./avos-factory-health.service";
import {
  AvosFactoryLockService
} from "./avos-factory-lock.service";
import {
  AvosFactoryReadinessService
} from "./avos-factory-readiness.service";

@Controller("avos/factory/v1/operations")
export class AvosFactoryOperationalController {
  constructor(
    private readonly governance:
      AvosFactoryGovernanceService,
    private readonly locks:
      AvosFactoryLockService,
    private readonly audit:
      AvosFactoryAuditService,
    private readonly health:
      AvosFactoryHealthService,
    private readonly readiness:
      AvosFactoryReadinessService,
    private readonly diagnostics:
      AvosFactoryDiagnosticsService
  ) {}

  @Get("policy")
  policy() {
    return this.governance.getPolicy();
  }

  @Get("health")
  healthReport() {
    return this.health.calculate();
  }

  @Get("readiness")
  readinessReport() {
    return this.readiness.evaluate();
  }

  @Get("diagnostics")
  diagnosticsReport() {
    return this.diagnostics.report();
  }

  @Get("leases")
  leases() {
    return {
      count: this.locks.countActive(),
      items: this.locks.active()
    };
  }

  @Get("audit")
  auditEvents(
    @Query("limit") limit?: string
  ) {
    const parsed = Number(limit);

    return {
      items: this.audit.list(
        Number.isFinite(parsed)
          ? Math.trunc(parsed)
          : 100
      )
    };
  }
}
