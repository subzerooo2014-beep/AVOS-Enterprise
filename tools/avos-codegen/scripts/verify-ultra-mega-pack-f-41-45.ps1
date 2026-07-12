$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\ultra-mega-pack-f\contracts.ts",
    ".\src\ultra-mega-pack-f\autonomous-generation.ts",
    ".\src\ultra-mega-pack-f\self-evolution.ts",
    ".\src\ultra-mega-pack-f\validation-mesh.ts",
    ".\src\ultra-mega-pack-f\adaptive-blueprints.ts",
    ".\src\ultra-mega-pack-f\release-governance.ts",
    ".\src\ultra-mega-pack-f\orchestrator-v3.ts",
    ".\src\ultra-mega-pack-f\runtime-verifier.ts",
    ".\src\ultra-mega-pack-f\index.ts",
    ".\manifests\ultra-mega-pack-f-41-45.manifest.json"
)

$MissingFiles = @($RequiredFiles | Where-Object { -not (Test-Path $_) })
if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\ultra-mega-pack-f-41-45.manifest.json" `
    -Raw |
ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent       = Test-Path ".\dist\ultra-mega-pack-f\contracts.js"
    generationPresent      = Test-Path ".\dist\ultra-mega-pack-f\autonomous-generation.js"
    evolutionPresent       = Test-Path ".\dist\ultra-mega-pack-f\self-evolution.js"
    validationPresent      = Test-Path ".\dist\ultra-mega-pack-f\validation-mesh.js"
    blueprintsPresent      = Test-Path ".\dist\ultra-mega-pack-f\adaptive-blueprints.js"
    releasePresent         = Test-Path ".\dist\ultra-mega-pack-f\release-governance.js"
    orchestratorPresent    = Test-Path ".\dist\ultra-mega-pack-f\orchestrator-v3.js"
    verifierPresent        = Test-Path ".\dist\ultra-mega-pack-f\runtime-verifier.js"
    declarationPresent     = Test-Path ".\dist\ultra-mega-pack-f\orchestrator-v3.d.ts"
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
