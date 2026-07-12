$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\genesis-engine-v3-materialization\contracts.ts",
    ".\src\genesis-engine-v3-materialization\path-guard.ts",
    ".\src\genesis-engine-v3-materialization\integrity.ts",
    ".\src\genesis-engine-v3-materialization\materializer.ts",
    ".\src\genesis-engine-v3-materialization\readiness-reporter.ts",
    ".\src\genesis-engine-v3-materialization\index.ts",
    ".\manifests\genesis-engine-v3-materialization.manifest.json"
)

$MissingFiles = @(
    $RequiredFiles |
        Where-Object { -not (Test-Path $_) }
)

if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\genesis-engine-v3-materialization.manifest.json" `
    -Raw |
ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent    = Test-Path ".\dist\genesis-engine-v3-materialization\contracts.js"
    pathGuardPresent    = Test-Path ".\dist\genesis-engine-v3-materialization\path-guard.js"
    integrityPresent    = Test-Path ".\dist\genesis-engine-v3-materialization\integrity.js"
    materializerPresent = Test-Path ".\dist\genesis-engine-v3-materialization\materializer.js"
    verifierPresent     = Test-Path ".\dist\genesis-engine-v3-materialization\readiness-reporter.js"
    declarationPresent  = Test-Path ".\dist\genesis-engine-v3-materialization\materializer.d.ts"
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
