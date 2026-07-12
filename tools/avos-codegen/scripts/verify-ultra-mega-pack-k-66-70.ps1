$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\ultra-mega-pack-k\contracts.ts",
    ".\src\ultra-mega-pack-k\autonomous-enterprise-economy.ts",
    ".\src\ultra-mega-pack-k\capability-exchange.ts",
    ".\src\ultra-mega-pack-k\self-funding-optimization.ts",
    ".\src\ultra-mega-pack-k\global-innovation-network.ts",
    ".\src\ultra-mega-pack-k\civilization-runtime.ts",
    ".\src\ultra-mega-pack-k\orchestrator-v8.ts",
    ".\src\ultra-mega-pack-k\runtime-verifier.ts",
    ".\src\ultra-mega-pack-k\index.ts",
    ".\manifests\ultra-mega-pack-k-66-70.manifest.json"
)

$MissingFiles = @($RequiredFiles | Where-Object { -not (Test-Path $_) })
if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\ultra-mega-pack-k-66-70.manifest.json" `
    -Raw |
ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent       = Test-Path ".\dist\ultra-mega-pack-k\contracts.js"
    economyPresent         = Test-Path ".\dist\ultra-mega-pack-k\autonomous-enterprise-economy.js"
    exchangePresent        = Test-Path ".\dist\ultra-mega-pack-k\capability-exchange.js"
    fundingPresent         = Test-Path ".\dist\ultra-mega-pack-k\self-funding-optimization.js"
    innovationPresent      = Test-Path ".\dist\ultra-mega-pack-k\global-innovation-network.js"
    civilizationPresent    = Test-Path ".\dist\ultra-mega-pack-k\civilization-runtime.js"
    orchestratorPresent    = Test-Path ".\dist\ultra-mega-pack-k\orchestrator-v8.js"
    verifierPresent        = Test-Path ".\dist\ultra-mega-pack-k\runtime-verifier.js"
    declarationPresent     = Test-Path ".\dist\ultra-mega-pack-k\orchestrator-v8.d.ts"
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
