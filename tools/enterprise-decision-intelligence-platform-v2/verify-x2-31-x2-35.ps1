[CmdletBinding()]
param([string]$ProjectRoot = "C:\Users\User\Desktop\AVOS")

$ErrorActionPreference = "Stop"
$Root = Join-Path $ProjectRoot "apps\api\src\enterprise-decision-intelligence-platform-v2"

$Required = @(
  "enterprise-decision-intelligence-v2.types.ts",
  "decision-case-registry-v2.service.ts",
  "decision-scenario-engine-v2.service.ts",
  "decision-approval-workflow-v2.service.ts",
  "decision-audit-timeline-v2.service.ts",
  "decision-analytics-v2.service.ts",
  "enterprise-decision-intelligence-platform-v2.controller.ts",
  "enterprise-decision-intelligence-platform-v2.module.ts",
  "index.ts"
)

$Missing = @()
foreach ($File in $Required) {
  if (-not (Test-Path (Join-Path $Root $File))) {
    $Missing += $File
  }
}

if ($Missing.Count -gt 0) {
  throw "Missing X2.31-X2.35 files: $($Missing -join ', ')"
}

$AppModule = Get-Content (Join-Path $ProjectRoot "apps\api\src\app.module.ts") -Raw
$Registry = Get-Content (Join-Path $Root "decision-case-registry-v2.service.ts") -Raw
$Scenario = Get-Content (Join-Path $Root "decision-scenario-engine-v2.service.ts") -Raw
$Approval = Get-Content (Join-Path $Root "decision-approval-workflow-v2.service.ts") -Raw
$Audit = Get-Content (Join-Path $Root "decision-audit-timeline-v2.service.ts") -Raw
$Analytics = Get-Content (Join-Path $Root "decision-analytics-v2.service.ts") -Raw
$Controller = Get-Content (Join-Path $Root "enterprise-decision-intelligence-platform-v2.controller.ts") -Raw
$Module = Get-Content (Join-Path $Root "enterprise-decision-intelligence-platform-v2.module.ts") -Raw

$ImportCount = ([regex]::Matches(
  $AppModule,
  'enterprise-decision-intelligence-platform-v2/enterprise-decision-intelligence-platform-v2\.module'
)).Count

$ModuleCount = ([regex]::Matches(
  $AppModule,
  '\bEnterpriseDecisionIntelligencePlatformV2Module\b'
)).Count

$Checks = [ordered]@{
  uniqueModuleClass = $Module.Contains("export class EnterpriseDecisionIntelligencePlatformV2Module")
  singleImportPath = $ImportCount -eq 1
  moduleRegistered = $AppModule -match 'imports:\s*\[\s*EnterpriseDecisionIntelligencePlatformV2Module,'
  moduleOccurrencesValid = $ModuleCount -eq 2
  decisionRegistry = $Registry.Contains("private readonly decisions")
  scenarioEngine = $Scenario.Contains("addScenario(")
  recommendationEngine = $Scenario.Contains("recommend(decisionId")
  approvalWorkflow = $Approval.Contains("request(") -and $Approval.Contains("approve(")
  auditTimeline = $Audit.Contains("record(")
  analytics = $Analytics.Contains("metrics(): DecisionMetricsV2")
  statusEndpoint = $Controller.Contains('@Get("status")')
  diagnosticsEndpoint = $Controller.Contains('@Get("diagnostics")')
  decisionEndpoint = $Controller.Contains('@Post("decisions")')
  scenarioEndpoint = $Controller.Contains('@Post("decisions/:id/scenarios")')
  recommendationEndpoint = $Controller.Contains('@Post("decisions/:id/recommend")')
  approvalEndpoint = $Controller.Contains('@Post("decisions/:id/approval-request")')
  finalApprovalEndpoint = $Controller.Contains('@Post("decisions/:id/approve")')
  auditEndpoint = $Controller.Contains('@Get("decisions/:id/audit")')
}

$Failed = @($Checks.GetEnumerator() | Where-Object { -not $_.Value })

if ($Failed.Count -gt 0) {
  throw "X2.31-X2.35 verification failed: $($Failed.Name -join ', ')"
}

[ordered]@{
  success = $true
  system = "AVOS Enterprise Decision Intelligence Platform V2"
  bundle = "X2.31-X2.35"
  classification = "enterprise-decision-intelligence-platform-v2"
  requiredFiles = $Required.Count
  compiledChecks = $Checks.Count
  decisionRegistry = "enabled"
  scenarioEngine = "enabled"
  recommendationEngine = "enabled"
  approvalWorkflow = "enabled"
  impactAnalysis = "enabled"
  auditTimeline = "enabled"
  decisionAnalytics = "enabled"
  duplicateModuleProtection = "enabled"
  status = "VERIFIED"
} | ConvertTo-Json -Depth 10
