import { Injectable } from "@nestjs/common";
import {
  FactoryDiagnosticsReport
} from "./avos-factory-operational.contracts";
import {
  AvosFactoryAuditService
} from "./avos-factory-audit.service";
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

@Injectable()
export class AvosFactoryDiagnosticsService {
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
      AvosFactoryReadinessService
  ) {}

  report(): FactoryDiagnosticsReport {
    return {
      system: "AVOS Factory Core V1",
      version: "1.0.0",
      policy:
        this.governance.getPolicy(),
      activeLeases:
        this.locks.active(),
      recentAuditEvents:
        this.audit.list(50),
      health:
        this.health.calculate(),
      readiness:
        this.readiness.evaluate(),
      generatedAt:
        new Date().toISOString()
    };
  }
}
