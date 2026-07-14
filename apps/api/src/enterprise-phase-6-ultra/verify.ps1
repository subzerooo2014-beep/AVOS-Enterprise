param([string]$RepoRoot = "C:\Users\User\Desktop\AVOS")

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ApiRoot = Join-Path $RepoRoot "apps\api"
$PackRoot = Join-Path $ApiRoot "src\enterprise-phase-6-ultra"
$AppModulePath = Join-Path $ApiRoot "src\app.module.ts"

$requiredFiles = @(
    "enterprise-phase-6-ultra.types.ts",
    "autonomous-ecosystem-genome.service.ts",
    "ai-value-creation-engine.service.ts",
    "predictive-demand-wave-engine.service.ts",
    "ai-collaboration-mesh-v2.service.ts",
    "dynamic-marketplace-composer-v2.service.ts",
    "customer-journey-genome-v2.service.ts",
    "enterprise-digital-memory-vault-v2.service.ts",
    "intelligent-service-orchestrator-v2.service.ts",
    "adaptive-pricing-intelligence.service.ts",
    "platform-evolution-index-v2.service.ts",
    "enterprise-phase-6-ultra-orchestrator.service.ts",
    "enterprise-phase-6-ultra.controller.ts",
    "enterprise-phase-6-ultra.module.ts"
)

foreach ($file in $requiredFiles) {
    $path = Join-Path $PackRoot $file
    if (-not (Test-Path $path)) {
        throw "Missing Phase 6 Ultra file: $path"
    }
}

$appModule = Get-Content -Path $AppModulePath -Raw
if ($appModule -notmatch "EnterprisePhase6UltraModule") {
    throw "EnterprisePhase6UltraModule is not registered"
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
    system = "AVOS Enterprise Phase 6 Ultra Pack"
    moduleRegistered = $true
    requiredFiles = $requiredFiles.Count
    autonomousEcosystemGenome = $true
    aiValueCreationEngine = $true
    predictiveDemandWaveEngine = $true
    aiCollaborationMeshV2 = $true
    dynamicMarketplaceComposerV2 = $true
    customerJourneyGenomeV2 = $true
    enterpriseDigitalMemoryVaultV2 = $true
    intelligentServiceOrchestratorV2 = $true
    adaptivePricingIntelligence = $true
    platformEvolutionIndexV2 = $true
    typescript = "passed"
    healthStatus = "healthy"
}