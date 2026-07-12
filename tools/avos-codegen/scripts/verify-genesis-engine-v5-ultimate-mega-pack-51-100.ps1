$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\genesis-engine-v5-ultimate-mega-pack-51-100\contracts.ts",
    ".\src\genesis-engine-v5-ultimate-mega-pack-51-100\digital-twin-generator.ts",
    ".\src\genesis-engine-v5-ultimate-mega-pack-51-100\strategy-generator.ts",
    ".\src\genesis-engine-v5-ultimate-mega-pack-51-100\simulation-generator.ts",
    ".\src\genesis-engine-v5-ultimate-mega-pack-51-100\governance-generator.ts",
    ".\src\genesis-engine-v5-ultimate-mega-pack-51-100\standards-legacy-generator.ts",
    ".\src\genesis-engine-v5-ultimate-mega-pack-51-100\integration-fabric-generator.ts",
    ".\src\genesis-engine-v5-ultimate-mega-pack-51-100\evolution-generator.ts",
    ".\src\genesis-engine-v5-ultimate-mega-pack-51-100\genome-academy-generator.ts",
    ".\src\genesis-engine-v5-ultimate-mega-pack-51-100\certification-generator.ts",
    ".\src\genesis-engine-v5-ultimate-mega-pack-51-100\test-plan-generator.ts",
    ".\src\genesis-engine-v5-ultimate-mega-pack-51-100\orchestrator.ts",
    ".\src\genesis-engine-v5-ultimate-mega-pack-51-100\runtime-verifier.ts",
    ".\src\genesis-engine-v5-ultimate-mega-pack-51-100\index.ts",
    ".\manifests\genesis-engine-v5-ultimate-mega-pack-51-100.manifest.json"
)

$MissingFiles = @(
    $RequiredFiles | Where-Object { -not (Test-Path $_) }
)

if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\genesis-engine-v5-ultimate-mega-pack-51-100.manifest.json" `
    -Raw |
ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent     = Test-Path ".\dist\genesis-engine-v5-ultimate-mega-pack-51-100\contracts.js"
    twinPresent          = Test-Path ".\dist\genesis-engine-v5-ultimate-mega-pack-51-100\digital-twin-generator.js"
    strategyPresent      = Test-Path ".\dist\genesis-engine-v5-ultimate-mega-pack-51-100\strategy-generator.js"
    simulationPresent    = Test-Path ".\dist\genesis-engine-v5-ultimate-mega-pack-51-100\simulation-generator.js"
    governancePresent    = Test-Path ".\dist\genesis-engine-v5-ultimate-mega-pack-51-100\governance-generator.js"
    standardsPresent     = Test-Path ".\dist\genesis-engine-v5-ultimate-mega-pack-51-100\standards-legacy-generator.js"
    integrationPresent   = Test-Path ".\dist\genesis-engine-v5-ultimate-mega-pack-51-100\integration-fabric-generator.js"
    evolutionPresent     = Test-Path ".\dist\genesis-engine-v5-ultimate-mega-pack-51-100\evolution-generator.js"
    genomePresent        = Test-Path ".\dist\genesis-engine-v5-ultimate-mega-pack-51-100\genome-academy-generator.js"
    certificationPresent = Test-Path ".\dist\genesis-engine-v5-ultimate-mega-pack-51-100\certification-generator.js"
    testsPresent         = Test-Path ".\dist\genesis-engine-v5-ultimate-mega-pack-51-100\test-plan-generator.js"
    orchestratorPresent  = Test-Path ".\dist\genesis-engine-v5-ultimate-mega-pack-51-100\orchestrator.js"
    verifierPresent      = Test-Path ".\dist\genesis-engine-v5-ultimate-mega-pack-51-100\runtime-verifier.js"
    declarationPresent   = Test-Path ".\dist\genesis-engine-v5-ultimate-mega-pack-51-100\orchestrator.d.ts"
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
    packs          = "$($Manifest.packs[0])-$($Manifest.packs[-1])"
    capabilities   = $Manifest.capabilities.Count
    requiredFiles  = $RequiredFiles.Count
    compiledChecks = $Checks.Count
    healthStatus   = "healthy"
} | Format-List
