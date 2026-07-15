import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const distRoot = path.resolve('apps/api/dist');

function findFile(name) {
  const stack = [distRoot];

  while (stack.length > 0) {
    const current = stack.pop();

    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);

      if (entry.isDirectory()) stack.push(full);
      else if (entry.name === name) return full;
    }
  }

  throw new Error(`Compiled file not found: ${name}`);
}

async function load(name) {
  return import(pathToFileURL(findFile(name)));
}

const s0M = await load('enterprise-runtime-v2.service.js');
const s1M = await load('module-runtime.service.js');
const s2M = await load('dynamic-module-loader.service.js');
const s3M = await load('runtime-registry.service.js');
const s4M = await load('runtime-health-engine.service.js');
const s5M = await load('runtime-diagnostics.service.js');
const s6M = await load('runtime-lifecycle.service.js');
const s7M = await load('runtime-context-engine.service.js');
const s8M = await load('plugin-registry.service.js');
const s9M = await load('plugin-installer.service.js');
const s10M = await load('plugin-marketplace.service.js');
const s11M = await load('plugin-sandbox.service.js');
const s12M = await load('plugin-security.service.js');
const s13M = await load('plugin-permissions.service.js');
const s14M = await load('plugin-versioning.service.js');
const s15M = await load('plugin-dependencies.service.js');
const s16M = await load('plugin-update-engine.service.js');
const s17M = await load('plugin-rollback-engine.service.js');
const s18M = await load('capability-registry-v2.service.js');
const s19M = await load('capability-discovery.service.js');
const s20M = await load('capability-activation.service.js');
const s21M = await load('capability-policies.service.js');
const s22M = await load('capability-marketplace.service.js');
const s23M = await load('capability-graph.service.js');
const s24M = await load('capability-metrics.service.js');
const s25M = await load('capability-dependencies.service.js');
const s26M = await load('extension-sdk.service.js');
const s27M = await load('extension-loader.service.js');
const s28M = await load('extension-api-engine.service.js');
const s29M = await load('extension-lifecycle.service.js');
const s30M = await load('extension-security.service.js');
const s31M = await load('extension-events.service.js');
const s32M = await load('extension-storage.service.js');
const s33M = await load('extension-marketplace.service.js');
const s34M = await load('enterprise-app-store.service.js');
const s35M = await load('enterprise-package-registry.service.js');
const s36M = await load('app-installation-engine.service.js');
const s37M = await load('app-update-engine.service.js');
const s38M = await load('app-rollback-engine.service.js');
const s39M = await load('license-manager.service.js');
const s40M = await load('enterprise-catalog.service.js');
const s41M = await load('release-channel-engine.service.js');
const s42M = await load('dynamic-configuration.service.js');
const s43M = await load('environment-profile-engine.service.js');
const s44M = await load('feature-flag-engine.service.js');
const s45M = await load('secrets-provider-engine.service.js');
const s46M = await load('configuration-validation.service.js');
const s47M = await load('configuration-versioning.service.js');
const s48M = await load('configuration-live-reload.service.js');
const s49M = await load('policy-configuration.service.js');
const s50M = await load('backend-sdk.service.js');
const s51M = await load('flutter-sdk.service.js');
const s52M = await load('web-sdk.service.js');
const s53M = await load('partner-sdk.service.js');
const s54M = await load('integration-sdk.service.js');
const s55M = await load('testing-sdk.service.js');
const s56M = await load('cli-sdk.service.js');
const s57M = await load('generator-sdk.service.js');
const s58M = await load('module-policy-engine.service.js');
const s59M = await load('runtime-policy-engine.service.js');
const s60M = await load('plugin-governance.service.js');
const s61M = await load('dependency-governance.service.js');
const s62M = await load('security-governance.service.js');
const s63M = await load('upgrade-governance.service.js');
const s64M = await load('compatibility-engine.service.js');
const s65M = await load('policy-enforcement-engine.service.js');
const s66M = await load('runtime-dashboard-engine.service.js');
const s67M = await load('module-dashboard-engine.service.js');
const s68M = await load('plugin-dashboard-engine.service.js');
const s69M = await load('health-dashboard-engine.service.js');
const s70M = await load('platform-metrics-engine.service.js');
const s71M = await load('platform-alerts-engine.service.js');
const s72M = await load('platform-audit-engine.service.js');
const s73M = await load('platform-telemetry-engine.service.js');
const s74M = await load('auto-registration-engine.service.js');
const s75M = await load('auto-discovery-engine.service.js');
const s76M = await load('auto-upgrade-engine.service.js');
const s77M = await load('auto-rollback-engine.service.js');
const s78M = await load('auto-recovery-engine.service.js');
const s79M = await load('auto-diagnostics-engine.service.js');
const s80M = await load('auto-optimization-engine.service.js');
const s81M = await load('auto-validation-engine.service.js');
const orchestratorM = await load('platform-os-v2-orchestrator.service.js');
const dashboardM = await load('platform-os-v2-dashboard.service.js');

