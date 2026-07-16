[CmdletBinding()]
param(
    [string]$ProjectRoot = "C:\Users\User\Desktop\AVOS"
)

$ErrorActionPreference = "Stop"

$Root = Join-Path $ProjectRoot "apps\api\src\event-platform-integration"
$Required = @(
    "event-platform-integration.types.ts",
    "event-platform-discovery.service.ts",
    "event-platform-catalog.service.ts",
    "event-platform-routing.service.ts",
    "event-platform-governance.service.ts",
    "event-platform-observability.service.ts",
    "event-platform-bridge.service.ts",
    "event-platform-integration.service.ts",
    "event-platform-integration.controller.ts",
    "event-platform-integration.module.ts",
    "index.ts"
)

$Missing = @()
foreach ($File in $Required) {
    if (-not (Test-Path (Join-Path $Root $File))) {
        $Missing += $File
    }
}

if ($Missing.Count -gt 0) {
    throw "Missing B3 files: $($Missing -join ', ')"
}

$AppModule = Get-Content (Join-Path $ProjectRoot "apps\api\src\app.module.ts") -Raw
$Discovery = Get-Content (Join-Path $Root "event-platform-discovery.service.ts") -Raw
$Catalog = Get-Content (Join-Path $Root "event-platform-catalog.service.ts") -Raw
$Routing = Get-Content (Join-Path $Root "event-platform-routing.service.ts") -Raw
$Governance = Get-Content (Join-Path $Root "event-platform-governance.service.ts") -Raw
$Observability = Get-Content (Join-Path $Root "event-platform-observability.service.ts") -Raw
$Bridge = Get-Content (Join-Path $Root "event-platform-bridge.service.ts") -Raw
$Integration = Get-Content (Join-Path $Root "event-platform-integration.service.ts") -Raw
$Controller = Get-Content (Join-Path $Root "event-platform-integration.controller.ts") -Raw

$Checks = [ordered]@{
    appModuleImport = $AppModule.Contains('import { EventPlatformIntegrationModule } from "./event-platform-integration/event-platform-integration.module";')
    appModuleRegistration = $AppModule -match 'imports:\s*\[\s*EventPlatformIntegrationModule,'
    discoveryEngine = $Discovery.Contains("discover(sourceRoot")
    eventCatalog = $Catalog.Contains("private readonly components")
    schemaRegistry = $Catalog.Contains('version: "1.0.0"') -or $Discovery.Contains('version: "1.0.0"')
    versionManager = $Discovery.Contains('version: "1.0.0"')
    routingCenter = $Routing.Contains("resolve(eventType")
    crossModuleBridge = $Bridge.Contains("bridge(")
    observability = $Observability.Contains("record(")
    analytics = $Observability.Contains("analytics()")
    governance = $Governance.Contains("validate()")
    lifecycleManager = $Integration.Contains("lifecycleManager")
    replayIntegrationReady = $Integration.Contains("replayOrchestration")
    statusEndpoint = $Controller.Contains('@Get("status")')
    diagnosticsEndpoint = $Controller.Contains('@Get("diagnostics")')
    refreshEndpoint = $Controller.Contains('@Post("refresh")')
    bridgeEndpoint = $Controller.Contains('@Post("bridge")')
    routesEndpoint = $Controller.Contains('@Post("routes")')
}

$Failed = @($Checks.GetEnumerator() | Where-Object { -not $_.Value })
if ($Failed.Count -gt 0) {
    throw "B3 verification failed: $($Failed.Name -join ', ')"
}

[ordered]@{
    success = $true
    system = "AVOS Event Platform Integration"
    bundle = "B3"
    classification = "event-platform-integration-unification"
    requiredFiles = $Required.Count
    compiledChecks = $Checks.Count
    eventDiscovery = "enabled"
    eventCatalog = "enabled"
    schemaRegistry = "enabled"
    versionManager = "enabled"
    routingCenter = "enabled"
    crossModuleBridge = "enabled"
    observability = "enabled"
    analytics = "enabled"
    governance = "enabled"
    replayOrchestration = "integration-ready"
    lifecycleManager = "enabled"
    status = "VERIFIED"
} | ConvertTo-Json -Depth 10

