$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\ultra-mega-pack-m\contracts.ts",
    ".\src\ultra-mega-pack-m\autonomy-constitution.ts",
    ".\src\ultra-mega-pack-m\global-trust-fabric.ts",
    ".\src\ultra-mega-pack-m\treasury-intelligence.ts",
    ".\src\ultra-mega-pack-m\civilization-evolution-archive.ts",
    ".\src\ultra-mega-pack-m\supreme-coordination-runtime.ts",
    ".\src\ultra-mega-pack-m\orchestrator-v10.ts",
    ".\src\ultra-mega-pack-m\runtime-verifier.ts",
    ".\src\ultra-mega-pack-m\index.ts",
    ".\manifests\ultra-mega-pack-m-76-80.manifest.json"
)

$MissingFiles = @($RequiredFiles | Where-Object { -not (Test-Path $_) })
if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\ultra-mega-pack-m-76-80.manifest.json" `
    -Raw |
ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent       = Test-Path ".\dist\ultra-mega-pack-m\contracts.js"
    autonomyPresent        = Test-Path ".\dist\ultra-mega-pack-m\autonomy-constitution.js"
    trustPresent           = Test-Path ".\dist\ultra-mega-pack-m\global-trust-fabric.js"
    treasuryPresent        = Test-Path ".\dist\ultra-mega-pack-m\treasury-intelligence.js"
    archivePresent         = Test-Path ".\dist\ultra-mega-pack-m\civilization-evolution-archive.js"
    supremePresent         = Test-Path ".\dist\ultra-mega-pack-m\supreme-coordination-runtime.js"
    orchestratorPresent    = Test-Path ".\dist\ultra-mega-pack-m\orchestrator-v10.js"
    verifierPresent        = Test-Path ".\dist\ultra-mega-pack-m\runtime-verifier.js"
    declarationPresent     = Test-Path ".\dist\ultra-mega-pack-m\orchestrator-v10.d.ts"
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
