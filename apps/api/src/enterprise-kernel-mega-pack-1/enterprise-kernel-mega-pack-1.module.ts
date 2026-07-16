import { Module } from "@nestjs/common";
import { EnterpriseKernelMegaPack1Controller } from "./enterprise-kernel-mega-pack-1.controller";
import { EnterpriseKernelMegaPack1Service } from "./enterprise-kernel-mega-pack-1.service";
import { KernelIdentityService } from "./identity/kernel-identity.service";
import { KernelContextService } from "./context/kernel-context.service";
import { KernelStateService } from "./state/kernel-state.service";
import { KernelModuleRegistryService } from "./modules/kernel-module-registry.service";
import { KernelLifecycleService } from "./lifecycle/kernel-lifecycle.service";
import { KernelStartupPipelineService } from "./pipelines/kernel-startup-pipeline.service";
import { KernelShutdownPipelineService } from "./pipelines/kernel-shutdown-pipeline.service";
import { KernelReadinessService } from "./readiness/kernel-readiness.service";
import { KernelHealthService } from "./health/kernel-health.service";
import { KernelAuditService } from "./observability/kernel-audit.service";

@Module({
  controllers: [EnterpriseKernelMegaPack1Controller],
  providers: [
    EnterpriseKernelMegaPack1Service,
    KernelIdentityService,
    KernelContextService,
    KernelStateService,
    KernelModuleRegistryService,
    KernelLifecycleService,
    KernelStartupPipelineService,
    KernelShutdownPipelineService,
    KernelReadinessService,
    KernelHealthService,
    KernelAuditService
  ],
  exports: [
    EnterpriseKernelMegaPack1Service,
    KernelIdentityService,
    KernelContextService,
    KernelStateService,
    KernelModuleRegistryService,
    KernelLifecycleService,
    KernelStartupPipelineService,
    KernelShutdownPipelineService,
    KernelReadinessService,
    KernelHealthService,
    KernelAuditService
  ]
})
export class EnterpriseKernelMegaPack1Module {}
