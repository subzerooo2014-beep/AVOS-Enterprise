$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\genesis-engine-v5-infinity-mega-pack-401-800\contracts.ts",
    ".\src\genesis-engine-v5-infinity-mega-pack-401-800\civilization-os-generator.ts",
    ".\src\genesis-engine-v5-infinity-mega-pack-401-800\economic-intelligence-generator.ts",
    ".\src\genesis-engine-v5-infinity-mega-pack-401-800\multi-world-simulation-generator.ts",
    ".\src\genesis-engine-v5-infinity-mega-pack-401-800\self-design-generator.ts",
    ".\src\genesis-engine-v5-infinity-mega-pack-401-800\agent-society-generator.ts",
    ".\src\genesis-engine-v5-infinity-mega-pack-401-800\science-infrastructure-generator.ts",
    ".\src\genesis-engine-v5-infinity-mega-pack-401-800\trust-certification-generator.ts",
    ".\src\genesis-engine-v5-infinity-mega-pack-401-800\readiness-generator.ts",
    ".\src\genesis-engine-v5-infinity-mega-pack-401-800\orchestrator.ts",
    ".\src\genesis-engine-v5-infinity-mega-pack-401-800\runtime-verifier.ts",
    ".\src\genesis-engine-v5-infinity-mega-pack-401-800\index.ts",
    ".\manifests\genesis-engine-v5-infinity-mega-pack-401-800.manifest.json"
)

$MissingFiles = @(
    $RequiredFiles | Where-Object { -not (Test-Path $_) }
)

if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\genesis-engine-v5-infinity-mega-pack-401-800.manifest.json" `
    -Raw |
ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent     = Test-Path ".\dist\genesis-engine-v5-infinity-mega-pack-401-800\contracts.js"
    civilizationPresent  = Test-Path ".\dist\genesis-engine-v5-infinity-mega-pack-401-800\civilization-os-generator.js"
    economyPresent       = Test-Path ".\dist\genesis-engine-v5-infinity-mega-pack-401-800\economic-intelligence-generator.js"
    simulationPresent    = Test-Path ".\dist\genesis-engine-v5-infinity-mega-pack-401-800\multi-world-simulation-generator.js"
    selfDesignPresent    = Test-Path ".\dist\genesis-engine-v5-infinity-mega-pack-401-800\self-design-generator.js"
    agentsPresent        = Test-Path ".\dist\genesis-engine-v5-infinity-mega-pack-401-800\agent-society-generator.js"
    sciencePresent       = Test-Path ".\dist\genesis-engine-v5-infinity-mega-pack-401-800\science-infrastructure-generator.js"
    trustPresent         = Test-Path ".\dist\genesis-engine-v5-infinity-mega-pack-401-800\trust-certification-generator.js"
    readinessPresent     = Test-Path ".\dist\genesis-engine-v5-infinity-mega-pack-401-800\readiness-generator.js"
    orchestratorPresent  = Test-Path ".\dist\genesis-engine-v5-infinity-mega-pack-401-800\orchestrator.js"
    verifierPresent      = Test-Path ".\dist\genesis-engine-v5-infinity-mega-pack-401-800\runtime-verifier.js"
    declarationPresent   = Test-Path ".\dist\genesis-engine-v5-infinity-mega-pack-401-800\orchestrator.d.ts"
}

$FailedChecks = @(
    $Checks.GetEnumerator() |
        Where-Object { -not $_.Value } |
        ForEach-Object { $_.Key }
)

if ($FailedChecks.Count -gt 0) {
    throw "Build verification failed: $($FailedChecks -join ', ')"
}

node -e "require(process.cwd() + '/dist/genesis-engine-v5-infinity-mega-pack-401-800')"

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
