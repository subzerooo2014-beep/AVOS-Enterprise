param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$base = Join-Path $RepoRoot "apps/api/src/global-intelligence-platform"

$files = @(
  "global-intelligence-platform.types.ts",
  "global-intelligence-platform.registry.ts",
  "global-intelligence-platform.service.ts",
  "global-intelligence-platform.controller.ts",
  "global-intelligence-platform.module.ts",
  "index.ts"
)

foreach ($file in $files) {
  if (-not (Test-Path (Join-Path $base $file))) {
    throw "Missing: $file"
  }
}

$registry = Get-Content `
  (Join-Path $base "global-intelligence-platform.registry.ts") `
  -Raw

$service = Get-Content `
  (Join-Path $base "global-intelligence-platform.service.ts") `
  -Raw

$checks = @{
  enterpriseBrain = $registry -match "ENTERPRISE_BRAIN"
  decisionGraph = $registry -match "DECISION_GRAPH"
  memory = $registry -match "KNOWLEDGE_MEMORY"
  agents = $registry -match "AGENT_ORCHESTRATION"
  simulation = $registry -match "SCENARIO_SIMULATION"
  strategy = $registry -match "STRATEGIC_PLANNING"
  risk = $registry -match "RISK_INTELLIGENCE"
  governance = $registry -match "AI_GOVERNANCE"
  registries = $registry -match "MODEL_REGISTRY"
  autonomous = $registry -match "AUTONOMOUS_EXECUTION"
  learning = $registry -match "LEARNING_FEEDBACK"
  health = $registry -match "INTELLIGENCE_HEALTH"
  commandCenter = $registry -match "INTELLIGENCE_COMMAND_CENTER"
  nodeRuntime = $service -match "registerNode"
  decisionRuntime = $service -match "createDecision"
  approvalRuntime = $service -match "approveDecision"
  executionRuntime = $service -match "executeDecision"
  scenarioRuntime = $service -match "simulateScenario"
  feedbackRuntime = $service -match "recordFeedback"
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
  system = "AVOS Global Intelligence Platform — Enterprise Brain V2"
  verification = "passed"
  requiredFiles = $files.Count
  checks = $checks.Count
  capabilities = $capabilityCount
} | Format-List