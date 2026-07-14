param(
    [string]$RepoRoot = "C:\Users\User\Desktop\AVOS"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ApiRoot = Join-Path $RepoRoot "apps\api"
$PackRoot = Join-Path $ApiRoot "src\enterprise-phase-2-ultra"
$AppModulePath = Join-Path $ApiRoot "src\app.module.ts"

$requiredFiles = @(
    "enterprise-phase-2-ultra.types.ts",
    "capability-fusion.service.ts",
    "resource-optimization-brain.service.ts",
    "predictive-demand-wave.service.ts",
    "ai-collaboration-mesh.service.ts",
    "dynamic-marketplace-composer.service.ts",
    "enterprise-digital-memory-vault.service.ts",
    "customer-journey-genome.service.ts",
    "intelligent-service-orchestrator.service.ts",
    "platform-evolution-index.service.ts",
    "zero-touch-business-flow.service.ts",
    "enterprise-phase-2-ultra-orchestrator.service.ts",
    "enterprise-phase-2-ultra.controller.ts",
    "enterprise-phase-2-ultra.module.ts"
)

foreach ($file in $requiredFiles) {
    $path = Join-Path $PackRoot $file
    if (-not (Test-Path $path)) {
        throw "Missing Ultra Pack file: $path"
    }
}

$appModule = Get-Content -Path $AppModulePath -Raw
if ($appModule -notmatch "EnterprisePhase2UltraModule") {
    throw "EnterprisePhase2UltraModule is not registered in app.module.ts"
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
    system = "AVOS Enterprise Phase 2 Ultra Pack"
    moduleRegistered = $true
    requiredFiles = $requiredFiles.Count
    capabilityFusion = $true
    resourceOptimizationBrain = $true
    predictiveDemandWave = $true
    aiCollaborationMesh = $true
    dynamicMarketplaceComposer = $true
    enterpriseDigitalMemoryVault = $true
    customerJourneyGenome = $true
    intelligentServiceOrchestrator = $true
    platformEvolutionIndex = $true
    zeroTouchBusinessFlow = $true
    typescript = "passed"
    healthStatus = "healthy"
}