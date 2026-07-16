import { Module } from "@nestjs/common";
import { EnterpriseRuntimePlatformV1Controller } from "./enterprise-runtime-platform-v1.controller";
import { EnterpriseRuntimePlatformV1Service } from "./enterprise-runtime-platform-v1.service";
import { RuntimeDependencyResolverV1Service } from "./runtime-dependency-resolver-v1.service";
import { RuntimeDiagnosticsV1Service } from "./runtime-diagnostics-v1.service";
import { RuntimeFailoverManagerV1Service } from "./runtime-failover-manager-v1.service";
import { RuntimeHealthOrchestratorV1Service } from "./runtime-health-orchestrator-v1.service";
import { RuntimeLifecycleManagerV1Service } from "./runtime-lifecycle-manager-v1.service";
import { RuntimeRecoveryCoordinatorV1Service } from "./runtime-recovery-coordinator-v1.service";
import { RuntimeServiceRegistryV1Service } from "./runtime-service-registry-v1.service";

@Module({
  controllers: [EnterpriseRuntimePlatformV1Controller],
  providers: [
    EnterpriseRuntimePlatformV1Service,
    RuntimeDependencyResolverV1Service,
    RuntimeDiagnosticsV1Service,
    RuntimeFailoverManagerV1Service,
    RuntimeHealthOrchestratorV1Service,
    RuntimeLifecycleManagerV1Service,
    RuntimeRecoveryCoordinatorV1Service,
    RuntimeServiceRegistryV1Service,
  ],
  exports: [
    EnterpriseRuntimePlatformV1Service,
    RuntimeDependencyResolverV1Service,
    RuntimeDiagnosticsV1Service,
    RuntimeFailoverManagerV1Service,
    RuntimeHealthOrchestratorV1Service,
    RuntimeLifecycleManagerV1Service,
    RuntimeRecoveryCoordinatorV1Service,
    RuntimeServiceRegistryV1Service,
  ],
})
export class EnterpriseRuntimePlatformV1Module {}
