import { Module } from '@nestjs/common';
import { PlatformOsV2Controller } from './platform-os-v2.controller';
import { PlatformOsV2OrchestratorService } from './platform-os-v2-orchestrator.service';
import { PlatformOsV2DashboardService } from './platform-os-v2-dashboard.service';
import { RuntimePlatformController } from './controllers/runtime-platform.controller';
import { PluginsPlatformController } from './controllers/plugins-platform.controller';
import { CapabilitiesPlatformController } from './controllers/capabilities-platform.controller';
import { ExtensionsPlatformController } from './controllers/extensions-platform.controller';
import { AppStorePlatformController } from './controllers/app-store-platform.controller';
import { ConfigurationPlatformController } from './controllers/configuration-platform.controller';
import { SdkPlatformController } from './controllers/sdk-platform.controller';
import { GovernancePlatformController } from './controllers/governance-platform.controller';
import { MonitoringPlatformController } from './controllers/monitoring-platform.controller';
import { AutomationPlatformController } from './controllers/automation-platform.controller';
import { EnterpriseRuntimeV2Service } from './services/enterprise-runtime-v2.service';
import { ModuleRuntimeService } from './services/module-runtime.service';
import { DynamicModuleLoaderService } from './services/dynamic-module-loader.service';
import { RuntimeRegistryService } from './services/runtime-registry.service';
import { RuntimeHealthEngineService } from './services/runtime-health-engine.service';
import { RuntimeDiagnosticsService } from './services/runtime-diagnostics.service';
import { RuntimeLifecycleService } from './services/runtime-lifecycle.service';
import { RuntimeContextEngineService } from './services/runtime-context-engine.service';
import { PluginRegistryService } from './services/plugin-registry.service';
import { PluginInstallerService } from './services/plugin-installer.service';
import { PluginMarketplaceService } from './services/plugin-marketplace.service';
import { PluginSandboxService } from './services/plugin-sandbox.service';
import { PluginSecurityService } from './services/plugin-security.service';
import { PluginPermissionsService } from './services/plugin-permissions.service';
import { PluginVersioningService } from './services/plugin-versioning.service';
import { PluginDependenciesService } from './services/plugin-dependencies.service';
import { PluginUpdateEngineService } from './services/plugin-update-engine.service';
import { PluginRollbackEngineService } from './services/plugin-rollback-engine.service';
import { CapabilityRegistryV2Service } from './services/capability-registry-v2.service';
import { CapabilityDiscoveryService } from './services/capability-discovery.service';
import { CapabilityActivationService } from './services/capability-activation.service';
import { CapabilityPoliciesService } from './services/capability-policies.service';
import { CapabilityMarketplaceService } from './services/capability-marketplace.service';
import { CapabilityGraphService } from './services/capability-graph.service';
import { CapabilityMetricsService } from './services/capability-metrics.service';
import { CapabilityDependenciesService } from './services/capability-dependencies.service';
import { ExtensionSdkService } from './services/extension-sdk.service';
import { ExtensionLoaderService } from './services/extension-loader.service';
import { ExtensionApiEngineService } from './services/extension-api-engine.service';
import { ExtensionLifecycleService } from './services/extension-lifecycle.service';
import { ExtensionSecurityService } from './services/extension-security.service';
import { ExtensionEventsService } from './services/extension-events.service';
import { ExtensionStorageService } from './services/extension-storage.service';
import { ExtensionMarketplaceService } from './services/extension-marketplace.service';
import { EnterpriseAppStoreService } from './services/enterprise-app-store.service';
import { EnterprisePackageRegistryService } from './services/enterprise-package-registry.service';
import { AppInstallationEngineService } from './services/app-installation-engine.service';
import { AppUpdateEngineService } from './services/app-update-engine.service';
import { AppRollbackEngineService } from './services/app-rollback-engine.service';
import { LicenseManagerService } from './services/license-manager.service';
import { EnterpriseCatalogService } from './services/enterprise-catalog.service';
import { ReleaseChannelEngineService } from './services/release-channel-engine.service';
import { DynamicConfigurationService } from './services/dynamic-configuration.service';
import { EnvironmentProfileEngineService } from './services/environment-profile-engine.service';
import { FeatureFlagEngineService } from './services/feature-flag-engine.service';
import { SecretsProviderEngineService } from './services/secrets-provider-engine.service';
import { ConfigurationValidationService } from './services/configuration-validation.service';
import { ConfigurationVersioningService } from './services/configuration-versioning.service';
import { ConfigurationLiveReloadService } from './services/configuration-live-reload.service';
import { PolicyConfigurationService } from './services/policy-configuration.service';
import { BackendSdkService } from './services/backend-sdk.service';
import { FlutterSdkService } from './services/flutter-sdk.service';
import { WebSdkService } from './services/web-sdk.service';
import { PartnerSdkService } from './services/partner-sdk.service';
import { IntegrationSdkService } from './services/integration-sdk.service';
import { TestingSdkService } from './services/testing-sdk.service';
import { CliSdkService } from './services/cli-sdk.service';
import { GeneratorSdkService } from './services/generator-sdk.service';
import { ModulePolicyEngineService } from './services/module-policy-engine.service';
import { RuntimePolicyEngineService } from './services/runtime-policy-engine.service';
import { PluginGovernanceService } from './services/plugin-governance.service';
import { DependencyGovernanceService } from './services/dependency-governance.service';
import { SecurityGovernanceService } from './services/security-governance.service';
import { UpgradeGovernanceService } from './services/upgrade-governance.service';
import { CompatibilityEngineService } from './services/compatibility-engine.service';
import { PolicyEnforcementEngineService } from './services/policy-enforcement-engine.service';
import { RuntimeDashboardEngineService } from './services/runtime-dashboard-engine.service';
import { ModuleDashboardEngineService } from './services/module-dashboard-engine.service';
import { PluginDashboardEngineService } from './services/plugin-dashboard-engine.service';
import { HealthDashboardEngineService } from './services/health-dashboard-engine.service';
import { PlatformMetricsEngineService } from './services/platform-metrics-engine.service';
import { PlatformAlertsEngineService } from './services/platform-alerts-engine.service';
import { PlatformAuditEngineService } from './services/platform-audit-engine.service';
import { PlatformTelemetryEngineService } from './services/platform-telemetry-engine.service';
import { AutoRegistrationEngineService } from './services/auto-registration-engine.service';
import { AutoDiscoveryEngineService } from './services/auto-discovery-engine.service';
import { AutoUpgradeEngineService } from './services/auto-upgrade-engine.service';
import { AutoRollbackEngineService } from './services/auto-rollback-engine.service';
import { AutoRecoveryEngineService } from './services/auto-recovery-engine.service';
import { AutoDiagnosticsEngineService } from './services/auto-diagnostics-engine.service';
import { AutoOptimizationEngineService } from './services/auto-optimization-engine.service';
import { AutoValidationEngineService } from './services/auto-validation-engine.service';

