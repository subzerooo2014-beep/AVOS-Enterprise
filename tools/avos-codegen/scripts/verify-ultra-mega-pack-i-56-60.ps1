$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\ultra-mega-pack-i\contracts.ts",
    ".\src\ultra-mega-pack-i\digital-twin.ts",
    ".\src\ultra-mega-pack-i\policy-negotiation.ts",
    ".\src\ultra-mega-pack-i\global-orchestration-fabric.ts",
    ".\src\ultra-mega-pack-i\cognitive-operations-memory.ts",
    ".\src\ultra-mega-pack-i\singularity-coordination.ts",
    ".\src\ultra-mega-pack-i\orchestrator-v6.ts",
    ".\src\ultra-mega-pack-i\runtime-verifier.ts",
    ".\src\ultra-mega-pack-i\index.ts",
    ".\manifests\ultra-mega-pack-i-56-60.manifest.json"
)

$MissingFiles = @($RequiredFiles | Where-Object { -not (Test-Path $_) })
if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\ultra-mega-pack-i-56-60.manifest.json" `
    -Raw |
ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent       = Test-Path ".\dist\ultra-mega-pack-i\contracts.js"
    twinPresent            = Test-Path ".\dist\ultra-mega-pack-i\digital-twin.js"
    negotiationPresent     = Test-Path ".\dist\ultra-mega-pack-i\policy-negotiation.js"
    fabricPresent          = Test-Path ".\dist\ultra-mega-pack-i\global-orchestration-fabric.js"
    memoryPresent          = Test-Path ".\dist\ultra-mega-pack-i\cognitive-operations-memory.js"
    singularityPresent     = Test-Path ".\dist\ultra-mega-pack-i\singularity-coordination.js"
    orchestratorPresent    = Test-Path ".\dist\ultra-mega-pack-i\orchestrator-v6.js"
    verifierPresent        = Test-Path ".\dist\ultra-mega-pack-i\runtime-verifier.js"
    declarationPresent     = Test-Path ".\dist\ultra-mega-pack-i\orchestrator-v6.d.ts"
}

$FailedChecks = @(
    $Checks.GetEnumerator() |
        Where-Object { -not $_.Value } |
        ForEach-Object { $_.Key }
)

if ($FailedChecks.Count -gt 0) {
    throw "Build verification failed: $($FailedChecks -join ', ')"
}

[PSCustomObject]@{
    success          = $true
    system           = $Manifest.system
    bundle           = $Manifest.bundle
    version          = $Manifest.version
    classification   = $Manifest.classification
    packs            = $Manifest.packs -join ", "
    capabilities     = $Manifest.capabilities.Count
    requiredFiles    = $RequiredFiles.Count
    compiledChecks   = $Checks.Count
    healthStatus     = "healthy"
} | Format-List
