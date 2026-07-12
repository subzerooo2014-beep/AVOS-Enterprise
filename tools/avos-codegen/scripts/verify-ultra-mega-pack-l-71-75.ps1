$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\ultra-mega-pack-l\contracts.ts",
    ".\src\ultra-mega-pack-l\sovereignty-kernel.ts",
    ".\src\ultra-mega-pack-l\autonomous-trust-network.ts",
    ".\src\ultra-mega-pack-l\universal-value-exchange.ts",
    ".\src\ultra-mega-pack-l\civilization-knowledge-archive.ts",
    ".\src\ultra-mega-pack-l\meta-governance-runtime.ts",
    ".\src\ultra-mega-pack-l\orchestrator-v9.ts",
    ".\src\ultra-mega-pack-l\runtime-verifier.ts",
    ".\src\ultra-mega-pack-l\index.ts",
    ".\manifests\ultra-mega-pack-l-71-75.manifest.json"
)

$MissingFiles = @($RequiredFiles | Where-Object { -not (Test-Path $_) })
if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\ultra-mega-pack-l-71-75.manifest.json" `
    -Raw |
ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent       = Test-Path ".\dist\ultra-mega-pack-l\contracts.js"
    sovereigntyPresent     = Test-Path ".\dist\ultra-mega-pack-l\sovereignty-kernel.js"
    trustPresent           = Test-Path ".\dist\ultra-mega-pack-l\autonomous-trust-network.js"
    exchangePresent        = Test-Path ".\dist\ultra-mega-pack-l\universal-value-exchange.js"
    archivePresent         = Test-Path ".\dist\ultra-mega-pack-l\civilization-knowledge-archive.js"
    governancePresent      = Test-Path ".\dist\ultra-mega-pack-l\meta-governance-runtime.js"
    orchestratorPresent    = Test-Path ".\dist\ultra-mega-pack-l\orchestrator-v9.js"
    verifierPresent        = Test-Path ".\dist\ultra-mega-pack-l\runtime-verifier.js"
    declarationPresent     = Test-Path ".\dist\ultra-mega-pack-l\orchestrator-v9.d.ts"
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
