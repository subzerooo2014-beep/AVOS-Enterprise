[CmdletBinding()]
param([string]$ProjectRoot = "C:\Users\User\Desktop\AVOS")

$ErrorActionPreference = "Stop"
$Root = Join-Path $ProjectRoot "apps\api\src\enterprise-automation-digital-workforce"

$Required = @(
  "enterprise-automation-digital-workforce.types.ts",
  "digital-worker-registry.service.ts",
  "automation-registry.service.ts",
  "automation-approval.service.ts",
  "automation-job-orchestrator.service.ts",
  "automation-analytics.service.ts",
  "enterprise-automation-digital-workforce.controller.ts",
  "enterprise-automation-digital-workforce.module.ts",
  "index.ts"
)

$Missing = @()

foreach ($File in $Required) {
  if (-not (Test-Path (Join-Path $Root $File))) {
    $Missing += $File
  }
}

if ($Missing.Count -gt 0) {
  throw "Missing X2.1 files: $($Missing -join ', ')"
}

$AppModule = Get-Content (Join-Path $ProjectRoot "apps\api\src\app.module.ts") -Raw
$Workers = Get-Content (Join-Path $Root "digital-worker-registry.service.ts") -Raw
$Automations = Get-Content (Join-Path $Root "automation-registry.service.ts") -Raw
$Approvals = Get-Content (Join-Path $Root "automation-approval.service.ts") -Raw
$Jobs = Get-Content (Join-Path $Root "automation-job-orchestrator.service.ts") -Raw
$Analytics = Get-Content (Join-Path $Root "automation-analytics.service.ts") -Raw
$Controller = Get-Content (Join-Path $Root "enterprise-automation-digital-workforce.controller.ts") -Raw
$Module = Get-Content (Join-Path $Root "enterprise-automation-digital-workforce.module.ts") -Raw

$ImportCount = ([regex]::Matches(
  $AppModule,
  'enterprise-automation-digital-workforce/enterprise-automation-digital-workforce\.module'
)).Count

$ModuleCount = ([regex]::Matches(
  $AppModule,
  '\bEnterpriseAutomationDigitalWorkforceModule\b'
)).Count

$Checks = [ordered]@{
  uniqueModuleClass = $Module.Contains("export class EnterpriseAutomationDigitalWorkforceModule")
  singleImportPath = $ImportCount -eq 1
  moduleRegistered = $AppModule -match 'imports:\s*\[\s*EnterpriseAutomationDigitalWorkforceModule,'
  moduleOccurrencesValid = $ModuleCount -eq 2
  digitalWorkerRegistry = $Workers.Contains("private readonly workers")
  automationRegistry = $Automations.Contains("private readonly automations")
  humanApproval = $Approvals.Contains("approve(") -and $Approvals.Contains("reject(")
  jobQueue = $Jobs.Contains("queue(")
  jobOrchestrator = $Jobs.Contains("start(") -and $Jobs.Contains("advance(")
  executionTracking = $Jobs.Contains("private readonly executions")
  automationAnalytics = $Analytics.Contains("metrics(): AutomationMetrics")
  statusEndpoint = $Controller.Contains('@Get("status")')
  diagnosticsEndpoint = $Controller.Contains('@Get("diagnostics")')
  workerEndpoint = $Controller.Contains('@Post("workers")')
  automationEndpoint = $Controller.Contains('@Post("automations")')
  jobEndpoint = $Controller.Contains('@Post("jobs")')
  approvalEndpoint = $Controller.Contains('@Post("approvals/:id/approve")')
}

$Failed = @($Checks.GetEnumerator() | Where-Object { -not $_.Value })

if ($Failed.Count -gt 0) {
  throw "X2.1 verification failed: $($Failed.Name -join ', ')"
}

[ordered]@{
  success = $true
  system = "AVOS Enterprise Automation & Digital Workforce"
  bundle = "X2.1"
  classification = "enterprise-automation-digital-workforce"
  requiredFiles = $Required.Count
  compiledChecks = $Checks.Count
  digitalWorkerRegistry = "enabled"
  automationRegistry = "enabled"
  humanApproval = "enabled"
  jobQueue = "enabled"
  jobOrchestrator = "enabled"
  executionTracking = "enabled"
  automationAnalytics = "enabled"
  duplicateModuleProtection = "enabled"
  status = "VERIFIED"
} | ConvertTo-Json -Depth 10
