param(
    [string]$RepoRoot = "C:\Users\User\Desktop\AVOS"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ApiRoot = Join-Path $RepoRoot "apps\api"
$PackRoot = Join-Path $ApiRoot "src\enterprise-phase-4-ultra"
$AppModulePath = Join-Path $ApiRoot "src\app.module.ts"

$requiredFiles = @(
    "enterprise-phase-4-ultra.types.ts",
    "enterprise-digital-twin.service.ts",
    "enterprise-planning-engine.service.ts",
    "enterprise-reasoning-engine.service.ts",
    "enterprise-decision-graph.service.ts",
    "ai-strategic-planner.service.ts",
    "enterprise-resilience-laboratory.service.ts",
    "autonomous-workflow-intelligence.service.ts",
    "enterprise-governance-mesh.service.ts",
    "continuous-learning-engine.service.ts",
    "adaptive-optimization-engine.service.ts",
    "enterprise-phase-4-ultra-orchestrator.service.ts",
    "enterprise-phase-4-ultra.controller.ts",
    "enterprise-phase-4-ultra.module.ts"
)

foreach ($file in $requiredFiles) {
    $path = Join-Path $PackRoot $file
    if (-not (Test-Path $path)) {
        throw "Missing Phase 4 Ultra file: $path"
    }
}

$appModule = Get-Content -Path $AppModulePath -Raw
if ($appModule -notmatch "EnterprisePhase4UltraModule") {
    throw "EnterprisePhase4UltraModule is not registered in app.module.ts"
}

$tscCandidates = @(
    (Join-Path $RepoRoot "node_modules\typescript\bin\tsc"),
    (Join-Path $ApiRoot "node_modules\typescript\bin\tsc")
)

$tscPath = $tscCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $tscPath) {
    throw "TypeScript compiler was not found."
}

Push-Location $ApiRoot
try {
    & node $tscPath --noEmit -p .\tsconfig.json
    if ($LASTEXITCODE -ne 0) {
        throw "TypeScript verification failed with exit code $LASTEXITCODE"
    }
}
finally {
    Pop-Location
}

[pscustomobject]@{
    success = $true
    system = "AVOS Enterprise Phase 4 Ultra Pack"
    moduleRegistered = $true
    requiredFiles = $requiredFiles.Count
    enterpriseDigitalTwin = $true
    enterprisePlanningEngine = $true
    enterpriseReasoningEngine = $true
    enterpriseDecisionGraph = $true
    aiStrategicPlanner = $true
    enterpriseResilienceLaboratory = $true
    autonomousWorkflowIntelligence = $true
    enterpriseGovernanceMesh = $true
    continuousLearningEngine = $true
    adaptiveOptimizationEngine = $true
    typescript = "passed"
    healthStatus = "healthy"
}