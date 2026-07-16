import { Injectable } from "@nestjs/common";
import { ChaosTestingV1Service } from "./chaos-testing-v1.service";
import { DisasterRecoveryV1Service } from "./disaster-recovery-v1.service";
import { MultiNodeValidationV1Service } from "./multi-node-validation-v1.service";
import { PerformanceBenchmarkV1Service } from "./performance-benchmark-v1.service";
import { ProductionCertificationV1Service } from "./production-certification-v1.service";
import { ReleaseReadinessGateV1Service } from "./release-readiness-gate-v1.service";
import { SecurityReadinessV1Service } from "./security-readiness-v1.service";
import type {
  HardeningMetricsV1,
  HardeningPlatformStatusV1,
} from "./production-hardening-readiness-v1.types";

@Injectable()
export class ProductionHardeningReadinessPlatformV1Service {
  constructor(
    private readonly benchmarks: PerformanceBenchmarkV1Service,
    private readonly chaos: ChaosTestingV1Service,
    private readonly recovery: DisasterRecoveryV1Service,
    private readonly multiNode: MultiNodeValidationV1Service,
    private readonly security: SecurityReadinessV1Service,
    private readonly gates: ReleaseReadinessGateV1Service,
    private readonly certifications: ProductionCertificationV1Service,
  ) {}

  metrics(): HardeningMetricsV1 {
    return {
      benchmarks: this.benchmarks.count(),
      passedBenchmarks: this.benchmarks.passedCount(),
      chaosExperiments: this.chaos.count(),
      passedChaosExperiments: this.chaos.passedCount(),
      disasterRecoveryPlans: this.recovery.count(),
      validatedRecoveryPlans: this.recovery.validatedCount(),
      multiNodeValidations: this.multiNode.count(),
      passedMultiNodeValidations: this.multiNode.passedCount(),
      securityChecks: this.security.count(),
      failedSecurityChecks: this.security.failedCount(),
      readinessGates: this.gates.count(),
      passedReadinessGates: this.gates.passedCount(),
      certifications: this.certifications.count(),
    };
  }

  status(): HardeningPlatformStatusV1 {
    const metrics = this.metrics();

    return {
      success: true,
      system: "AVOS Production Hardening & Readiness Platform V1",
      version: "1.0.0",
      status:
        metrics.failedSecurityChecks > 0 ||
        this.gates.requiredFailures().length > 0
          ? "DEGRADED"
          : "READY",
      metrics,
      components: {
        performanceBenchmarks: "READY",
        loadTestingFoundation: "READY",
        chaosTesting: "READY",
        disasterRecovery: "READY",
        multiNodeValidation: "READY",
        securityReadiness: "READY",
        releaseReadinessGates: "READY",
        resilienceCertification: "READY",
        productionReadinessCertification: "READY",
        finalAcceptance: "READY",
      },
    };
  }

  diagnostics() {
    return {
      success: true,
      status: this.status(),
      benchmarks: this.benchmarks.list(),
      chaosExperiments: this.chaos.list(),
      disasterRecoveryPlans: this.recovery.list(),
      multiNodeValidations: this.multiNode.list(),
      securityChecks: this.security.list(),
      readinessGates: this.gates.list(),
      certifications: this.certifications.list(),
    };
  }
}
