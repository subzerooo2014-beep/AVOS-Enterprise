[CmdletBinding()]
param([string]$ProjectRoot = "C:\Users\User\Desktop\AVOS")

$ErrorActionPreference = "Stop"
$Root = Join-Path $ProjectRoot "apps\api\src\enterprise-intelligence-control-plane"

$Required = @(
  "enterprise-intelligence-control-plane.types.ts",
  "intelligence-discovery.service.ts",
  "intelligence-catalog.service.ts",
  "intelligence-rule-registry.service.ts",
  "model-registry.service.ts",
  "prompt-registry.service.ts",
  "feature-store.service.ts",
  "decision-observability.service.ts",
  "explainability.service.ts",
  "decision-orchestrator.service.ts",
  "intelligence-governance.service.ts",
  "enterprise-intelligence-control-plane.service.ts",
  "enterprise-intelligence-control-plane.controller.ts",
  "enterprise-intelligence-control-plane.module.ts",
  "index.ts"
)

$Missing = @()
foreach ($File in $Required) {
  if (-not (Test-Path (Join-Path $Root $File))) { $Missing += $File }
}
if ($Missing.Count -gt 0) { throw "Missing B16-B22 files: $($Missing -join ', ')" }

$AppModule = Get-Content (Join-Path $ProjectRoot "apps\api\src\app.module.ts") -Raw
$Discovery = Get-Content (Join-Path $Root "intelligence-discovery.service.ts") -Raw
$Catalog = Get-Content (Join-Path $Root "intelligence-catalog.service.ts") -Raw
$Rules = Get-Content (Join-Path $Root "intelligence-rule-registry.service.ts") -Raw
$Models = Get-Content (Join-Path $Root "model-registry.service.ts") -Raw
$Prompts = Get-Content (Join-Path $Root "prompt-registry.service.ts") -Raw
$Features = Get-Content (Join-Path $Root "feature-store.service.ts") -Raw
$Decisions = Get-Content (Join-Path $Root "decision-orchestrator.service.ts") -Raw
$Explainability = Get-Content (Join-Path $Root "explainability.service.ts") -Raw
$Observability = Get-Content (Join-Path $Root "decision-observability.service.ts") -Raw
$Governance = Get-Content (Join-Path $Root "intelligence-governance.service.ts") -Raw
$ControlPlane = Get-Content (Join-Path $Root "enterprise-intelligence-control-plane.service.ts") -Raw
$Controller = Get-Content (Join-Path $Root "enterprise-intelligence-control-plane.controller.ts") -Raw

$Checks = [ordered]@{
  appModuleImport = $AppModule.Contains('import { EnterpriseIntelligenceControlPlaneModule } from "./enterprise-intelligence-control-plane/enterprise-intelligence-control-plane.module";')
  appModuleRegistration = $AppModule -match 'imports:\s*\[\s*EnterpriseIntelligenceControlPlaneModule,'
  discovery = $Discovery.Contains("discover(sourceRoot")
  catalog = $Catalog.Contains("private readonly components")
  ruleRegistry = $Rules.Contains("private readonly rules")
  modelRegistry = $Models.Contains("private readonly models")
  promptRegistry = $Prompts.Contains("private readonly prompts")
  featureStore = $Features.Contains("private readonly features")
  decisionOrchestration = $Decisions.Contains("decide(request")
  explainability = $Explainability.Contains("explain(result")
  observability = $Observability.Contains("record(result")
  analytics = $Observability.Contains("analytics()")
  governance = $Governance.Contains("validate()")
  existingAiIntegration = $ControlPlane.Contains("existingAiIntegration")
  statusEndpoint = $Controller.Contains('@Get("status")')
  diagnosticsEndpoint = $Controller.Contains('@Get("diagnostics")')
  decisionEndpoint = $Controller.Contains('@Post("decisions")')
  ruleEndpoint = $Controller.Contains('@Post("rules")')
  modelEndpoint = $Controller.Contains('@Post("models")')
  promptEndpoint = $Controller.Contains('@Post("prompts")')
  featureEndpoint = $Controller.Contains('@Post("features/:entityId/:key")')
}

$Failed = @($Checks.GetEnumerator() | Where-Object { -not $_.Value })
if ($Failed.Count -gt 0) { throw "B16-B22 verification failed: $($Failed.Name -join ', ')" }

[ordered]@{
  success = $true
  system = "AVOS Enterprise Intelligence Control Plane"
  bundle = "B16-B22"
  classification = "enterprise-intelligence-decision-control-plane"
  requiredFiles = $Required.Count
  compiledChecks = $Checks.Count
  discovery = "enabled"
  catalog = "enabled"
  ruleRegistry = "enabled"
  modelRegistry = "enabled"
  promptRegistry = "enabled"
  featureStore = "enabled"
  decisionOrchestration = "enabled"
  explainability = "enabled"
  observability = "enabled"
  analytics = "enabled"
  governance = "enabled"
  existingAiIntegration = "integration-ready"
  status = "VERIFIED"
} | ConvertTo-Json -Depth 10
