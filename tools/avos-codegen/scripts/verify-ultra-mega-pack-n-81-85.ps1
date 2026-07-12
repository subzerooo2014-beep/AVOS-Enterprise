$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\ultra-mega-pack-n\contracts.ts",
    ".\src\ultra-mega-pack-n\universal-enterprise-identity.ts",
    ".\src\ultra-mega-pack-n\autonomous-alliance-network.ts",
    ".\src\ultra-mega-pack-n\strategic-capital-civilization.ts",
    ".\src\ultra-mega-pack-n\supreme-knowledge-continuity.ts",
    ".\src\ultra-mega-pack-n\universal-governance-nexus.ts",
    ".\src\ultra-mega-pack-n\orchestrator-v11.ts",
    ".\src\ultra-mega-pack-n\runtime-verifier.ts",
    ".\src\ultra-mega-pack-n\index.ts",
    ".\manifests\ultra-mega-pack-n-81-85.manifest.json"
)

$MissingFiles = @($RequiredFiles | Where-Object { -not (Test-Path $_) })
if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\ultra-mega-pack-n-81-85.manifest.json" `
    -Raw |
ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent       = Test-Path ".\dist\ultra-mega-pack-n\contracts.js"
    identityPresent        = Test-Path ".\dist\ultra-mega-pack-n\universal-enterprise-identity.js"
    alliancePresent        = Test-Path ".\dist\ultra-mega-pack-n\autonomous-alliance-network.js"
    capitalPresent         = Test-Path ".\dist\ultra-mega-pack-n\strategic-capital-civilization.js"
    continuityPresent      = Test-Path ".\dist\ultra-mega-pack-n\supreme-knowledge-continuity.js"
    nexusPresent           = Test-Path ".\dist\ultra-mega-pack-n\universal-governance-nexus.js"
    orchestratorPresent    = Test-Path ".\dist\ultra-mega-pack-n\orchestrator-v11.js"
    verifierPresent        = Test-Path ".\dist\ultra-mega-pack-n\runtime-verifier.js"
    declarationPresent     = Test-Path ".\dist\ultra-mega-pack-n\orchestrator-v11.d.ts"
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
