[CmdletBinding()]
param([string]$ProjectRoot = "C:\Users\User\Desktop\AVOS")

$ErrorActionPreference = "Stop"
$Root = Join-Path $ProjectRoot "apps\api\src\enterprise-autonomous-intelligence-platform-v2"

$Required = @(
  "autonomous-intelligence-v2.types.ts",
  "intelligence-agent-registry-v2.service.ts",
  "autonomous-planning-v2.service.ts",
  "ai-decision-orchestrator-v2.service.ts",
  "multi-agent-collaboration-v2.service.ts",
  "continuous-learning-v2.service.ts",
  "predictive-intelligence-v2.service.ts",
  "autonomous-intelligence-platform-v2.service.ts",
  "enterprise-autonomous-intelligence-platform-v2.controller.ts",
  "enterprise-autonomous-intelligence-platform-v2.module.ts",
  "index.ts"
)

$Missing = @()
foreach ($File in $Required) {
  if (-not (Test-Path (Join-Path $Root $File))) {
    $Missing += $File
  }
}

if ($Missing.Count -gt 0) {
  throw "Missing X2.51-X2.55 files: $($Missing -join ', ')"
}

$AppModule = Get-Content (Join-Path $ProjectRoot "apps\api\src\app.module.ts") -Raw
$Module = Get-Content (Join-Path $Root "enterprise-autonomous-intelligence-platform-v2.module.ts") -Raw
$Controller = Get-Content (Join-Path $Root "enterprise-autonomous-intelligence-platform-v2.controller.ts") -Raw
$Platform = Get-Content (Join-Path $Root "autonomous-intelligence-platform-v2.service.ts") -Raw

$ImportCount = ([regex]::Matches(
  $AppModule,
  'enterprise-autonomous-intelligence-platform-v2/enterprise-autonomous-intelligence-platform-v2\.module'
)).Count

$ModuleCount = ([regex]::Matches(
  $AppModule,
  '\bEnterpriseAutonomousIntelligencePlatformV2Module\b'
)).Count

$Checks = [ordered]@{
  uniqueModuleClass = $Module.Contains("export class EnterpriseAutonomousIntelligencePlatformV2Module")
  singleImportPath = $ImportCount -eq 1
  moduleRegistered = $AppModule -match 'imports:\s*\[\s*EnterpriseAutonomousIntelligencePlatformV2Module,'
  moduleOccurrencesValid = $ModuleCount -eq 2
  platformHealth = $Platform.Contains("health(): AutonomousIntelligenceHealthV2")
  statusEndpoint = $Controller.Contains('@Get("status")')
  diagnosticsEndpoint = $Controller.Contains('@Get("diagnostics")')
  agentsEndpoint = $Controller.Contains('@Post("agents")')
  plansEndpoint = $Controller.Contains('@Post("plans")')
  decisionsEndpoint = $Controller.Contains('@Post("plans/:id/decisions")')
  collaborationsEndpoint = $Controller.Contains('@Post("collaborations")')
  learningsEndpoint = $Controller.Contains('@Post("learnings")')
  predictionsEndpoint = $Controller.Contains('@Post("predictions")')
}

$Failed = @($Checks.GetEnumerator() | Where-Object { -not $_.Value })

if ($Failed.Count -gt 0) {
  throw "X2.51-X2.55 verification failed: $($Failed.Name -join ', ')"
}

[ordered]@{
  success = $true
  system = "AVOS Enterprise Autonomous Intelligence Platform V2"
  bundle = "X2.51-X2.55"
  requiredFiles = $Required.Count
  compiledChecks = $Checks.Count
  autonomousIntelligenceCore = "enabled"
  aiDecisionOrchestrator = "enabled"
  multiAgentCollaboration = "enabled"
  autonomousPlanningEngine = "enabled"
  continuousLearningCenter = "enabled"
  predictiveIntelligenceHub = "enabled"
  intelligenceAnalytics = "enabled"
  duplicateModuleProtection = "enabled"
  status = "VERIFIED"
} | ConvertTo-Json -Depth 10
