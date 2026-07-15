param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$base = Join-Path $RepoRoot "apps/api/src/autonomous-enterprise-execution"

$files = @(
  "autonomous-enterprise-execution.types.ts",
  "autonomous-enterprise-execution.registry.ts",
  "autonomous-enterprise-execution.service.ts",
  "autonomous-enterprise-execution.controller.ts",
  "autonomous-enterprise-execution.module.ts",
  "index.ts"
)

foreach ($file in $files) {
  if (-not (Test-Path (Join-Path $base $file))) {
    throw "Missing: $file"
  }
}

$registry = Get-Content `
  (Join-Path $base "autonomous-enterprise-execution.registry.ts") `
  -Raw

$service = Get-Content `
  (Join-Path $base "autonomous-enterprise-execution.service.ts") `
  -Raw

$checks = @{
  decisionIntake = $registry -match "DECISION_INTAKE"
  policy = $registry -match "POLICY_ENFORCEMENT"
  approval = $registry -match "APPROVAL_ORCHESTRATION"
  workflow = $registry -match "WORKFLOW_EXECUTION"
  agent = $registry -match "AGENT_EXECUTION"
  tools = $registry -match "TOOL_EXECUTION"
  autonomy = $registry -match "AUTONOMY_LEVELS"
  guardrails = $registry -match "EXECUTION_GUARDRAILS"
  rollback = $registry -match "ROLLBACK_ENGINE"
  recovery = $registry -match "RECOVERY_ORCHESTRATION"
  audit = $registry -match "EXECUTION_AUDIT"
  observability = $registry -match "EXECUTION_OBSERVABILITY"
  commandCenter = $registry -match "EXECUTION_COMMAND_CENTER"
  createRuntime = $service -match "createPlan"
  policyRuntime = $service -match "evaluatePolicy"
  validateRuntime = $service -match "validatePlan"
  approvalRuntime = $service -match "approvePlan"
  runRuntime = $service -match "startRun"
  stepRuntime = $service -match "completeStep"
  failRuntime = $service -match "failRun"
  rollbackRuntime = $service -match "rollbackRun"
  commandRuntime = $service -match "commandCenter"
}

$failed = @(
  $checks.GetEnumerator() |
    Where-Object { -not $_.Value }
)

if ($failed.Count) {
  throw "Verification failed: $($failed.Name -join ', ')"
}

$capabilityCount = (
  [regex]::Matches(
    $registry,
    '^[ ]{2}[A-Z_]+:\s*\{',
    "Multiline"
  )
).Count

if ($capabilityCount -lt 30) {
  throw "Expected at least 30 capabilities, found $capabilityCount"
}

[pscustomobject]@{
  success = $true
  system = "AVOS Autonomous Enterprise Execution Platform V1"
  verification = "passed"
  requiredFiles = $files.Count
  checks = $checks.Count
  capabilities = $capabilityCount
} | Format-List