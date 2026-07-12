$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\genesis-engine-v5-ultra-mega-pack-21-30\contracts.ts",
    ".\src\genesis-engine-v5-ultra-mega-pack-21-30\marketplace-generator.ts",
    ".\src\genesis-engine-v5-ultra-mega-pack-21-30\financial-generator.ts",
    ".\src\genesis-engine-v5-ultra-mega-pack-21-30\analytics-generator.ts",
    ".\src\genesis-engine-v5-ultra-mega-pack-21-30\compliance-generator.ts",
    ".\src\genesis-engine-v5-ultra-mega-pack-21-30\integration-generator.ts",
    ".\src\genesis-engine-v5-ultra-mega-pack-21-30\risk-governance-generator.ts",
    ".\src\genesis-engine-v5-ultra-mega-pack-21-30\test-plan-generator.ts",
    ".\src\genesis-engine-v5-ultra-mega-pack-21-30\orchestrator.ts",
    ".\src\genesis-engine-v5-ultra-mega-pack-21-30\runtime-verifier.ts",
    ".\src\genesis-engine-v5-ultra-mega-pack-21-30\index.ts",
    ".\manifests\genesis-engine-v5-ultra-mega-pack-21-30.manifest.json"
)

$MissingFiles = @(
    $RequiredFiles | Where-Object { -not (Test-Path $_) }
)

if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\genesis-engine-v5-ultra-mega-pack-21-30.manifest.json" `
    -Raw |
ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent    = Test-Path ".\dist\genesis-engine-v5-ultra-mega-pack-21-30\contracts.js"
    marketplacePresent  = Test-Path ".\dist\genesis-engine-v5-ultra-mega-pack-21-30\marketplace-generator.js"
    financialPresent    = Test-Path ".\dist\genesis-engine-v5-ultra-mega-pack-21-30\financial-generator.js"
    analyticsPresent    = Test-Path ".\dist\genesis-engine-v5-ultra-mega-pack-21-30\analytics-generator.js"
    compliancePresent   = Test-Path ".\dist\genesis-engine-v5-ultra-mega-pack-21-30\compliance-generator.js"
    integrationPresent  = Test-Path ".\dist\genesis-engine-v5-ultra-mega-pack-21-30\integration-generator.js"
    governancePresent   = Test-Path ".\dist\genesis-engine-v5-ultra-mega-pack-21-30\risk-governance-generator.js"
    testsPresent        = Test-Path ".\dist\genesis-engine-v5-ultra-mega-pack-21-30\test-plan-generator.js"
    orchestratorPresent = Test-Path ".\dist\genesis-engine-v5-ultra-mega-pack-21-30\orchestrator.js"
    verifierPresent     = Test-Path ".\dist\genesis-engine-v5-ultra-mega-pack-21-30\runtime-verifier.js"
    declarationPresent  = Test-Path ".\dist\genesis-engine-v5-ultra-mega-pack-21-30\orchestrator.d.ts"
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
