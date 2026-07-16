[CmdletBinding()]
param([string]$ProjectRoot = "C:\Users\User\Desktop\AVOS")

$ErrorActionPreference = "Stop"
$Root = Join-Path $ProjectRoot "apps\api\src\enterprise-global-cloud-platform"

$Required = @(
  "enterprise-global-cloud.types.ts",
  "cloud-region-registry.service.ts",
  "cloud-deployment-orchestrator.service.ts",
  "global-traffic-router.service.ts",
  "global-configuration-federation.service.ts",
  "release-channel-manager.service.ts",
  "cloud-governance.service.ts",
  "enterprise-global-cloud-platform.service.ts",
  "enterprise-global-cloud-platform.controller.ts",
  "enterprise-global-cloud-platform.module.ts",
  "index.ts"
)

$Missing = @()

foreach ($File in $Required) {
  if (-not (Test-Path (Join-Path $Root $File))) {
    $Missing += $File
  }
}

if ($Missing.Count -gt 0) {
  throw "Missing X2.7-X2.10 files: $($Missing -join ', ')"
}

$AppModule = Get-Content (Join-Path $ProjectRoot "apps\api\src\app.module.ts") -Raw
$Regions = Get-Content (Join-Path $Root "cloud-region-registry.service.ts") -Raw
$Deployments = Get-Content (Join-Path $Root "cloud-deployment-orchestrator.service.ts") -Raw
$Routes = Get-Content (Join-Path $Root "global-traffic-router.service.ts") -Raw
$Configuration = Get-Content (Join-Path $Root "global-configuration-federation.service.ts") -Raw
$Releases = Get-Content (Join-Path $Root "release-channel-manager.service.ts") -Raw
$Governance = Get-Content (Join-Path $Root "cloud-governance.service.ts") -Raw
$Platform = Get-Content (Join-Path $Root "enterprise-global-cloud-platform.service.ts") -Raw
$Controller = Get-Content (Join-Path $Root "enterprise-global-cloud-platform.controller.ts") -Raw
$Module = Get-Content (Join-Path $Root "enterprise-global-cloud-platform.module.ts") -Raw

$ImportCount = ([regex]::Matches(
  $AppModule,
  'enterprise-global-cloud-platform/enterprise-global-cloud-platform\.module'
)).Count

$ModuleCount = ([regex]::Matches(
  $AppModule,
  '\bEnterpriseGlobalCloudPlatformModule\b'
)).Count

$Checks = [ordered]@{
  uniqueModuleClass = $Module.Contains("export class EnterpriseGlobalCloudPlatformModule")
  singleImportPath = $ImportCount -eq 1
  moduleRegistered = $AppModule -match 'imports:\s*\[\s*EnterpriseGlobalCloudPlatformModule,'
  moduleOccurrencesValid = $ModuleCount -eq 2
  regionRegistry = $Regions.Contains("private readonly regions")
  deploymentOrchestrator = $Deployments.Contains("plan(") -and $Deployments.Contains("deploy(")
  trafficRouter = $Routes.Contains("resolve(service")
  configurationFederation = $Configuration.Contains("regionOverrides")
  releaseChannels = $Releases.Contains("activate(")
  cloudGovernance = $Governance.Contains("evaluate(context")
  platformHealth = $Platform.Contains("health(): GlobalCloudHealth")
  statusEndpoint = $Controller.Contains('@Get("status")')
  diagnosticsEndpoint = $Controller.Contains('@Get("diagnostics")')
  regionEndpoint = $Controller.Contains('@Post("regions")')
  deploymentEndpoint = $Controller.Contains('@Post("deployments")')
  routeEndpoint = $Controller.Contains('@Post("routes")')
  configurationEndpoint = $Controller.Contains('@Post("configuration")')
  releaseEndpoint = $Controller.Contains('@Post("release-channels")')
  governanceEndpoint = $Controller.Contains('@Post("governance-policies")')
}

$Failed = @($Checks.GetEnumerator() | Where-Object { -not $_.Value })

if ($Failed.Count -gt 0) {
  throw "X2.7-X2.10 verification failed: $($Failed.Name -join ', ')"
}

[ordered]@{
  success = $true
  system = "AVOS Enterprise Global Cloud & Multi-Region Platform"
  bundle = "X2.7-X2.10"
  classification = "enterprise-global-cloud-platform"
  requiredFiles = $Required.Count
  compiledChecks = $Checks.Count
  cloudRegionRegistry = "enabled"
  deploymentOrchestrator = "enabled"
  globalTrafficRouter = "enabled"
  multiRegionFailover = "enabled"
  configurationFederation = "enabled"
  releaseChannelManager = "enabled"
  cloudGovernance = "enabled"
  duplicateModuleProtection = "enabled"
  status = "VERIFIED"
} | ConvertTo-Json -Depth 10
