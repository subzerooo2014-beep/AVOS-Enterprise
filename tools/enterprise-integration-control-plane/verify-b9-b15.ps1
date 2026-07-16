[CmdletBinding()]
param([string]$ProjectRoot = "C:\Users\User\Desktop\AVOS")

$ErrorActionPreference = "Stop"
$Root = Join-Path $ProjectRoot "apps\api\src\enterprise-integration-control-plane"

$Required = @(
  "enterprise-integration-control-plane.types.ts",
  "integration-discovery.service.ts",
  "integration-catalog.service.ts",
  "integration-provider-registry.service.ts",
  "integration-routing.service.ts",
  "integration-version-manager.service.ts",
  "integration-execution-observability.service.ts",
  "webhook-orchestrator.service.ts",
  "integration-governance.service.ts",
  "enterprise-integration-control-plane.service.ts",
  "enterprise-integration-control-plane.controller.ts",
  "enterprise-integration-control-plane.module.ts",
  "index.ts"
)

$Missing = @()
foreach ($File in $Required) {
  if (-not (Test-Path (Join-Path $Root $File))) { $Missing += $File }
}
if ($Missing.Count -gt 0) { throw "Missing B9-B15 files: $($Missing -join ', ')" }

$AppModule = Get-Content (Join-Path $ProjectRoot "apps\api\src\app.module.ts") -Raw
$Discovery = Get-Content (Join-Path $Root "integration-discovery.service.ts") -Raw
$Catalog = Get-Content (Join-Path $Root "integration-catalog.service.ts") -Raw
$Providers = Get-Content (Join-Path $Root "integration-provider-registry.service.ts") -Raw
$Routing = Get-Content (Join-Path $Root "integration-routing.service.ts") -Raw
$Versions = Get-Content (Join-Path $Root "integration-version-manager.service.ts") -Raw
$Observability = Get-Content (Join-Path $Root "integration-execution-observability.service.ts") -Raw
$Webhooks = Get-Content (Join-Path $Root "webhook-orchestrator.service.ts") -Raw
$Governance = Get-Content (Join-Path $Root "integration-governance.service.ts") -Raw
$ControlPlane = Get-Content (Join-Path $Root "enterprise-integration-control-plane.service.ts") -Raw
$Controller = Get-Content (Join-Path $Root "enterprise-integration-control-plane.controller.ts") -Raw

$Checks = [ordered]@{
  appModuleImport = $AppModule.Contains('import { EnterpriseIntegrationControlPlaneModule } from "./enterprise-integration-control-plane/enterprise-integration-control-plane.module";')
  appModuleRegistration = $AppModule -match 'imports:\s*\[\s*EnterpriseIntegrationControlPlaneModule,'
  discovery = $Discovery.Contains("discover(sourceRoot")
  catalog = $Catalog.Contains("private readonly components")
  providerRegistry = $Providers.Contains("private readonly providers")
  serviceDiscovery = $Providers.Contains("sync(")
  routing = $Routing.Contains("resolve(operation")
  versionManagement = $Versions.Contains("isCompatible(")
  observability = $Observability.Contains("begin(")
  analytics = $Observability.Contains("analytics()")
  webhookOrchestration = $Webhooks.Contains("dispatch(")
  governance = $Governance.Contains("validate()")
  gatewayUnification = $ControlPlane.Contains("gatewayUnification")
  connectorFramework = $ControlPlane.Contains("connectorFramework")
  statusEndpoint = $Controller.Contains('@Get("status")')
  diagnosticsEndpoint = $Controller.Contains('@Get("diagnostics")')
  refreshEndpoint = $Controller.Contains('@Post("refresh")')
  routeEndpoint = $Controller.Contains('@Post("routes")')
  webhookEndpoint = $Controller.Contains('@Post("webhooks/dispatch")')
}

$Failed = @($Checks.GetEnumerator() | Where-Object { -not $_.Value })
if ($Failed.Count -gt 0) { throw "B9-B15 verification failed: $($Failed.Name -join ', ')" }

[ordered]@{
  success = $true
  system = "AVOS Enterprise Integration Control Plane"
  bundle = "B9-B15"
  classification = "enterprise-integration-unification-control-plane"
  requiredFiles = $Required.Count
  compiledChecks = $Checks.Count
  discovery = "enabled"
  catalog = "enabled"
  providerRegistry = "enabled"
  serviceDiscovery = "enabled"
  routing = "enabled"
  versionManagement = "enabled"
  observability = "enabled"
  analytics = "enabled"
  webhookOrchestration = "enabled"
  governance = "enabled"
  gatewayUnification = "integration-ready"
  connectorFramework = "integration-ready"
  status = "VERIFIED"
} | ConvertTo-Json -Depth 10
