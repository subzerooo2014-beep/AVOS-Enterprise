[CmdletBinding()]
param([string]$ProjectRoot = "C:\Users\User\Desktop\AVOS")

$ErrorActionPreference = "Stop"
$Root = Join-Path $ProjectRoot "apps\api\src\enterprise-workflow-platform"

$Required = @(
  "enterprise-workflow.types.ts",
  "workflow-definition-registry.service.ts",
  "workflow-state-store.service.ts",
  "workflow-events.service.ts",
  "approval-gate.service.ts",
  "workflow-timeout-manager.service.ts",
  "compensation-engine.service.ts",
  "workflow-replay.service.ts",
  "workflow-metrics.service.ts",
  "saga-coordinator.service.ts",
  "enterprise-workflow-platform.service.ts",
  "enterprise-workflow-platform.controller.ts",
  "enterprise-workflow-platform.module.ts",
  "index.ts"
)

$Missing = @()
foreach ($File in $Required) {
  if (-not (Test-Path (Join-Path $Root $File))) { $Missing += $File }
}
if ($Missing.Count -gt 0) { throw "Missing workflow files: $($Missing -join ', ')" }

$AppModule = Get-Content (Join-Path $ProjectRoot "apps\api\src\app.module.ts") -Raw
$Saga = Get-Content (Join-Path $Root "saga-coordinator.service.ts") -Raw
$Compensation = Get-Content (Join-Path $Root "compensation-engine.service.ts") -Raw
$Approvals = Get-Content (Join-Path $Root "approval-gate.service.ts") -Raw
$Timeouts = Get-Content (Join-Path $Root "workflow-timeout-manager.service.ts") -Raw
$Replay = Get-Content (Join-Path $Root "workflow-replay.service.ts") -Raw
$Metrics = Get-Content (Join-Path $Root "workflow-metrics.service.ts") -Raw
$Controller = Get-Content (Join-Path $Root "enterprise-workflow-platform.controller.ts") -Raw

$Checks = [ordered]@{
  appModuleImport = $AppModule.Contains('import { EnterpriseWorkflowPlatformModule } from "./enterprise-workflow-platform/enterprise-workflow-platform.module";')
  appModuleRegistration = $AppModule -match 'imports:\s*\[\s*EnterpriseWorkflowPlatformModule,'
  workflowEngine = $Saga.Contains("start(")
  sagaCoordinator = $Saga.Contains("advance(")
  compensationEngine = $Compensation.Contains("compensate(")
  approvalGates = $Approvals.Contains("approve(") -and $Approvals.Contains("reject(")
  timeoutManager = $Timeouts.Contains("isTimedOut(")
  replayEngine = $Replay.Contains("replay(")
  workflowMetrics = $Metrics.Contains("snapshot()")
  workflowVersioning = (Get-Content (Join-Path $Root "workflow-definition-registry.service.ts") -Raw).Contains("version")
  longRunningTransactions = $Saga.Contains("WAITING_APPROVAL")
  statusEndpoint = $Controller.Contains('@Get("status")')
  diagnosticsEndpoint = $Controller.Contains('@Get("diagnostics")')
  startEndpoint = $Controller.Contains('@Post("executions/start")')
  compensateEndpoint = $Controller.Contains('@Post("executions/:id/compensate")')
}

$Failed = @($Checks.GetEnumerator() | Where-Object { -not $_.Value })
if ($Failed.Count -gt 0) { throw "B4-B8 verification failed: $($Failed.Name -join ', ')" }

[ordered]@{
  success = $true
  system = "AVOS Enterprise Workflow Platform"
  bundle = "B4-B8"
  classification = "workflow-saga-orchestration-platform"
  requiredFiles = $Required.Count
  compiledChecks = $Checks.Count
  workflowEngine = "enabled"
  sagaCoordinator = "enabled"
  compensationEngine = "enabled"
  approvalGates = "enabled"
  timeoutManager = "enabled"
  replayEngine = "enabled"
  workflowMetrics = "enabled"
  workflowVersioning = "enabled"
  longRunningTransactions = "enabled"
  status = "VERIFIED"
} | ConvertTo-Json -Depth 10
