[CmdletBinding()]
param([string]$ProjectRoot = "C:\Users\User\Desktop\AVOS")

$ErrorActionPreference = "Stop"
$Root = Join-Path $ProjectRoot "apps\api\src\enterprise-strategic-planning-simulation-platform"

$Required = @(
  "enterprise-strategic-planning-simulation.types.ts",
  "strategy-registry.service.ts",
  "scenario-planning-engine.service.ts",
  "portfolio-prioritization.service.ts",
  "strategy-execution-tracker.service.ts",
  "strategic-risk-simulation.service.ts",
  "strategic-planning-analytics.service.ts",
  "enterprise-strategic-planning-simulation-platform.controller.ts",
  "enterprise-strategic-planning-simulation-platform.module.ts",
  "index.ts"
)

$Missing = @()

foreach ($File in $Required) {
  if (-not (Test-Path (Join-Path $Root $File))) {
    $Missing += $File
  }
}

if ($Missing.Count -gt 0) {
  throw "Missing X2.36-X2.40 files: $($Missing -join ', ')"
}

$AppModule = Get-Content (Join-Path $ProjectRoot "apps\api\src\app.module.ts") -Raw
$Strategy = Get-Content (Join-Path $Root "strategy-registry.service.ts") -Raw
$Scenario = Get-Content (Join-Path $Root "scenario-planning-engine.service.ts") -Raw
$Portfolio = Get-Content (Join-Path $Root "portfolio-prioritization.service.ts") -Raw
$Execution = Get-Content (Join-Path $Root "strategy-execution-tracker.service.ts") -Raw
$Risk = Get-Content (Join-Path $Root "strategic-risk-simulation.service.ts") -Raw
$Analytics = Get-Content (Join-Path $Root "strategic-planning-analytics.service.ts") -Raw
$Controller = Get-Content (Join-Path $Root "enterprise-strategic-planning-simulation-platform.controller.ts") -Raw
$Module = Get-Content (Join-Path $Root "enterprise-strategic-planning-simulation-platform.module.ts") -Raw

$ImportCount = ([regex]::Matches(
  $AppModule,
  'enterprise-strategic-planning-simulation-platform/enterprise-strategic-planning-simulation-platform\.module'
)).Count

$ModuleCount = ([regex]::Matches(
  $AppModule,
  '\bEnterpriseStrategicPlanningSimulationPlatformModule\b'
)).Count

$Checks = [ordered]@{
  uniqueModuleClass = $Module.Contains("export class EnterpriseStrategicPlanningSimulationPlatformModule")
  singleImportPath = $ImportCount -eq 1
  moduleRegistered = $AppModule -match 'imports:\s*\[\s*EnterpriseStrategicPlanningSimulationPlatformModule,'
  moduleOccurrencesValid = $ModuleCount -eq 2
  strategyRegistry = $Strategy.Contains("private readonly plans")
  scenarioPlanning = $Scenario.Contains("createScenario(")
  strategicForecasting = $Scenario.Contains("forecast(")
  portfolioPrioritization = $Portfolio.Contains("priorityScore")
  executionTracking = $Execution.Contains("update(")
  riskSimulation = $Risk.Contains("simulate(")
  strategicAnalytics = $Analytics.Contains("metrics(): StrategicPlanningMetrics")
  statusEndpoint = $Controller.Contains('@Get("status")')
  diagnosticsEndpoint = $Controller.Contains('@Get("diagnostics")')
  planEndpoint = $Controller.Contains('@Post("plans")')
  scenarioEndpoint = $Controller.Contains('@Post("plans/:id/scenarios")')
  forecastEndpoint = $Controller.Contains('@Post("scenarios/:id/forecast")')
  initiativeEndpoint = $Controller.Contains('@Post("plans/:id/initiatives")')
  executionEndpoint = $Controller.Contains('@Post("initiatives/:id/execution")')
  riskEndpoint = $Controller.Contains('@Post("scenarios/:id/risk-simulate")')
}

$Failed = @($Checks.GetEnumerator() | Where-Object { -not $_.Value })

if ($Failed.Count -gt 0) {
  throw "X2.36-X2.40 verification failed: $($Failed.Name -join ', ')"
}

[ordered]@{
  success = $true
  system = "AVOS Enterprise Strategic Planning & Simulation Platform"
  bundle = "X2.36-X2.40"
  classification = "enterprise-strategic-planning-simulation-platform"
  requiredFiles = $Required.Count
  compiledChecks = $Checks.Count
  strategyRegistry = "enabled"
  scenarioPlanning = "enabled"
  strategicForecasting = "enabled"
  portfolioPrioritization = "enabled"
  riskSimulation = "enabled"
  executionTracking = "enabled"
  strategicAnalytics = "enabled"
  duplicateModuleProtection = "enabled"
  status = "VERIFIED"
} | ConvertTo-Json -Depth 10
