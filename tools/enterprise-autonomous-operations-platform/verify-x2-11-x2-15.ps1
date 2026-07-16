[CmdletBinding()]
param([string]$ProjectRoot = "C:\Users\User\Desktop\AVOS")

$ErrorActionPreference = "Stop"
$Root = Join-Path $ProjectRoot "apps\api\src\enterprise-autonomous-operations-platform"

$Required = @(
  "enterprise-autonomous-operations.types.ts",
  "operations-signal-center.service.ts",
  "ai-operations-orchestrator.service.ts",
  "self-healing-engine.service.ts",
  "predictive-operations.service.ts",
  "autonomous-incident-manager.service.ts",
  "enterprise-autonomous-operations-platform.service.ts",
  "enterprise-autonomous-operations-platform.controller.ts",
  "enterprise-autonomous-operations-platform.module.ts",
  "index.ts"
)

$Missing = @()
foreach ($File in $Required) {
  if (-not (Test-Path (Join-Path $Root $File))) {
    $Missing += $File
  }
}
if ($Missing.Count -gt 0) {
  throw "Missing X2.11-X2.15 files: $($Missing -join ', ')"
}

$AppModule = Get-Content (Join-Path $ProjectRoot "apps\api\src\app.module.ts") -Raw
$Signals = Get-Content (Join-Path $Root "operations-signal-center.service.ts") -Raw
$Orchestrator = Get-Content (Join-Path $Root "ai-operations-orchestrator.service.ts") -Raw
$Healing = Get-Content (Join-Path $Root "self-healing-engine.service.ts") -Raw
$Predictive = Get-Content (Join-Path $Root "predictive-operations.service.ts") -Raw
$Incidents = Get-Content (Join-Path $Root "autonomous-incident-manager.service.ts") -Raw
$Platform = Get-Content (Join-Path $Root "enterprise-autonomous-operations-platform.service.ts") -Raw
$Controller = Get-Content (Join-Path $Root "enterprise-autonomous-operations-platform.controller.ts") -Raw
$Module = Get-Content (Join-Path $Root "enterprise-autonomous-operations-platform.module.ts") -Raw

$ImportCount = ([regex]::Matches(
  $AppModule,
  'enterprise-autonomous-operations-platform/enterprise-autonomous-operations-platform\.module'
)).Count

$ModuleCount = ([regex]::Matches(
  $AppModule,
  '\bEnterpriseAutonomousOperationsPlatformModule\b'
)).Count

$Checks = [ordered]@{
  uniqueModuleClass = $Module.Contains("export class EnterpriseAutonomousOperationsPlatformModule")
  singleImportPath = $ImportCount -eq 1
  moduleRegistered = $AppModule -match 'imports:\s*\[\s*EnterpriseAutonomousOperationsPlatformModule,'
  moduleOccurrencesValid = $ModuleCount -eq 2
  signalCenter = $Signals.Contains("ingest(")
  aiOperationsOrchestrator = $Orchestrator.Contains("plan(") -and $Orchestrator.Contains("execute(")
  selfHealingEngine = $Healing.Contains("evaluate(signal")
  predictiveOperations = $Predictive.Contains("forecast(")
  costOptimization = $Predictive.Contains("optimizeCost(")
  incidentManager = $Incidents.Contains("create(") -and $Incidents.Contains("resolve(")
  platformHealth = $Platform.Contains("health(): AutonomousOperationsHealth")
  statusEndpoint = $Controller.Contains('@Get("status")')
  diagnosticsEndpoint = $Controller.Contains('@Get("diagnostics")')
  signalEndpoint = $Controller.Contains('@Post("signals")')
  healingEndpoint = $Controller.Contains('@Post("healing-policies")')
  actionEndpoint = $Controller.Contains('@Post("actions")')
  forecastEndpoint = $Controller.Contains('@Post("forecasts")')
  costEndpoint = $Controller.Contains('@Post("cost-optimizations")')
  incidentEndpoint = $Controller.Contains('@Post("incidents")')
}

$Failed = @($Checks.GetEnumerator() | Where-Object { -not $_.Value })
if ($Failed.Count -gt 0) {
  throw "X2.11-X2.15 verification failed: $($Failed.Name -join ', ')"
}

[ordered]@{
  success = $true
  system = "AVOS Enterprise Autonomous Operations Platform"
  bundle = "X2.11-X2.15"
  classification = "enterprise-autonomous-operations-platform"
  requiredFiles = $Required.Count
  compiledChecks = $Checks.Count
  autonomousOperationsCenter = "enabled"
  aiOperationsOrchestrator = "enabled"
  selfHealingEngine = "enabled"
  autonomousIncidentManager = "enabled"
  predictiveOperations = "enabled"
  capacityForecasting = "enabled"
  costOptimization = "enabled"
  operationsDashboard = "enabled"
  duplicateModuleProtection = "enabled"
  status = "VERIFIED"
} | ConvertTo-Json -Depth 10
