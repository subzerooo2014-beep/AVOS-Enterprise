import { Injectable } from "@nestjs/common";
import { ChaosTestingV1Service } from "./chaos-testing-v1.service";
import { DisasterRecoveryV1Service } from "./disaster-recovery-v1.service";
import { MultiNodeValidationV1Service } from "./multi-node-validation-v1.service";
import { PerformanceBenchmarkV1Service } from "./performance-benchmark-v1.service";
import { ReleaseReadinessGateV1Service } from "./release-readiness-gate-v1.service";
import { SecurityReadinessV1Service } from "./security-readiness-v1.service";
import type { ProductionCertificationV1 } from "./production-hardening-readiness-v1.types";

@Injectable()
export class ProductionCertificationV1Service {
  private readonly certifications: ProductionCertificationV1[] = [];

  constructor(
    private readonly benchmarks: PerformanceBenchmarkV1Service,
    private readonly chaos: ChaosTestingV1Service,
    private readonly recovery: DisasterRecoveryV1Service,
    private readonly multiNode: MultiNodeValidationV1Service,
    private readonly security: SecurityReadinessV1Service,
    private readonly gates: ReleaseReadinessGateV1Service,
  ) {}

  issue(version: string): ProductionCertificationV1 {
    const checks = [
      this.benchmarks.count() === 0 ||
        this.benchmarks.passedCount() === this.benchmarks.count(),
      this.chaos.count() === 0 ||
        this.chaos.passedCount() === this.chaos.count(),
      this.recovery.count() === 0 ||
        this.recovery.validatedCount() === this.recovery.count(),
      this.multiNode.count() === 0 ||
        this.multiNode.passedCount() === this.multiNode.count(),
      this.security.failedCount() === 0,
      this.gates.requiredFailures().length === 0,
    ];

    const passedGates = checks.filter(Boolean).length;
    const failedGates = checks.length - passedGates;
    const score = (passedGates / checks.length) * 100;

    const certification: ProductionCertificationV1 = {
      id: `production-certification-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      version,
      score,
      status:
        score === 100
          ? "CERTIFIED"
          : score >= 70
            ? "CONDITIONAL"
            : "REJECTED",
      passedGates,
      failedGates,
      issuedAt: new Date().toISOString(),
      notes:
        failedGates === 0
          ? ["All production readiness gates passed."]
          : [`${failedGates} production readiness gates failed.`],
    };

    this.certifications.unshift(certification);
    return this.clone(certification);
  }

  list(): ProductionCertificationV1[] {
    return this.certifications.map((item) => this.clone(item));
  }

  count(): number {
    return this.certifications.length;
  }

  private clone(item: ProductionCertificationV1): ProductionCertificationV1 {
    return { ...item, notes: [...item.notes] };
  }
}
