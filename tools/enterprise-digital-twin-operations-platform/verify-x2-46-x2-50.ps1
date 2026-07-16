[CmdletBinding()]
param([string]$ProjectRoot = "C:\Users\User\Desktop\AVOS")

$ErrorActionPreference = "Stop"
$Root = Join-Path $ProjectRoot "apps\api\src\enterprise-digital-twin-operations-platform"

$Required = @(
  "enterprise-digital-twin-operations.types.ts",
  "operational-twin-registry.service.ts",
  "live-state-synchronization.service.ts",
  "scenario-replay-engine.service.ts",
  "predictive-twin-analytics.service.ts",
  "twin-health-monitor.service.ts",
  "enterprise-digital-twin-operations-platform.service.ts",
  "enterprise-digital-twin-operations-platform.controller.ts",
  "enterprise-digital-twin-operations-platform.module.ts",
  "index.ts"
)

$Missing = @()

foreach ($File in $Required) {
  if (-not (Test-Path (Join-Path $Root $File))) {
    $Missing += $File
  }
}

if ($Missing.Count -gt 0) {
  throw "Missing X2.46-X2.50 files: $($Missing -join ', ')"
}

$AppModule = Get-Content (Join-Path $ProjectRoot "apps\api\src\app.module.ts") -Raw
$Registry = Get-Content (Join-Path $Root "operational-twin-registry.service.ts") -Raw
$Types = Get-Content (Join-Path $Root "enterprise-digital-twin-operations.types.ts") -Raw
$Sync = Get-Content (Join-Path $Root "live-state-synchronization.service.ts") -Raw
$Replay = Get-Content (Join-Path $Root "scenario-replay-engine.service.ts") -Raw
$Predictive = Get-Content (Join-Path $Root "predictive-twin-analytics.service.ts") -Raw
$Health = Get-Content (Join-Path $Root "twin-health-monitor.service.ts") -Raw
$Platform = Get-Content (Join-Path $Root "enterprise-digital-twin-operations-platform.service.ts") -Raw
$Controller = Get-Content (Join-Path $Root "enterprise-digital-twin-operations-platform.controller.ts") -Raw
$Module = Get-Content (Join-Path $Root "enterprise-digital-twin-operations-platform.module.ts") -Raw

$ImportCount = ([regex]::Matches(
  $AppModule,
  'enterprise-digital-twin-operations-platform/enterprise-digital-twin-operations-platform\.module'
)).Count

$ModuleCount = ([regex]::Matches(
  $AppModule,
  '\bEnterpriseDigitalTwinOperationsPlatformModule\b'
)).Count

$Checks = [ordered]@{
  uniqueModuleClass = $Module.Contains("export class EnterpriseDigitalTwinOperationsPlatformModule")
  singleImportPath = $ImportCount -eq 1
  moduleRegistered = $AppModule -match 'imports:\s*\[\s*EnterpriseDigitalTwinOperationsPlatformModule,'
  moduleOccurrencesValid = $ModuleCount -eq 2
  enterpriseDigitalTwinEngine = $Registry.Contains("private readonly twins")
  assetTwinRegistry = $Registry.Contains('countByType(type')
  processTwinEngine = $Types.Contains('"PROCESS"') -and $Registry.Contains("countByType(")
  liveStateSynchronization = $Sync.Contains("synchronize(")
  scenarioReplay = $Replay.Contains("replay(")
  predictiveTwinAnalytics = $Predictive.Contains("analyze(twinId")
  twinHealthMonitor = $Health.Contains("check(twinId")
  platformHealth = $Platform.Contains("health(): DigitalTwinOperationsHealth")
  statusEndpoint = $Controller.Contains('@Get("status")')
  diagnosticsEndpoint = $Controller.Contains('@Get("diagnostics")')
  twinEndpoint = $Controller.Contains('@Post("twins")')
  synchronizeEndpoint = $Controller.Contains('@Post("twins/:id/synchronize")')
  replayEndpoint = $Controller.Contains('@Post("twins/:id/replay")')
  predictEndpoint = $Controller.Contains('@Post("twins/:id/predict")')
  healthEndpoint = $Controller.Contains('@Get("twins/:id/health")')
}

$Failed = @($Checks.GetEnumerator() | Where-Object { -not $_.Value })

if ($Failed.Count -gt 0) {
  throw "X2.46-X2.50 verification failed: $($Failed.Name -join ', ')"
}

[ordered]@{
  success = $true
  system = "AVOS Enterprise Digital Twin Operations Platform"
  bundle = "X2.46-X2.50"
  classification = "enterprise-digital-twin-operations-platform"
  requiredFiles = $Required.Count
  compiledChecks = $Checks.Count
  enterpriseDigitalTwinEngine = "enabled"
  liveStateSynchronization = "enabled"
  assetTwinRegistry = "enabled"
  processTwinEngine = "enabled"
  scenarioReplay = "enabled"
  predictiveTwinAnalytics = "enabled"
  twinHealthMonitor = "enabled"
  duplicateModuleProtection = "enabled"
  status = "VERIFIED"
} | ConvertTo-Json -Depth 10