const s0 = new s0M.EnterpriseRuntimeV2Service();
const s1 = new s1M.ModuleRuntimeService();
const s2 = new s2M.DynamicModuleLoaderService();
const s3 = new s3M.RuntimeRegistryService();
const s4 = new s4M.RuntimeHealthEngineService();
const s5 = new s5M.RuntimeDiagnosticsService();
const s6 = new s6M.RuntimeLifecycleService();
const s7 = new s7M.RuntimeContextEngineService();
const s8 = new s8M.PluginRegistryService();
const s9 = new s9M.PluginInstallerService();
const s10 = new s10M.PluginMarketplaceService();
const s11 = new s11M.PluginSandboxService();
const s12 = new s12M.PluginSecurityService();
const s13 = new s13M.PluginPermissionsService();
const s14 = new s14M.PluginVersioningService();
const s15 = new s15M.PluginDependenciesService();
const s16 = new s16M.PluginUpdateEngineService();
const s17 = new s17M.PluginRollbackEngineService();
const s18 = new s18M.CapabilityRegistryV2Service();
const s19 = new s19M.CapabilityDiscoveryService();
const s20 = new s20M.CapabilityActivationService();
const s21 = new s21M.CapabilityPoliciesService();
const s22 = new s22M.CapabilityMarketplaceService();
const s23 = new s23M.CapabilityGraphService();
const s24 = new s24M.CapabilityMetricsService();
const s25 = new s25M.CapabilityDependenciesService();
const s26 = new s26M.ExtensionSdkService();
const s27 = new s27M.ExtensionLoaderService();
const s28 = new s28M.ExtensionApiEngineService();
const s29 = new s29M.ExtensionLifecycleService();
const s30 = new s30M.ExtensionSecurityService();
const s31 = new s31M.ExtensionEventsService();
const s32 = new s32M.ExtensionStorageService();
const s33 = new s33M.ExtensionMarketplaceService();
const s34 = new s34M.EnterpriseAppStoreService();
const s35 = new s35M.EnterprisePackageRegistryService();
const s36 = new s36M.AppInstallationEngineService();
const s37 = new s37M.AppUpdateEngineService();
const s38 = new s38M.AppRollbackEngineService();
const s39 = new s39M.LicenseManagerService();
const s40 = new s40M.EnterpriseCatalogService();
const s41 = new s41M.ReleaseChannelEngineService();
const s42 = new s42M.DynamicConfigurationService();
const s43 = new s43M.EnvironmentProfileEngineService();
const s44 = new s44M.FeatureFlagEngineService();
const s45 = new s45M.SecretsProviderEngineService();
const s46 = new s46M.ConfigurationValidationService();
const s47 = new s47M.ConfigurationVersioningService();
const s48 = new s48M.ConfigurationLiveReloadService();
const s49 = new s49M.PolicyConfigurationService();
const s50 = new s50M.BackendSdkService();
const s51 = new s51M.FlutterSdkService();
const s52 = new s52M.WebSdkService();
const s53 = new s53M.PartnerSdkService();
const s54 = new s54M.IntegrationSdkService();
const s55 = new s55M.TestingSdkService();
const s56 = new s56M.CliSdkService();
const s57 = new s57M.GeneratorSdkService();
const s58 = new s58M.ModulePolicyEngineService();
const s59 = new s59M.RuntimePolicyEngineService();
const s60 = new s60M.PluginGovernanceService();
const s61 = new s61M.DependencyGovernanceService();
const s62 = new s62M.SecurityGovernanceService();
const s63 = new s63M.UpgradeGovernanceService();
const s64 = new s64M.CompatibilityEngineService();
const s65 = new s65M.PolicyEnforcementEngineService();
const s66 = new s66M.RuntimeDashboardEngineService();
const s67 = new s67M.ModuleDashboardEngineService();
const s68 = new s68M.PluginDashboardEngineService();
const s69 = new s69M.HealthDashboardEngineService();
const s70 = new s70M.PlatformMetricsEngineService();
const s71 = new s71M.PlatformAlertsEngineService();
const s72 = new s72M.PlatformAuditEngineService();
const s73 = new s73M.PlatformTelemetryEngineService();
const s74 = new s74M.AutoRegistrationEngineService();
const s75 = new s75M.AutoDiscoveryEngineService();
const s76 = new s76M.AutoUpgradeEngineService();
const s77 = new s77M.AutoRollbackEngineService();
const s78 = new s78M.AutoRecoveryEngineService();
const s79 = new s79M.AutoDiagnosticsEngineService();
const s80 = new s80M.AutoOptimizationEngineService();
const s81 = new s81M.AutoValidationEngineService();

const orchestrator =
  new orchestratorM.PlatformOsV2OrchestratorService(
    s0,
    s1,
    s2,
    s3,
    s4,
    s5,
    s6,
    s7,
    s8,
    s9,
    s10,
    s11,
    s12,
    s13,
    s14,
    s15,
    s16,
    s17,
    s18,
    s19,
    s20,
    s21,
    s22,
    s23,
    s24,
    s25,
    s26,
    s27,
    s28,
    s29,
    s30,
    s31,
    s32,
    s33,
    s34,
    s35,
    s36,
    s37,
    s38,
    s39,
    s40,
    s41,
    s42,
    s43,
    s44,
    s45,
    s46,
    s47,
    s48,
    s49,
    s50,
    s51,
    s52,
    s53,
    s54,
    s55,
    s56,
    s57,
    s58,
    s59,
    s60,
    s61,
    s62,
    s63,
    s64,
    s65,
    s66,
    s67,
    s68,
    s69,
    s70,
    s71,
    s72,
    s73,
    s74,
    s75,
    s76,
    s77,
    s78,
    s79,
    s80,
    s81,
  );

const health = orchestrator.health();

if (
  health.total !== 82 ||
  !health.platformHealthy
) {
  throw new Error('Platform OS orchestration failed');
}

const dashboard = new dashboardM.PlatformOsV2DashboardService();
const snapshot = dashboard.snapshot({
  healthyComponents: health.healthy,
  platformScore: 100,
});

if (
  Object.keys(snapshot.capabilityStatus).length !== 82
) {
  throw new Error('Platform OS capability count mismatch');
}

console.log(
  JSON.stringify(
    {
      success: true,
      system: 'Mega System 1 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â AVOS Platform OS',
      capabilityCount: health.total,
      healthyCapabilities: health.healthy,
      platformHealthy: health.platformHealthy,
      platformScore: snapshot.platformScore,
    },
    null,
    2,
  ),
);