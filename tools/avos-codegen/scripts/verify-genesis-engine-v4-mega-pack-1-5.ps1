$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\genesis-engine-v4-mega-pack-1-5\contracts.ts",
    ".\src\genesis-engine-v4-mega-pack-1-5\intent-normalizer.ts",
    ".\src\genesis-engine-v4-mega-pack-1-5\capability-discovery.ts",
    ".\src\genesis-engine-v4-mega-pack-1-5\domain-inference.ts",
    ".\src\genesis-engine-v4-mega-pack-1-5\enterprise-intelligence.ts",
    ".\src\genesis-engine-v4-mega-pack-1-5\orchestrator.ts",
    ".\src\genesis-engine-v4-mega-pack-1-5\runtime-verifier.ts",
    ".\src\genesis-engine-v4-mega-pack-1-5\index.ts",
    ".\manifests\genesis-engine-v4-mega-pack-1-5.manifest.json"
)

$MissingFiles = @(
    $RequiredFiles | Where-Object { -not (Test-Path $_) }
)

if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\genesis-engine-v4-mega-pack-1-5.manifest.json" `
    -Raw |
ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent    = Test-Path ".\dist\genesis-engine-v4-mega-pack-1-5\contracts.js"
    normalizerPresent   = Test-Path ".\dist\genesis-engine-v4-mega-pack-1-5\intent-normalizer.js"
    capabilityPresent   = Test-Path ".\dist\genesis-engine-v4-mega-pack-1-5\capability-discovery.js"
    inferencePresent    = Test-Path ".\dist\genesis-engine-v4-mega-pack-1-5\domain-inference.js"
    intelligencePresent = Test-Path ".\dist\genesis-engine-v4-mega-pack-1-5\enterprise-intelligence.js"
    orchestratorPresent = Test-Path ".\dist\genesis-engine-v4-mega-pack-1-5\orchestrator.js"
    verifierPresent     = Test-Path ".\dist\genesis-engine-v4-mega-pack-1-5\runtime-verifier.js"
    declarationPresent  = Test-Path ".\dist\genesis-engine-v4-mega-pack-1-5\orchestrator.d.ts"
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
