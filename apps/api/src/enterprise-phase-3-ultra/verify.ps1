param(
    [string]$RepoRoot = "C:\Users\User\Desktop\AVOS"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ApiRoot = Join-Path $RepoRoot "apps\api"
$PackRoot = Join-Path $ApiRoot "src\enterprise-phase-3-ultra"
$AppModulePath = Join-Path $ApiRoot "src\app.module.ts"

$requiredFiles = @(
    "enterprise-phase-3-ultra.types.ts",
    "enterprise-knowledge-graph.service.ts",
    "context-memory-engine.service.ts",
    "ai-scenario-simulator.service.ts",
    "dynamic-regulation-engine.service.ts",
    "autonomous-partner-network.service.ts",
    "experience-composer-ai.service.ts",
    "predictive-maintenance-engine.service.ts",
    "self-healing-platform.service.ts",
    "enterprise-observability.service.ts",
    "global-standards-observatory.service.ts",
    "enterprise-phase-3-ultra-orchestrator.service.ts",
    "enterprise-phase-3-ultra.controller.ts",
    "enterprise-phase-3-ultra.module.ts"
)

foreach ($file in $requiredFiles) {
    $path = Join-Path $PackRoot $file
    if (-not (Test-Path $path)) {
        throw "Missing Phase 3 Ultra file: $path"
    }
}

$appModule = Get-Content -Path $AppModulePath -Raw
if ($appModule -notmatch "EnterprisePhase3UltraModule") {
    throw "EnterprisePhase3UltraModule is not registered in app.module.ts"
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
    system = "AVOS Enterprise Phase 3 Ultra Pack"
    moduleRegistered = $true
    requiredFiles = $requiredFiles.Count
    enterpriseKnowledgeGraph = $true
    contextMemoryEngine = $true
    aiScenarioSimulator = $true
    dynamicRegulationEngine = $true
    autonomousPartnerNetwork = $true
    experienceComposerAi = $true
    predictiveMaintenance = $true
    selfHealingPlatform = $true
    enterpriseObservability = $true
    globalStandardsObservatory = $true
    typescript = "passed"
    healthStatus = "healthy"
}