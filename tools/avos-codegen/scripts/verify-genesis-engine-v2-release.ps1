$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\genesis-engine-v2-release\contracts.ts",
    ".\src\genesis-engine-v2-release\version-manager.ts",
    ".\src\genesis-engine-v2-release\release-manifest.ts",
    ".\src\genesis-engine-v2-release\registration-builder.ts",
    ".\src\genesis-engine-v2-release\release-orchestrator.ts",
    ".\src\genesis-engine-v2-release\runtime-verifier.ts",
    ".\src\genesis-engine-v2-release\index.ts",
    ".\manifests\genesis-engine-v2-release.manifest.json"
)

$MissingFiles = @(
    $RequiredFiles |
        Where-Object { -not (Test-Path $_) }
)

if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\genesis-engine-v2-release.manifest.json" `
    -Raw |
ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent     = Test-Path ".\dist\genesis-engine-v2-release\contracts.js"
    versionPresent       = Test-Path ".\dist\genesis-engine-v2-release\version-manager.js"
    manifestPresent      = Test-Path ".\dist\genesis-engine-v2-release\release-manifest.js"
    registrationPresent  = Test-Path ".\dist\genesis-engine-v2-release\registration-builder.js"
    orchestratorPresent  = Test-Path ".\dist\genesis-engine-v2-release\release-orchestrator.js"
    verifierPresent      = Test-Path ".\dist\genesis-engine-v2-release\runtime-verifier.js"
    declarationPresent   = Test-Path ".\dist\genesis-engine-v2-release\release-orchestrator.d.ts"
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
    capabilities   = $Manifest.capabilities.Count
    requiredFiles  = $RequiredFiles.Count
    compiledChecks = $Checks.Count
    healthStatus   = "healthy"
} | Format-List
