import { Module } from "@nestjs/common";
import { ChaosTestingV1Service } from "./chaos-testing-v1.service";
import { DisasterRecoveryV1Service } from "./disaster-recovery-v1.service";
import { MultiNodeValidationV1Service } from "./multi-node-validation-v1.service";
import { PerformanceBenchmarkV1Service } from "./performance-benchmark-v1.service";
import { ProductionCertificationV1Service } from "./production-certification-v1.service";
import { ProductionHardeningReadinessPlatformV1Controller } from "./production-hardening-readiness-platform-v1.controller";
import { ProductionHardeningReadinessPlatformV1Service } from "./production-hardening-readiness-platform-v1.service";
import { ReleaseReadinessGateV1Service } from "./release-readiness-gate-v1.service";
import { SecurityReadinessV1Service } from "./security-readiness-v1.service";

@Module({
  controllers: [ProductionHardeningReadinessPlatformV1Controller],
  providers: [
    ChaosTestingV1Service,
    DisasterRecoveryV1Service,
    MultiNodeValidationV1Service,
    PerformanceBenchmarkV1Service,
    ProductionCertificationV1Service,
    ProductionHardeningReadinessPlatformV1Service,
    ReleaseReadinessGateV1Service,
    SecurityReadinessV1Service,
  ],
  exports: [
    ChaosTestingV1Service,
    DisasterRecoveryV1Service,
    MultiNodeValidationV1Service,
    PerformanceBenchmarkV1Service,
    ProductionCertificationV1Service,
    ProductionHardeningReadinessPlatformV1Service,
    ReleaseReadinessGateV1Service,
    SecurityReadinessV1Service,
  ],
})
export class ProductionHardeningReadinessPlatformV1Module {}
