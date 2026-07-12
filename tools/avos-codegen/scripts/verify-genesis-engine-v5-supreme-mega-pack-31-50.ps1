$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\genesis-engine-v5-supreme-mega-pack-31-50\contracts.ts",
    ".\src\genesis-engine-v5-supreme-mega-pack-31-50\global-scale-generator.ts",
    ".\src\genesis-engine-v5-supreme-mega-pack-31-50\data-platform-generator.ts",
    ".\src\genesis-engine-v5-supreme-mega-pack-31-50\ai-governance-generator.ts",
    ".\src\genesis-engine-v5-supreme-mega-pack-31-50\developer-platform-generator.ts",
    ".\src\genesis-engine-v5-supreme-mega-pack-31-50\release-engineering-generator.ts",
    ".\src\genesis-engine-v5-supreme-mega-pack-31-50\resilience-generator.ts",
    ".\src\genesis-engine-v5-supreme-mega-pack-31-50\finops-generator.ts",
    ".\src\genesis-engine-v5-supreme-mega-pack-31-50\ecosystem-generator.ts",
    ".\src\genesis-engine-v5-supreme-mega-pack-31-50\test-plan-generator.ts",
    ".\src\genesis-engine-v5-supreme-mega-pack-31-50\orchestrator.ts",
    ".\src\genesis-engine-v5-supreme-mega-pack-31-50\runtime-verifier.ts",
    ".\src\genesis-engine-v5-supreme-mega-pack-31-50\index.ts",
    ".\manifests\genesis-engine-v5-supreme-mega-pack-31-50.manifest.json"
)

$MissingFiles = @(
    $RequiredFiles | Where-Object { -not (Test-Path $_) }
)

if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\genesis-engine-v5-supreme-mega-pack-31-50.manifest.json" `
    -Raw |
ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent    = Test-Path ".\dist\genesis-engine-v5-supreme-mega-pack-31-50\contracts.js"
    globalScalePresent  = Test-Path ".\dist\genesis-engine-v5-supreme-mega-pack-31-50\global-scale-generator.js"
    dataPresent         = Test-Path ".\dist\genesis-engine-v5-supreme-mega-pack-31-50\data-platform-generator.js"
    aiPresent           = Test-Path ".\dist\genesis-engine-v5-supreme-mega-pack-31-50\ai-governance-generator.js"
    developerPresent    = Test-Path ".\dist\genesis-engine-v5-supreme-mega-pack-31-50\developer-platform-generator.js"
    releasePresent      = Test-Path ".\dist\genesis-engine-v5-supreme-mega-pack-31-50\release-engineering-generator.js"
    resiliencePresent   = Test-Path ".\dist\genesis-engine-v5-supreme-mega-pack-31-50\resilience-generator.js"
    finopsPresent       = Test-Path ".\dist\genesis-engine-v5-supreme-mega-pack-31-50\finops-generator.js"
    ecosystemPresent    = Test-Path ".\dist\genesis-engine-v5-supreme-mega-pack-31-50\ecosystem-generator.js"
    testsPresent        = Test-Path ".\dist\genesis-engine-v5-supreme-mega-pack-31-50\test-plan-generator.js"
    orchestratorPresent = Test-Path ".\dist\genesis-engine-v5-supreme-mega-pack-31-50\orchestrator.js"
    verifierPresent     = Test-Path ".\dist\genesis-engine-v5-supreme-mega-pack-31-50\runtime-verifier.js"
    declarationPresent  = Test-Path ".\dist\genesis-engine-v5-supreme-mega-pack-31-50\orchestrator.d.ts"
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
