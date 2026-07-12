$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\genesis-engine-v2-cli\contracts.ts",
    ".\src\genesis-engine-v2-cli\specification-loader.ts",
    ".\src\genesis-engine-v2-cli\cli-runner.ts",
    ".\src\genesis-engine-v2-cli\cli.ts",
    ".\src\genesis-engine-v2-cli\runtime-verifier.ts",
    ".\src\genesis-engine-v2-cli\index.ts",
    ".\scripts\invoke-genesis-v2.ps1",
    ".\manifests\genesis-engine-v2-cli.manifest.json"
)

$MissingFiles = @(
    $RequiredFiles |
        Where-Object { -not (Test-Path $_) }
)

if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\genesis-engine-v2-cli.manifest.json" `
    -Raw |
ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent    = Test-Path ".\dist\genesis-engine-v2-cli\contracts.js"
    loaderPresent       = Test-Path ".\dist\genesis-engine-v2-cli\specification-loader.js"
    runnerPresent       = Test-Path ".\dist\genesis-engine-v2-cli\cli-runner.js"
    cliPresent          = Test-Path ".\dist\genesis-engine-v2-cli\cli.js"
    verifierPresent     = Test-Path ".\dist\genesis-engine-v2-cli\runtime-verifier.js"
    declarationPresent  = Test-Path ".\dist\genesis-engine-v2-cli\cli-runner.d.ts"
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
