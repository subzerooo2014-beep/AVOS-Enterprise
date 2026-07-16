[CmdletBinding()]
param([string]$ProjectRoot = "C:\Users\User\Desktop\AVOS")

$ErrorActionPreference = "Stop"
$Root = Join-Path $ProjectRoot "apps\api\src\enterprise-ai-governance-platform"

$Required = @(
  "enterprise-ai-governance.types.ts",
  "ai-policy-registry.service.ts",
  "ai-model-governance-registry.service.ts",
  "prompt-governance.service.ts",
  "ai-model-evaluation.service.ts",
  "ai-risk-center.service.ts",
  "ai-audit-center.service.ts",
  "ai-compliance.service.ts",
  "enterprise-ai-governance-platform.service.ts",
  "enterprise-ai-governance-platform.controller.ts",
  "enterprise-ai-governance-platform.module.ts",
  "index.ts"
)

$Missing = @()

foreach ($File in $Required) {
  if (-not (Test-Path (Join-Path $Root $File))) {
    $Missing += $File
  }
}

if ($Missing.Count -gt 0) {
  throw "Missing X1.5 files: $($Missing -join ', ')"
}

$AppModule = Get-Content (Join-Path $ProjectRoot "apps\api\src\app.module.ts") -Raw
$Policies = Get-Content (Join-Path $Root "ai-policy-registry.service.ts") -Raw
$Models = Get-Content (Join-Path $Root "ai-model-governance-registry.service.ts") -Raw
$Prompts = Get-Content (Join-Path $Root "prompt-governance.service.ts") -Raw
$Evaluations = Get-Content (Join-Path $Root "ai-model-evaluation.service.ts") -Raw
$Risks = Get-Content (Join-Path $Root "ai-risk-center.service.ts") -Raw
$Audits = Get-Content (Join-Path $Root "ai-audit-center.service.ts") -Raw
$Compliance = Get-Content (Join-Path $Root "ai-compliance.service.ts") -Raw
$Platform = Get-Content (Join-Path $Root "enterprise-ai-governance-platform.service.ts") -Raw
$Controller = Get-Content (Join-Path $Root "enterprise-ai-governance-platform.controller.ts") -Raw
$Module = Get-Content (Join-Path $Root "enterprise-ai-governance-platform.module.ts") -Raw

$ImportCount = ([regex]::Matches(
  $AppModule,
  'enterprise-ai-governance-platform/enterprise-ai-governance-platform\.module'
)).Count

$ModuleNameCount = ([regex]::Matches(
  $AppModule,
  '\bEnterpriseAiGovernancePlatformModule\b'
)).Count

$Checks = [ordered]@{
  uniqueModuleClass = $Module.Contains("export class EnterpriseAiGovernancePlatformModule")
  singleImportPath = $ImportCount -eq 1
  moduleRegistered = $AppModule -match 'imports:\s*\[\s*EnterpriseAiGovernancePlatformModule,'
  moduleOccurrencesValid = $ModuleNameCount -eq 2
  aiPolicyRegistry = $Policies.Contains("evaluate(context")
  aiModelRegistry = $Models.Contains("approve(id")
  promptGovernance = $Prompts.Contains("render(")
  modelEvaluation = $Evaluations.Contains("evaluate(")
  aiRiskCenter = $Risks.Contains("assess(")
  aiAudit = $Audits.Contains("record(")
  aiCompliance = $Compliance.Contains("validate()")
  platformHealth = $Platform.Contains("health(): AiGovernanceHealth")
  statusEndpoint = $Controller.Contains('@Get("status")')
  diagnosticsEndpoint = $Controller.Contains('@Get("diagnostics")')
  policyEndpoint = $Controller.Contains('@Post("policies")')
  modelEndpoint = $Controller.Contains('@Post("models")')
  promptEndpoint = $Controller.Contains('@Post("prompts")')
  evaluationEndpoint = $Controller.Contains('@Post("evaluations")')
  riskEndpoint = $Controller.Contains('@Post("risks")')
  complianceEndpoint = $Controller.Contains('@Get("compliance")')
}

$Failed = @($Checks.GetEnumerator() | Where-Object { -not $_.Value })

if ($Failed.Count -gt 0) {
  throw "X1.5 verification failed: $($Failed.Name -join ', ')"
}

[ordered]@{
  success = $true
  system = "AVOS Enterprise AI Governance Platform"
  bundle = "X1.5"
  classification = "enterprise-ai-governance-platform"
  requiredFiles = $Required.Count
  compiledChecks = $Checks.Count
  aiPolicyRegistry = "enabled"
  aiModelRegistry = "enabled"
  promptGovernance = "enabled"
  modelEvaluation = "enabled"
  aiRiskCenter = "enabled"
  aiAudit = "enabled"
  aiCompliance = "enabled"
  duplicateModuleProtection = "enabled"
  status = "VERIFIED"
} | ConvertTo-Json -Depth 10
