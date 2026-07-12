$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\ultra-mega-pack-e\contracts.ts",
    ".\src\ultra-mega-pack-e\knowledge-academy.ts",
    ".\src\ultra-mega-pack-e\certification-framework.ts",
    ".\src\ultra-mega-pack-e\universal-sdk.ts",
    ".\src\ultra-mega-pack-e\enterprise-genome.ts",
    ".\src\ultra-mega-pack-e\legacy-preservation.ts",
    ".\src\ultra-mega-pack-e\evolution-orchestrator-v2.ts",
    ".\src\ultra-mega-pack-e\runtime-verifier.ts",
    ".\src\ultra-mega-pack-e\index.ts",
    ".\manifests\ultra-mega-pack-e-36-40.manifest.json"
)

$MissingFiles = @($RequiredFiles | Where-Object { -not (Test-Path $_) })
if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\ultra-mega-pack-e-36-40.manifest.json" `
    -Raw |
ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent          = Test-Path ".\dist\ultra-mega-pack-e\contracts.js"
    academyPresent            = Test-Path ".\dist\ultra-mega-pack-e\knowledge-academy.js"
    certificationPresent      = Test-Path ".\dist\ultra-mega-pack-e\certification-framework.js"
    sdkPresent                = Test-Path ".\dist\ultra-mega-pack-e\universal-sdk.js"
    genomePresent             = Test-Path ".\dist\ultra-mega-pack-e\enterprise-genome.js"
    legacyPresent             = Test-Path ".\dist\ultra-mega-pack-e\legacy-preservation.js"
    orchestratorPresent       = Test-Path ".\dist\ultra-mega-pack-e\evolution-orchestrator-v2.js"
    verifierPresent           = Test-Path ".\dist\ultra-mega-pack-e\runtime-verifier.js"
    declarationPresent        = Test-Path ".\dist\ultra-mega-pack-e\evolution-orchestrator-v2.d.ts"
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
