$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\genesis-engine-v5-transcendent-mega-pack-801-1600\contracts.ts",
    ".\src\genesis-engine-v5-transcendent-mega-pack-801-1600\reality-engine-generator.ts",
    ".\src\genesis-engine-v5-transcendent-mega-pack-801-1600\meta-governance-generator.ts",
    ".\src\genesis-engine-v5-transcendent-mega-pack-801-1600\recursive-genesis-generator.ts",
    ".\src\genesis-engine-v5-transcendent-mega-pack-801-1600\intelligence-mesh-generator.ts",
    ".\src\genesis-engine-v5-transcendent-mega-pack-801-1600\discovery-economy-generator.ts",
    ".\src\genesis-engine-v5-transcendent-mega-pack-801-1600\policy-compiler-generator.ts",
    ".\src\genesis-engine-v5-transcendent-mega-pack-801-1600\cross-reality-simulation-generator.ts",
    ".\src\genesis-engine-v5-transcendent-mega-pack-801-1600\self-proof-generator.ts",
    ".\src\genesis-engine-v5-transcendent-mega-pack-801-1600\memory-resilience-generator.ts",
    ".\src\genesis-engine-v5-transcendent-mega-pack-801-1600\readiness-generator.ts",
    ".\src\genesis-engine-v5-transcendent-mega-pack-801-1600\orchestrator.ts",
    ".\src\genesis-engine-v5-transcendent-mega-pack-801-1600\runtime-verifier.ts",
    ".\src\genesis-engine-v5-transcendent-mega-pack-801-1600\index.ts",
    ".\manifests\genesis-engine-v5-transcendent-mega-pack-801-1600.manifest.json"
)

$MissingFiles = @(
    $RequiredFiles | Where-Object { -not (Test-Path $_) }
)

if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\genesis-engine-v5-transcendent-mega-pack-801-1600.manifest.json" `
    -Raw |
ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent     = Test-Path ".\dist\genesis-engine-v5-transcendent-mega-pack-801-1600\contracts.js"
    realityPresent       = Test-Path ".\dist\genesis-engine-v5-transcendent-mega-pack-801-1600\reality-engine-generator.js"
    governancePresent    = Test-Path ".\dist\genesis-engine-v5-transcendent-mega-pack-801-1600\meta-governance-generator.js"
    genesisPresent       = Test-Path ".\dist\genesis-engine-v5-transcendent-mega-pack-801-1600\recursive-genesis-generator.js"
    intelligencePresent  = Test-Path ".\dist\genesis-engine-v5-transcendent-mega-pack-801-1600\intelligence-mesh-generator.js"
    discoveryPresent     = Test-Path ".\dist\genesis-engine-v5-transcendent-mega-pack-801-1600\discovery-economy-generator.js"
    policyPresent        = Test-Path ".\dist\genesis-engine-v5-transcendent-mega-pack-801-1600\policy-compiler-generator.js"
    simulationPresent    = Test-Path ".\dist\genesis-engine-v5-transcendent-mega-pack-801-1600\cross-reality-simulation-generator.js"
    proofPresent         = Test-Path ".\dist\genesis-engine-v5-transcendent-mega-pack-801-1600\self-proof-generator.js"
    memoryPresent        = Test-Path ".\dist\genesis-engine-v5-transcendent-mega-pack-801-1600\memory-resilience-generator.js"
    readinessPresent     = Test-Path ".\dist\genesis-engine-v5-transcendent-mega-pack-801-1600\readiness-generator.js"
    orchestratorPresent  = Test-Path ".\dist\genesis-engine-v5-transcendent-mega-pack-801-1600\orchestrator.js"
    verifierPresent      = Test-Path ".\dist\genesis-engine-v5-transcendent-mega-pack-801-1600\runtime-verifier.js"
    declarationPresent   = Test-Path ".\dist\genesis-engine-v5-transcendent-mega-pack-801-1600\orchestrator.d.ts"
}

$FailedChecks = @(
    $Checks.GetEnumerator() |
        Where-Object { -not $_.Value } |
        ForEach-Object { $_.Key }
)

if ($FailedChecks.Count -gt 0) {
    throw "Build verification failed: $($FailedChecks -join ', ')"
}

node -e "require(process.cwd() + '/dist/genesis-engine-v5-transcendent-mega-pack-801-1600')"

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
