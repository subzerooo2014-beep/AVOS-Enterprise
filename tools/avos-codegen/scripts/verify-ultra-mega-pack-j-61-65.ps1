$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\ultra-mega-pack-j\contracts.ts",
    ".\src\ultra-mega-pack-j\autonomous-enterprise-intelligence.ts",
    ".\src\ultra-mega-pack-j\global-decision-mesh.ts",
    ".\src\ultra-mega-pack-j\self-designing-architecture.ts",
    ".\src\ultra-mega-pack-j\universal-knowledge-fabric.ts",
    ".\src\ultra-mega-pack-j\evolution-singularity.ts",
    ".\src\ultra-mega-pack-j\orchestrator-v7.ts",
    ".\src\ultra-mega-pack-j\runtime-verifier.ts",
    ".\src\ultra-mega-pack-j\index.ts",
    ".\manifests\ultra-mega-pack-j-61-65.manifest.json"
)

$MissingFiles = @($RequiredFiles | Where-Object { -not (Test-Path $_) })
if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\ultra-mega-pack-j-61-65.manifest.json" `
    -Raw |
ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent       = Test-Path ".\dist\ultra-mega-pack-j\contracts.js"
    intelligencePresent    = Test-Path ".\dist\ultra-mega-pack-j\autonomous-enterprise-intelligence.js"
    decisionMeshPresent    = Test-Path ".\dist\ultra-mega-pack-j\global-decision-mesh.js"
    architecturePresent    = Test-Path ".\dist\ultra-mega-pack-j\self-designing-architecture.js"
    knowledgePresent       = Test-Path ".\dist\ultra-mega-pack-j\universal-knowledge-fabric.js"
    evolutionPresent       = Test-Path ".\dist\ultra-mega-pack-j\evolution-singularity.js"
    orchestratorPresent    = Test-Path ".\dist\ultra-mega-pack-j\orchestrator-v7.js"
    verifierPresent        = Test-Path ".\dist\ultra-mega-pack-j\runtime-verifier.js"
    declarationPresent     = Test-Path ".\dist\ultra-mega-pack-j\orchestrator-v7.d.ts"
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
