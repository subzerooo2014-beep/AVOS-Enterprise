$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\ultra-mega-pack-d\contracts.ts",
    ".\src\ultra-mega-pack-d\digital-constitution.ts",
    ".\src\ultra-mega-pack-d\decision-graph.ts",
    ".\src\ultra-mega-pack-d\strategic-planner.ts",
    ".\src\ultra-mega-pack-d\resilience-laboratory.ts",
    ".\src\ultra-mega-pack-d\standards-observatory.ts",
    ".\src\ultra-mega-pack-d\orchestrator.ts",
    ".\src\ultra-mega-pack-d\runtime-verifier.ts",
    ".\src\ultra-mega-pack-d\index.ts",
    ".\manifests\ultra-mega-pack-d-31-35.manifest.json"
)

$MissingFiles = @($RequiredFiles | Where-Object { -not (Test-Path $_) })
if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\ultra-mega-pack-d-31-35.manifest.json" `
    -Raw |
ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent       = Test-Path ".\dist\ultra-mega-pack-d\contracts.js"
    constitutionPresent    = Test-Path ".\dist\ultra-mega-pack-d\digital-constitution.js"
    decisionGraphPresent   = Test-Path ".\dist\ultra-mega-pack-d\decision-graph.js"
    strategicPlannerPresent= Test-Path ".\dist\ultra-mega-pack-d\strategic-planner.js"
    resilienceLabPresent   = Test-Path ".\dist\ultra-mega-pack-d\resilience-laboratory.js"
    standardsPresent       = Test-Path ".\dist\ultra-mega-pack-d\standards-observatory.js"
    orchestratorPresent    = Test-Path ".\dist\ultra-mega-pack-d\orchestrator.js"
    verifierPresent        = Test-Path ".\dist\ultra-mega-pack-d\runtime-verifier.js"
    declarationPresent     = Test-Path ".\dist\ultra-mega-pack-d\orchestrator.d.ts"
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
