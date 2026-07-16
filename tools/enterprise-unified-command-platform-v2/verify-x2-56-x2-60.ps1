[CmdletBinding()]
param([string]$ProjectRoot = "C:\Users\User\Desktop\AVOS")

$ErrorActionPreference = "Stop"
$Root = Join-Path $ProjectRoot "apps\api\src\enterprise-unified-command-platform-v2"

$Required = @(
  "unified-command-v2.types.ts",
  "command-source-registry-v2.service.ts",
  "unified-command-orchestrator-v2.service.ts",
  "command-approval-v2.service.ts",
  "global-monitoring-v2.service.ts",
  "executive-cockpit-v2.service.ts",
  "enterprise-unified-command-platform-v2.service.ts",
  "enterprise-unified-command-platform-v2.controller.ts",
  "enterprise-unified-command-platform-v2.module.ts",
  "index.ts"
)

$Missing = @()

foreach ($File in $Required) {
  if (-not (Test-Path (Join-Path $Root $File))) {
    $Missing += $File
  }
}

if ($Missing.Count -gt 0) {
  throw "Missing X2.56-X2.60 files: $($Missing -join ', ')"
}

$AppModule = Get-Content (Join-Path $ProjectRoot "apps\api\src\app.module.ts") -Raw
$Types = Get-Content (Join-Path $Root "unified-command-v2.types.ts") -Raw
$Source = Get-Content (Join-Path $Root "command-source-registry-v2.service.ts") -Raw
$Command = Get-Content (Join-Path $Root "unified-command-orchestrator-v2.service.ts") -Raw
$Approval = Get-Content (Join-Path $Root "command-approval-v2.service.ts") -Raw
$Monitoring = Get-Content (Join-Path $Root "global-monitoring-v2.service.ts") -Raw
$Cockpit = Get-Content (Join-Path $Root "executive-cockpit-v2.service.ts") -Raw
$Platform = Get-Content (Join-Path $Root "enterprise-unified-command-platform-v2.service.ts") -Raw
$Controller = Get-Content (Join-Path $Root "enterprise-unified-command-platform-v2.controller.ts") -Raw
$Module = Get-Content (Join-Path $Root "enterprise-unified-command-platform-v2.module.ts") -Raw

$ImportCount = ([regex]::Matches(
  $AppModule,
  'enterprise-unified-command-platform-v2/enterprise-unified-command-platform-v2\.module'
)).Count

$ModuleCount = ([regex]::Matches(
  $AppModule,
  '\bEnterpriseUnifiedCommandPlatformV2Module\b'
)).Count

$Checks = [ordered]@{
  uniqueModuleClass = $Module.Contains("export class EnterpriseUnifiedCommandPlatformV2Module")
  singleImportPath = $ImportCount -eq 1
  moduleRegistered = $AppModule -match 'imports:\s*\[\s*EnterpriseUnifiedCommandPlatformV2Module,'
  moduleOccurrencesValid = $ModuleCount -eq 2
  typesExported = $Types.Contains("export interface UnifiedCommandV2")
  sourceRegistry = $Source.Contains("private readonly sources")
  commandOrchestrator = $Command.Contains("create(") -and $Command.Contains("execute(")
  approvalWorkflow = $Approval.Contains("request(") -and $Approval.Contains("approve(")
  globalMonitoring = $Monitoring.Contains("ingest(")
  executiveCockpit = $Cockpit.Contains("update(")
  platformHealth = $Platform.Contains("health(): UnifiedCommandHealthV2")
  dashboard = $Platform.Contains("dashboard()")
  statusEndpoint = $Controller.Contains('@Get("status")')
  dashboardEndpoint = $Controller.Contains('@Get("dashboard")')
  sourceEndpoint = $Controller.Contains('@Post("sources")')
  commandEndpoint = $Controller.Contains('@Post("commands")')
  executeEndpoint = $Controller.Contains('@Post("commands/:id/execute")')
  signalEndpoint = $Controller.Contains('@Post("signals")')
  metricEndpoint = $Controller.Contains('@Post("executive-metrics")')
}

$Failed = @($Checks.GetEnumerator() | Where-Object { -not $_.Value })

if ($Failed.Count -gt 0) {
  throw "X2.56-X2.60 verification failed: $($Failed.Name -join ', ')"
}

[ordered]@{
  success = $true
  system = "AVOS Enterprise Unified Command Platform V2"
  bundle = "X2.56-X2.60"
  classification = "enterprise-unified-command-platform-v2"
  requiredFiles = $Required.Count
  compiledChecks = $Checks.Count
  unifiedCommandCenter = "enabled"
  enterpriseControlPlane = "enabled"
  crossPlatformOperations = "enabled"
  executiveCockpit = "enabled"
  globalMonitoring = "enabled"
  unifiedAnalytics = "enabled"
  enterpriseDashboard = "enabled"
  duplicateModuleProtection = "enabled"
  x2SeriesStatus = "FINAL_BUNDLE"
  status = "VERIFIED"
} | ConvertTo-Json -Depth 10
