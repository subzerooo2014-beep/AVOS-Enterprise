import { Module } from "@nestjs/common";
import { EnterpriseKernelMegaPack4Controller } from "./enterprise-kernel-mega-pack-4.controller";
import { EnterpriseKernelMegaPack4Service } from "./enterprise-kernel-mega-pack-4.service";
import { KernelHealthRegistryService } from "./registry/kernel-health-registry.service";
import { KernelFailureClassifierService } from "./failures/kernel-failure-classifier.service";
import { KernelDiagnosticsService } from "./diagnostics/kernel-diagnostics.service";
import { KernelIsolationService } from "./isolation/kernel-isolation.service";
import { KernelOperationalModeService } from "./modes/kernel-operational-mode.service";
import { KernelRestartPolicyService } from "./restart/kernel-restart-policy.service";
import { KernelRecoveryService } from "./recovery/kernel-recovery.service";
import { KernelDiagnosticSnapshotService } from "./snapshots/kernel-diagnostic-snapshot.service";
import { KernelRecoveryReadinessService } from "./readiness/kernel-recovery-readiness.service";
import { KernelResilienceHealthService } from "./health/kernel-resilience-health.service";
import { KernelResilienceAuditService } from "./observability/kernel-resilience-audit.service";

@Module({
  controllers: [EnterpriseKernelMegaPack4Controller],
  providers: [
    EnterpriseKernelMegaPack4Service,
    KernelResilienceAuditService,
    KernelHealthRegistryService,
    KernelFailureClassifierService,
    KernelDiagnosticsService,
    KernelIsolationService,
    KernelOperationalModeService,
    KernelRestartPolicyService,
    KernelRecoveryService,
    KernelDiagnosticSnapshotService,
    KernelRecoveryReadinessService,
    KernelResilienceHealthService
  ],
  exports: [
    EnterpriseKernelMegaPack4Service,
    KernelResilienceAuditService,
    KernelHealthRegistryService,
    KernelFailureClassifierService,
    KernelDiagnosticsService,
    KernelIsolationService,
    KernelOperationalModeService,
    KernelRestartPolicyService,
    KernelRecoveryService,
    KernelDiagnosticSnapshotService,
    KernelRecoveryReadinessService,
    KernelResilienceHealthService
  ]
})
export class EnterpriseKernelMegaPack4Module {}
