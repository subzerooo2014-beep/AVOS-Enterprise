$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\genesis-engine-v2-workspace\contracts.ts",
    ".\src\genesis-engine-v2-workspace\path-guard.ts",
    ".\src\genesis-engine-v2-workspace\hash-verifier.ts",
    ".\src\genesis-engine-v2-workspace\rollback-manifest.ts",
    ".\src\genesis-engine-v2-workspace\workspace-materializer.ts",
    ".\src\genesis-engine-v2-workspace\integrity-reporter.ts",
    ".\src\genesis-engine-v2-workspace\index.ts",
    ".\manifests\genesis-engine-v2-workspace.manifest.json"
)

$MissingFiles = @(
    $RequiredFiles |
        Where-Object { -not (Test-Path $_) }
)

if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\genesis-engine-v2-workspace.manifest.json" `
    -Raw |
ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent    = Test-Path ".\dist\genesis-engine-v2-workspace\contracts.js"
    pathGuardPresent    = Test-Path ".\dist\genesis-engine-v2-workspace\path-guard.js"
    verifierPresent     = Test-Path ".\dist\genesis-engine-v2-workspace\hash-verifier.js"
    rollbackPresent     = Test-Path ".\dist\genesis-engine-v2-workspace\rollback-manifest.js"
    materializerPresent = Test-Path ".\dist\genesis-engine-v2-workspace\workspace-materializer.js"
    reporterPresent     = Test-Path ".\dist\genesis-engine-v2-workspace\integrity-reporter.js"
    declarationPresent  = Test-Path ".\dist\genesis-engine-v2-workspace\workspace-materializer.d.ts"
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
