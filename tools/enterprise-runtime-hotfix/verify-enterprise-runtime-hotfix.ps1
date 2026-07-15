[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$root = Join-Path $RepoRoot "apps/api/src/enterprise-intelligence"

$expected = [ordered]@{
    "ai-swarm" = "AiSwarmModule"
    "executive-board" = "ExecutiveBoardModule"
    "knowledge-graph" = "KnowledgeGraphModule"
    "digital-twin" = "DigitalTwinModule"
    "scenario-simulator" = "ScenarioSimulatorModule"
    "decision-intelligence" = "DecisionIntelligenceModule"
    "workflow-autonomy" = "WorkflowAutonomyModule"
    "continuous-learning" = "ContinuousLearningModule"
    "decision-mesh" = "DecisionMeshModule"
    "command-center" = "CommandCenterModule"
}

foreach ($folder in $expected.Keys) {
    $path = Join-Path $root "$folder/module.ts"

    if (-not (Test-Path -LiteralPath $path)) {
        throw "Missing module file: $path"
    }

    $content = Get-Content -LiteralPath $path -Raw
    $className = $expected[$folder]

    if ($content -notmatch "export class $className\s*\{\s*\}") {
        throw "Invalid module class in $folder. Expected $className"
    }
}

$runtimeFiles = @(
    "apps/api/src/enterprise-runtime-v1/enterprise-runtime-v1.types.ts",
    "apps/api/src/enterprise-runtime-v1/enterprise-runtime-v1.service.ts",
    "apps/api/src/enterprise-runtime-v1/enterprise-runtime-v1.controller.ts",
    "apps/api/src/enterprise-runtime-v1/enterprise-runtime-v1.module.ts"
)

foreach ($relative in $runtimeFiles) {
    if (-not (Test-Path -LiteralPath (Join-Path $RepoRoot $relative))) {
        throw "Missing runtime file: $relative"
    }
}

[pscustomobject]@{
    success = $true
    verification = "passed"
    repairedModules = $expected.Count
    runtimeFiles = $runtimeFiles.Count
    identifiersValid = $true
}