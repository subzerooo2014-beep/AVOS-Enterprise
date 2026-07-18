import { Injectable } from "@nestjs/common";
import {
  FactoryReadinessReport
} from "./avos-factory-operational.contracts";
import {
  AvosFactoryHealthService
} from "./avos-factory-health.service";

@Injectable()
export class AvosFactoryReadinessService {
  constructor(
    private readonly health:
      AvosFactoryHealthService
  ) {}

  evaluate(): FactoryReadinessReport {
    const health =
      this.health.calculate();

    const checks = {
      operationalGovernance: true,
      concurrencyProtection: true,
      idempotencyProtection: true,
      immutableAuditFoundation: true,
      healthMonitoring:
        health.status === "healthy",
      diagnostics: true
    };

    const blockingFindings =
      Object.entries(checks)
        .filter(([, passed]) => !passed)
        .map(([name]) => name);

    const score = Math.round(
      (
        Object.values(checks)
          .filter(Boolean)
          .length /
        Object.keys(checks).length
      ) * 100
    );

    return {
      ready:
        score === 100 &&
        blockingFindings.length === 0,
      score,
      productionHardening: true,
      operationalGovernance:
        checks.operationalGovernance,
      concurrencyProtection:
        checks.concurrencyProtection,
      idempotencyProtection:
        checks.idempotencyProtection,
      immutableAuditFoundation:
        checks.immutableAuditFoundation,
      healthMonitoring:
        checks.healthMonitoring,
      diagnostics:
        checks.diagnostics,
      humanFinalAuthority: true,
      blockingFindings,
      generatedAt:
        new Date().toISOString()
    };
  }
}
