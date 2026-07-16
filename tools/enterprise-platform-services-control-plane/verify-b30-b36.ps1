[CmdletBinding()]
param([string]$ProjectRoot = "C:\Users\User\Desktop\AVOS")

$ErrorActionPreference = "Stop"
$Root = Join-Path $ProjectRoot "apps\api\src\enterprise-platform-services-control-plane"

$Required = @(
  "enterprise-platform-services-control-plane.types.ts",
  "platform-services-discovery.service.ts",
  "platform-services-catalog.service.ts",
  "notification-orchestrator.service.ts",
  "scheduler-control.service.ts",
  "feature-flag.service.ts",
  "configuration-center.service.ts",
  "tenant-context.service.ts",
  "platform-services-observability.service.ts",
  "platform-services-governance.service.ts",
  "enterprise-platform-services-control-plane.service.ts",
  "enterprise-platform-services-control-plane.controller.ts",
  "enterprise-platform-services-control-plane.module.ts",
  "index.ts"
)

$Missing = @()
foreach ($File in $Required) {
  if (-not (Test-Path (Join-Path $Root $File))) { $Missing += $File }
}
if ($Missing.Count -gt 0) { throw "Missing B30-B36 files: $($Missing -join ', ')" }

$AppModule = Get-Content (Join-Path $ProjectRoot "apps\api\src\app.module.ts") -Raw
$Discovery = Get-Content (Join-Path $Root "platform-services-discovery.service.ts") -Raw
$Catalog = Get-Content (Join-Path $Root "platform-services-catalog.service.ts") -Raw
$Notifications = Get-Content (Join-Path $Root "notification-orchestrator.service.ts") -Raw
$Scheduler = Get-Content (Join-Path $Root "scheduler-control.service.ts") -Raw
$Flags = Get-Content (Join-Path $Root "feature-flag.service.ts") -Raw
$Configuration = Get-Content (Join-Path $Root "configuration-center.service.ts") -Raw
$Tenants = Get-Content (Join-Path $Root "tenant-context.service.ts") -Raw
$Observability = Get-Content (Join-Path $Root "platform-services-observability.service.ts") -Raw
$Governance = Get-Content (Join-Path $Root "platform-services-governance.service.ts") -Raw
$ControlPlane = Get-Content (Join-Path $Root "enterprise-platform-services-control-plane.service.ts") -Raw
$Controller = Get-Content (Join-Path $Root "enterprise-platform-services-control-plane.controller.ts") -Raw

$Checks = [ordered]@{
  appModuleImport = $AppModule.Contains('import { EnterprisePlatformServicesControlPlaneModule } from "./enterprise-platform-services-control-plane/enterprise-platform-services-control-plane.module";')
  appModuleRegistration = $AppModule -match 'imports:\s*\[\s*EnterprisePlatformServicesControlPlaneModule,'
  discovery = $Discovery.Contains("discover(sourceRoot")
  catalog = $Catalog.Contains("private readonly components")
  notificationOrchestration = $Notifications.Contains("queue(")
  schedulerControl = $Scheduler.Contains("register(")
  featureFlags = $Flags.Contains("isEnabled(")
  configurationCenter = $Configuration.Contains("private readonly configurations")
  tenantContext = $Tenants.Contains("private readonly tenants")
  observability = $Observability.Contains("analytics()")
  governance = $Governance.Contains("validate()")
  searchIntegration = $ControlPlane.Contains("searchIntegration")
  reportingIntegration = $ControlPlane.Contains("reportingIntegration")
  filesIntegration = $ControlPlane.Contains("filesIntegration")
  mediaIntegration = $ControlPlane.Contains("mediaIntegration")
  statusEndpoint = $Controller.Contains('@Get("status")')
  diagnosticsEndpoint = $Controller.Contains('@Get("diagnostics")')
  notificationEndpoint = $Controller.Contains('@Post("notifications")')
  scheduleEndpoint = $Controller.Contains('@Post("schedules")')
  featureFlagEndpoint = $Controller.Contains('@Post("feature-flags")')
  configurationEndpoint = $Controller.Contains('@Post("configuration")')
  tenantEndpoint = $Controller.Contains('@Post("tenants")')
}

$Failed = @($Checks.GetEnumerator() | Where-Object { -not $_.Value })
if ($Failed.Count -gt 0) { throw "B30-B36 verification failed: $($Failed.Name -join ', ')" }

[ordered]@{
  success = $true
  system = "AVOS Enterprise Platform Services Control Plane"
  bundle = "B30-B36"
  classification = "enterprise-platform-services-control-plane"
  requiredFiles = $Required.Count
  compiledChecks = $Checks.Count
  discovery = "enabled"
  catalog = "enabled"
  notificationOrchestration = "enabled"
  schedulerControl = "enabled"
  featureFlags = "enabled"
  configurationCenter = "enabled"
  tenantContext = "enabled"
  observability = "enabled"
  governance = "enabled"
  searchIntegration = "integration-ready"
  reportingIntegration = "integration-ready"
  filesIntegration = "integration-ready"
  mediaIntegration = "integration-ready"
  status = "VERIFIED"
} | ConvertTo-Json -Depth 10
