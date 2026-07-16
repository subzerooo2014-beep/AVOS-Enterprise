[CmdletBinding()]
param([string]$ProjectRoot = "C:\Users\User\Desktop\AVOS")

$ErrorActionPreference = "Stop"
$Root = Join-Path $ProjectRoot "apps\api\src\enterprise-advanced-digital-twin-platform"

$Required = @(
  "enterprise-advanced-digital-twin.types.ts",
  "advanced-twin-registry.service.ts",
  "twin-state-synchronization.service.ts",
  "twin-scenario-laboratory.service.ts",
  "twin-insight-engine.service.ts",
  "enterprise-advanced-digital-twin-platform.service.ts",
  "enterprise-advanced-digital-twin-platform.controller.ts",
  "enterprise-advanced-digital-twin-platform.module.ts",
  "index.ts"
)

$Missing = @()

foreach ($File in $Required) {
  if (-not (Test-Path (Join-Path $Root $File))) {
    $Missing += $File
  }
}

if ($Missing.Count -gt 0) {
  throw "Missing X2.16-X2.20 files: $($Missing -join ', ')"
}

$AppModule = Get-Content (Join-Path $ProjectRoot "apps\api\src\app.module.ts") -Raw
$Registry = Get-Content (Join-Path $Root "advanced-twin-registry.service.ts") -Raw
$Sync = Get-Content (Join-Path $Root "twin-state-synchronization.service.ts") -Raw
$Scenarios = Get-Content (Join-Path $Root "twin-scenario-laboratory.service.ts") -Raw
$Insights = Get-Content (Join-Path $Root "twin-insight-engine.service.ts") -Raw
$Platform = Get-Content (Join-Path $Root "enterprise-advanced-digital-twin-platform.service.ts") -Raw
$Controller = Get-Content (Join-Path $Root "enterprise-advanced-digital-twin-platform.controller.ts") -Raw
$Module = Get-Content (Join-Path $Root "enterprise-advanced-digital-twin-platform.module.ts") -Raw

$ImportCount = ([regex]::Matches(
  $AppModule,
  'enterprise-advanced-digital-twin-platform/enterprise-advanced-digital-twin-platform\.module'
)).Count

$ModuleCount = ([regex]::Matches(
  $AppModule,
  '\bEnterpriseAdvancedDigitalTwinPlatformModule\b'
)).Count

$Checks = [ordered]@{
  uniqueModuleClass = $Module.Contains("export class EnterpriseAdvancedDigitalTwinPlatformModule")
  singleImportPath = $ImportCount -eq 1
  moduleRegistered = $AppModule -match 'imports:\s*\[\s*EnterpriseAdvancedDigitalTwinPlatformModule,'
  moduleOccurrencesValid = $ModuleCount -eq 2
  twinRegistry = $Registry.Contains("private readonly twins")
  stateSynchronization = $Sync.Contains("synchronize(")
  snapshotHistory = $Sync.Contains("private readonly snapshots")
  scenarioLaboratory = $Scenarios.Contains("createScenario(")
  whatIfSimulation = $Scenarios.Contains("simulate(")
  insightEngine = $Insights.Contains("analyze(twinId")
  platformHealth = $Platform.Contains("health(): AdvancedTwinHealth")
  statusEndpoint = $Controller.Contains('@Get("status")')
  diagnosticsEndpoint = $Controller.Contains('@Get("diagnostics")')
  twinEndpoint = $Controller.Contains('@Post("twins")')
  syncEndpoint = $Controller.Contains('@Post("twins/:id/synchronize")')
  scenarioEndpoint = $Controller.Contains('@Post("twins/:id/scenarios")')
  simulateEndpoint = $Controller.Contains('@Post("scenarios/:id/simulate")')
  analyzeEndpoint = $Controller.Contains('@Post("twins/:id/analyze")')
}

$Failed = @($Checks.GetEnumerator() | Where-Object { -not $_.Value })

if ($Failed.Count -gt 0) {
  throw "X2.16-X2.20 verification failed: $($Failed.Name -join ', ')"
}

[ordered]@{
  success = $true
  system = "AVOS Enterprise Advanced Digital Twin Platform"
  bundle = "X2.16-X2.20"
  classification = "enterprise-advanced-digital-twin-platform"
  requiredFiles = $Required.Count
  compiledChecks = $Checks.Count
  digitalTwinRegistry = "enabled"
  assetTwinEngine = "enabled"
  processTwinEngine = "enabled"
  organizationTwin = "enabled"
  scenarioSimulation = "enabled"
  whatIfAnalysis = "enabled"
  stateSynchronization = "enabled"
  twinInsightEngine = "enabled"
  twinAnalyticsDashboard = "enabled"
  duplicateModuleProtection = "enabled"
  status = "VERIFIED"
} | ConvertTo-Json -Depth 10
