import { Module } from "@nestjs/common";
import { EnterpriseKernelMegaPack2Controller } from "./enterprise-kernel-mega-pack-2.controller";
import { EnterpriseKernelMegaPack2Service } from "./enterprise-kernel-mega-pack-2.service";
import { KernelDependencyGraphService } from "./dependencies/kernel-dependency-graph.service";
import { KernelDependencyResolverService } from "./dependencies/kernel-dependency-resolver.service";
import { KernelCompatibilityService } from "./compatibility/kernel-compatibility.service";
import { KernelEnvironmentProfileService } from "./profiles/kernel-environment-profile.service";
import { KernelConfigurationRegistryService } from "./configuration/kernel-configuration-registry.service";
import { KernelConfigurationVersionService } from "./versions/kernel-configuration-version.service";
import { KernelConfigurationSnapshotService } from "./configuration/kernel-configuration-snapshot.service";
import { KernelConfigurationValidationService } from "./validation/kernel-configuration-validation.service";
import { KernelDependencyConfigurationReadinessService } from "./readiness/kernel-dependency-configuration-readiness.service";
import { KernelDependencyConfigurationHealthService } from "./health/kernel-dependency-configuration-health.service";
import { KernelDependencyConfigurationAuditService } from "./observability/kernel-dependency-configuration-audit.service";

@Module({
  controllers: [EnterpriseKernelMegaPack2Controller],
  providers: [
    EnterpriseKernelMegaPack2Service,
    KernelDependencyConfigurationAuditService,
    KernelDependencyGraphService,
    KernelDependencyResolverService,
    KernelCompatibilityService,
    KernelEnvironmentProfileService,
    KernelConfigurationVersionService,
    KernelConfigurationRegistryService,
    KernelConfigurationSnapshotService,
    KernelConfigurationValidationService,
    KernelDependencyConfigurationReadinessService,
    KernelDependencyConfigurationHealthService
  ],
  exports: [
    EnterpriseKernelMegaPack2Service,
    KernelDependencyConfigurationAuditService,
    KernelDependencyGraphService,
    KernelDependencyResolverService,
    KernelCompatibilityService,
    KernelEnvironmentProfileService,
    KernelConfigurationVersionService,
    KernelConfigurationRegistryService,
    KernelConfigurationSnapshotService,
    KernelConfigurationValidationService,
    KernelDependencyConfigurationReadinessService,
    KernelDependencyConfigurationHealthService
  ]
})
export class EnterpriseKernelMegaPack2Module {}