@Module({
  controllers: [
    PlatformOsV2Controller,
    RuntimePlatformController,
    PluginsPlatformController,
    CapabilitiesPlatformController,
    ExtensionsPlatformController,
    AppStorePlatformController,
    ConfigurationPlatformController,
    SdkPlatformController,
    GovernancePlatformController,
    MonitoringPlatformController,
    AutomationPlatformController,
  ],
  providers: [
    EnterpriseRuntimeV2Service,
    ModuleRuntimeService,
    DynamicModuleLoaderService,
    RuntimeRegistryService,
    RuntimeHealthEngineService,
    RuntimeDiagnosticsService,
    RuntimeLifecycleService,
    RuntimeContextEngineService,
    PluginRegistryService,
    PluginInstallerService,
    PluginMarketplaceService,
    PluginSandboxService,
    PluginSecurityService,
    PluginPermissionsService,
    PluginVersioningService,
    PluginDependenciesService,
    PluginUpdateEngineService,
    PluginRollbackEngineService,
    CapabilityRegistryV2Service,
    CapabilityDiscoveryService,
    CapabilityActivationService,
    CapabilityPoliciesService,
    CapabilityMarketplaceService,
    CapabilityGraphService,
    CapabilityMetricsService,
    CapabilityDependenciesService,
    ExtensionSdkService,
    ExtensionLoaderService,
    ExtensionApiEngineService,
    ExtensionLifecycleService,
    ExtensionSecurityService,
    ExtensionEventsService,
    ExtensionStorageService,
    ExtensionMarketplaceService,
    EnterpriseAppStoreService,
    EnterprisePackageRegistryService,
    AppInstallationEngineService,
    AppUpdateEngineService,
    AppRollbackEngineService,
    LicenseManagerService,
    EnterpriseCatalogService,
    ReleaseChannelEngineService,
    DynamicConfigurationService,
    EnvironmentProfileEngineService,
    FeatureFlagEngineService,
    SecretsProviderEngineService,
    ConfigurationValidationService,
    ConfigurationVersioningService,
    ConfigurationLiveReloadService,
    PolicyConfigurationService,
    BackendSdkService,
    FlutterSdkService,
    WebSdkService,
    PartnerSdkService,
    IntegrationSdkService,
    TestingSdkService,
    CliSdkService,
    GeneratorSdkService,
    ModulePolicyEngineService,
    RuntimePolicyEngineService,
    PluginGovernanceService,
    DependencyGovernanceService,
    SecurityGovernanceService,
    UpgradeGovernanceService,
    CompatibilityEngineService,
    PolicyEnforcementEngineService,
    RuntimeDashboardEngineService,
    ModuleDashboardEngineService,
    PluginDashboardEngineService,
    HealthDashboardEngineService,
    PlatformMetricsEngineService,
    PlatformAlertsEngineService,
    PlatformAuditEngineService,
    PlatformTelemetryEngineService,
    AutoRegistrationEngineService,
    AutoDiscoveryEngineService,
    AutoUpgradeEngineService,
    AutoRollbackEngineService,
    AutoRecoveryEngineService,
    AutoDiagnosticsEngineService,
    AutoOptimizationEngineService,
    AutoValidationEngineService,
    PlatformOsV2OrchestratorService,
    PlatformOsV2DashboardService,
  ],
  exports: [
    EnterpriseRuntimeV2Service,
    ModuleRuntimeService,
    DynamicModuleLoaderService,
    RuntimeRegistryService,
    RuntimeHealthEngineService,
    RuntimeDiagnosticsService,
    RuntimeLifecycleService,
    RuntimeContextEngineService,
    PluginRegistryService,
    PluginInstallerService,
    PluginMarketplaceService,
    PluginSandboxService,
    PluginSecurityService,
    PluginPermissionsService,
    PluginVersioningService,
    PluginDependenciesService,
    PluginUpdateEngineService,
    PluginRollbackEngineService,
    CapabilityRegistryV2Service,
    CapabilityDiscoveryService,
    CapabilityActivationService,
    CapabilityPoliciesService,
    CapabilityMarketplaceService,
    CapabilityGraphService,
    CapabilityMetricsService,
    CapabilityDependenciesService,
    ExtensionSdkService,
    ExtensionLoaderService,
    ExtensionApiEngineService,
    ExtensionLifecycleService,
    ExtensionSecurityService,
    ExtensionEventsService,
    ExtensionStorageService,
    ExtensionMarketplaceService,
    EnterpriseAppStoreService,
    EnterprisePackageRegistryService,
    AppInstallationEngineService,
    AppUpdateEngineService,
    AppRollbackEngineService,
    LicenseManagerService,
    EnterpriseCatalogService,
    ReleaseChannelEngineService,
    DynamicConfigurationService,
    EnvironmentProfileEngineService,
    FeatureFlagEngineService,
    SecretsProviderEngineService,
    ConfigurationValidationService,
    ConfigurationVersioningService,
    ConfigurationLiveReloadService,
    PolicyConfigurationService,
    BackendSdkService,
    FlutterSdkService,
    WebSdkService,
    PartnerSdkService,
    IntegrationSdkService,
    TestingSdkService,
    CliSdkService,
    GeneratorSdkService,
    ModulePolicyEngineService,
    RuntimePolicyEngineService,
    PluginGovernanceService,
    DependencyGovernanceService,
    SecurityGovernanceService,
    UpgradeGovernanceService,
    CompatibilityEngineService,
    PolicyEnforcementEngineService,
    RuntimeDashboardEngineService,
    ModuleDashboardEngineService,
    PluginDashboardEngineService,
    HealthDashboardEngineService,
    PlatformMetricsEngineService,
    PlatformAlertsEngineService,
    PlatformAuditEngineService,
    PlatformTelemetryEngineService,
    AutoRegistrationEngineService,
    AutoDiscoveryEngineService,
    AutoUpgradeEngineService,
    AutoRollbackEngineService,
    AutoRecoveryEngineService,
    AutoDiagnosticsEngineService,
    AutoOptimizationEngineService,
    AutoValidationEngineService,
    PlatformOsV2OrchestratorService,
    PlatformOsV2DashboardService,
  ],
})
export class PlatformOsV2Module {}