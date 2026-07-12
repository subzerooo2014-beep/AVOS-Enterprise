$ErrorActionPreference = "Stop"
$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\ultra-mega-pack-r\contracts.ts",
    ".\src\ultra-mega-pack-r\enterprise-intent-engine.ts",
    ".\src\ultra-mega-pack-r\constitutional-synthesis.ts",
    ".\src\ultra-mega-pack-r\reality-optimization.ts",
    ".\src\ultra-mega-pack-r\immortal-knowledge-continuity.ts",
    ".\src\ultra-mega-pack-r\zenith-coordination-runtime.ts",
    ".\src\ultra-mega-pack-r\orchestrator-v15.ts",
    ".\src\ultra-mega-pack-r\runtime-verifier.ts",
    ".\src\ultra-mega-pack-r\index.ts",
    ".\manifests\ultra-mega-pack-r-101-105.manifest.json"
)

$MissingFiles = @($RequiredFiles | Where-Object { -not (Test-Path $_) })
if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\ultra-mega-pack-r-101-105.manifest.json" `
    -Raw |
ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent    = Test-Path ".\dist\ultra-mega-pack-r\contracts.js"
    intentPresent       = Test-Path ".\dist\ultra-mega-pack-r\enterprise-intent-engine.js"
    constitutionPresent = Test-Path ".\dist\ultra-mega-pack-r\constitutional-synthesis.js"
    optimizationPresent = Test-Path ".\dist\ultra-mega-pack-r\reality-optimization.js"
    knowledgePresent    = Test-Path ".\dist\ultra-mega-pack-r\immortal-knowledge-continuity.js"
    zenithPresent       = Test-Path ".\dist\ultra-mega-pack-r\zenith-coordination-runtime.js"
    orchestratorPresent = Test-Path ".\dist\ultra-mega-pack-r\orchestrator-v15.js"
    verifierPresent     = Test-Path ".\dist\ultra-mega-pack-r\runtime-verifier.js"
    declarationPresent  = Test-Path ".\dist\ultra-mega-pack-r\orchestrator-v15.d.ts"
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
