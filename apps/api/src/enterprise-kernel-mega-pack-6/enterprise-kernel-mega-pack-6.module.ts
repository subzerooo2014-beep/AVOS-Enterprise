import { Module } from "@nestjs/common";
import { EnterpriseKernelMegaPack6Controller } from "./enterprise-kernel-mega-pack-6.controller";
import { EnterpriseKernelMegaPack6Service } from "./enterprise-kernel-mega-pack-6.service";
import { KernelPluginAuditService } from "./observability/kernel-plugin-audit.service";
import { KernelPluginRegistryService } from "./plugins/kernel-plugin-registry.service";
import { KernelPluginPermissionService } from "./plugins/kernel-plugin-permission.service";
import { KernelExtensionPointRegistryService } from "./extensions/kernel-extension-point-registry.service";
import { KernelPluginCompatibilityService } from "./compatibility/kernel-plugin-compatibility.service";
import { KernelPluginSandboxService } from "./sandbox/kernel-plugin-sandbox.service";
import { KernelPluginLifecycleService } from "./lifecycle/kernel-plugin-lifecycle.service";
import { KernelServiceRegistryService } from "./services/kernel-service-registry.service";
import { KernelCapabilityDiscoveryService } from "./capabilities/kernel-capability-discovery.service";
import { KernelSdkService } from "./sdk/kernel-sdk.service";
import { KernelPluginHealthService } from "./health/kernel-plugin-health.service";

@Module({
  controllers: [EnterpriseKernelMegaPack6Controller],
  providers: [
    EnterpriseKernelMegaPack6Service,
    KernelPluginAuditService,
    KernelPluginRegistryService,
    KernelPluginPermissionService,
    KernelExtensionPointRegistryService,
    KernelPluginCompatibilityService,
    KernelPluginSandboxService,
    KernelPluginLifecycleService,
    KernelServiceRegistryService,
    KernelCapabilityDiscoveryService,
    KernelSdkService,
    KernelPluginHealthService
  ],
  exports: [
    EnterpriseKernelMegaPack6Service,
    KernelPluginAuditService,
    KernelPluginRegistryService,
    KernelPluginPermissionService,
    KernelExtensionPointRegistryService,
    KernelPluginCompatibilityService,
    KernelPluginSandboxService,
    KernelPluginLifecycleService,
    KernelServiceRegistryService,
    KernelCapabilityDiscoveryService,
    KernelSdkService,
    KernelPluginHealthService
  ]
})
export class EnterpriseKernelMegaPack6Module {}
