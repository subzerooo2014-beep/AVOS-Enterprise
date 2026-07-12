$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\genesis-engine-v5-absolute-mega-pack-1601-3200\contracts.ts",
    ".\src\genesis-engine-v5-absolute-mega-pack-1601-3200\meta-genesis-generator.ts",
    ".\src\genesis-engine-v5-absolute-mega-pack-1601-3200\world-model-generator.ts",
    ".\src\genesis-engine-v5-absolute-mega-pack-1601-3200\federation-generator.ts",
    ".\src\genesis-engine-v5-absolute-mega-pack-1601-3200\innovation-economy-generator.ts",
    ".\src\genesis-engine-v5-absolute-mega-pack-1601-3200\law-proof-generator.ts",
    ".\src\genesis-engine-v5-absolute-mega-pack-1601-3200\simulation-memory-generator.ts",
    ".\src\genesis-engine-v5-absolute-mega-pack-1601-3200\infrastructure-science-generator.ts",
    ".\src\genesis-engine-v5-absolute-mega-pack-1601-3200\readiness-generator.ts",
    ".\src\genesis-engine-v5-absolute-mega-pack-1601-3200\orchestrator.ts",
    ".\src\genesis-engine-v5-absolute-mega-pack-1601-3200\runtime-verifier.ts",
    ".\src\genesis-engine-v5-absolute-mega-pack-1601-3200\index.ts",
    ".\manifests\genesis-engine-v5-absolute-mega-pack-1601-3200.manifest.json"
)

$MissingFiles = @(
    $RequiredFiles | Where-Object { -not (Test-Path $_) }
)

if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\genesis-engine-v5-absolute-mega-pack-1601-3200.manifest.json" `
    -Raw |
ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent      = Test-Path ".\dist\genesis-engine-v5-absolute-mega-pack-1601-3200\contracts.js"
    metaGenesisPresent    = Test-Path ".\dist\genesis-engine-v5-absolute-mega-pack-1601-3200\meta-genesis-generator.js"
    worldModelPresent     = Test-Path ".\dist\genesis-engine-v5-absolute-mega-pack-1601-3200\world-model-generator.js"
    federationPresent     = Test-Path ".\dist\genesis-engine-v5-absolute-mega-pack-1601-3200\federation-generator.js"
    innovationPresent     = Test-Path ".\dist\genesis-engine-v5-absolute-mega-pack-1601-3200\innovation-economy-generator.js"
    lawProofPresent       = Test-Path ".\dist\genesis-engine-v5-absolute-mega-pack-1601-3200\law-proof-generator.js"
    simulationPresent     = Test-Path ".\dist\genesis-engine-v5-absolute-mega-pack-1601-3200\simulation-memory-generator.js"
    infrastructurePresent = Test-Path ".\dist\genesis-engine-v5-absolute-mega-pack-1601-3200\infrastructure-science-generator.js"
    readinessPresent      = Test-Path ".\dist\genesis-engine-v5-absolute-mega-pack-1601-3200\readiness-generator.js"
    orchestratorPresent   = Test-Path ".\dist\genesis-engine-v5-absolute-mega-pack-1601-3200\orchestrator.js"
    verifierPresent       = Test-Path ".\dist\genesis-engine-v5-absolute-mega-pack-1601-3200\runtime-verifier.js"
    declarationPresent    = Test-Path ".\dist\genesis-engine-v5-absolute-mega-pack-1601-3200\orchestrator.d.ts"
}

$FailedChecks = @(
    $Checks.GetEnumerator() |
        Where-Object { -not $_.Value } |
        ForEach-Object { $_.Key }
)

if ($FailedChecks.Count -gt 0) {
    throw "Build verification failed: $($FailedChecks -join ', ')"
}

node -e "require(process.cwd() + '/dist/genesis-engine-v5-absolute-mega-pack-1601-3200')"

if ($LASTEXITCODE -ne 0) {
    throw "Compiled runtime import verification failed."
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
    compiledChecks = $Checks.Count + 1
    healthStatus   = "healthy"
} | Format-List
