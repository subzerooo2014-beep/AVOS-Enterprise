[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$base = Join-Path $RepoRoot "apps/api/src/global-intelligence-platform"

$requiredFiles = @(
    "global-intelligence-platform.types.ts",
    "global-intelligence-platform.registry.ts",
    "global-intelligence-platform.service.ts",
    "global-intelligence-platform.controller.ts",
    "global-intelligence-platform.module.ts",
    "index.ts"
)

foreach ($file in $requiredFiles) {
    $path = Join-Path $base $file

    if (-not (Test-Path -LiteralPath $path)) {
        throw "Missing file: $file"
    }
}

$registry = Get-Content -LiteralPath (Join-Path $base "global-intelligence-platform.registry.ts") -Raw
$service = Get-Content -LiteralPath (Join-Path $base "global-intelligence-platform.service.ts") -Raw

$requiredCapabilities = @(
    "ENTERPRISE_BRAIN",
    "DECISION_GRAPH",
    "KNOWLEDGE_MEMORY",
    "AGENT_ORCHESTRATION",
    "SCENARIO_SIMULATION",
    "PREDICTIVE_INTELLIGENCE",
    "STRATEGIC_PLANNING",
    "RISK_INTELLIGENCE",
    "MARKET_INTELLIGENCE",
    "CUSTOMER_INTELLIGENCE",
    "OPERATIONS_INTELLIGENCE",
    "FINANCIAL_INTELLIGENCE",
    "ECOSYSTEM_INTELLIGENCE",
    "POLICY_INTELLIGENCE",
    "REGULATORY_INTELLIGENCE",
    "EXPLAINABILITY",
    "AI_GOVERNANCE",
    "MODEL_REGISTRY",
    "PROMPT_REGISTRY",
    "TOOL_REGISTRY",
    "AGENT_REGISTRY",
    "MEMORY_REGISTRY",
    "KNOWLEDGE_GRAPH",
    "DECISION_AUDIT",
    "HUMAN_APPROVAL",
    "AUTONOMOUS_EXECUTION",
    "LEARNING_FEEDBACK",
    "QUALITY_EVALUATION",
    "INTELLIGENCE_HEALTH",
    "INTELLIGENCE_COMMAND_CENTER"
)

$missingCapabilities = @(
    $requiredCapabilities |
        Where-Object {
            $registry -notmatch "(?m)^\s*$([regex]::Escape($_))\s*:"
        }
)

if ($missingCapabilities.Count -gt 0) {
    throw "Missing capabilities: $($missingCapabilities -join ', ')"
}

$requiredMethods = @(
    "framework",
    "registerNode",
    "activateNode",
    "createDecision",
    "approveDecision",
    "executeDecision",
    "simulateScenario",
    "recordFeedback",
    "listNodes",
    "commandCenter"
)

$missingMethods = @(
    $requiredMethods |
        Where-Object {
            $service -notmatch $_
        }
)

if ($missingMethods.Count -gt 0) {
    throw "Missing runtime methods: $($missingMethods -join ', ')"
}

[pscustomobject]@{
    success = $true
    system = "AVOS Global Intelligence Platform - Enterprise Brain V2"
    verification = "passed"
    requiredFiles = $requiredFiles.Count
    capabilities = $requiredCapabilities.Count
    runtimeMethods = $requiredMethods.Count
} | Format-List