$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\ultra-mega-pack-h\contracts.ts",
    ".\src\ultra-mega-pack-h\enterprise-command-center.ts",
    ".\src\ultra-mega-pack-h\predictive-operations.ts",
    ".\src\ultra-mega-pack-h\resource-allocation.ts",
    ".\src\ultra-mega-pack-h\strategic-agent-council.ts",
    ".\src\ultra-mega-pack-h\universal-control-plane.ts",
    ".\src\ultra-mega-pack-h\orchestrator-v5.ts",
    ".\src\ultra-mega-pack-h\runtime-verifier.ts",
    ".\src\ultra-mega-pack-h\index.ts",
    ".\manifests\ultra-mega-pack-h-51-55.manifest.json"
)

$MissingFiles = @($RequiredFiles | Where-Object { -not (Test-Path $_) })
if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\ultra-mega-pack-h-51-55.manifest.json" `
    -Raw |
ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent       = Test-Path ".\dist\ultra-mega-pack-h\contracts.js"
    commandCenterPresent   = Test-Path ".\dist\ultra-mega-pack-h\enterprise-command-center.js"
    predictivePresent      = Test-Path ".\dist\ultra-mega-pack-h\predictive-operations.js"
    resourcesPresent       = Test-Path ".\dist\ultra-mega-pack-h\resource-allocation.js"
    councilPresent         = Test-Path ".\dist\ultra-mega-pack-h\strategic-agent-council.js"
    controlPlanePresent    = Test-Path ".\dist\ultra-mega-pack-h\universal-control-plane.js"
    orchestratorPresent    = Test-Path ".\dist\ultra-mega-pack-h\orchestrator-v5.js"
    verifierPresent        = Test-Path ".\dist\ultra-mega-pack-h\runtime-verifier.js"
    declarationPresent     = Test-Path ".\dist\ultra-mega-pack-h\orchestrator-v5.d.ts"
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
