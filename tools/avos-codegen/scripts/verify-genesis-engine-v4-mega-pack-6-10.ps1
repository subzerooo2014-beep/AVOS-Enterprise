$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\genesis-engine-v4-mega-pack-6-10\contracts.ts",
    ".\src\genesis-engine-v4-mega-pack-6-10\name-utils.ts",
    ".\src\genesis-engine-v4-mega-pack-6-10\model-generator.ts",
    ".\src\genesis-engine-v4-mega-pack-6-10\schema-renderer.ts",
    ".\src\genesis-engine-v4-mega-pack-6-10\migration-planner.ts",
    ".\src\genesis-engine-v4-mega-pack-6-10\seed-generator.ts",
    ".\src\genesis-engine-v4-mega-pack-6-10\database-intelligence.ts",
    ".\src\genesis-engine-v4-mega-pack-6-10\orchestrator.ts",
    ".\src\genesis-engine-v4-mega-pack-6-10\runtime-verifier.ts",
    ".\src\genesis-engine-v4-mega-pack-6-10\index.ts",
    ".\manifests\genesis-engine-v4-mega-pack-6-10.manifest.json"
)

$MissingFiles = @(
    $RequiredFiles | Where-Object { -not (Test-Path $_) }
)

if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\genesis-engine-v4-mega-pack-6-10.manifest.json" `
    -Raw |
ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent    = Test-Path ".\dist\genesis-engine-v4-mega-pack-6-10\contracts.js"
    modelPresent        = Test-Path ".\dist\genesis-engine-v4-mega-pack-6-10\model-generator.js"
    rendererPresent     = Test-Path ".\dist\genesis-engine-v4-mega-pack-6-10\schema-renderer.js"
    migrationPresent    = Test-Path ".\dist\genesis-engine-v4-mega-pack-6-10\migration-planner.js"
    seedPresent         = Test-Path ".\dist\genesis-engine-v4-mega-pack-6-10\seed-generator.js"
    intelligencePresent = Test-Path ".\dist\genesis-engine-v4-mega-pack-6-10\database-intelligence.js"
    orchestratorPresent = Test-Path ".\dist\genesis-engine-v4-mega-pack-6-10\orchestrator.js"
    verifierPresent     = Test-Path ".\dist\genesis-engine-v4-mega-pack-6-10\runtime-verifier.js"
    declarationPresent  = Test-Path ".\dist\genesis-engine-v4-mega-pack-6-10\orchestrator.d.ts"
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
    success        = $true
    system         = $Manifest.system
    bundle         = $Manifest.bundle
    version        = $Manifest.version
    classification = $Manifest.classification
    packs          = $Manifest.packs -join ", "
    capabilities   = $Manifest.capabilities.Count
    requiredFiles  = $RequiredFiles.Count
    compiledChecks = $Checks.Count
    healthStatus   = "healthy"
} | Format-List
