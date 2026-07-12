$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\genesis-engine-v2-validation\contracts.ts",
    ".\src\genesis-engine-v2-validation\command-runner.ts",
    ".\src\genesis-engine-v2-validation\promotion-engine.ts",
    ".\src\genesis-engine-v2-validation\validation-orchestrator.ts",
    ".\src\genesis-engine-v2-validation\runtime-verifier.ts",
    ".\src\genesis-engine-v2-validation\index.ts",
    ".\manifests\genesis-engine-v2-validation.manifest.json"
)

$MissingFiles = @(
    $RequiredFiles |
        Where-Object { -not (Test-Path $_) }
)

if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\genesis-engine-v2-validation.manifest.json" `
    -Raw |
ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent    = Test-Path ".\dist\genesis-engine-v2-validation\contracts.js"
    runnerPresent       = Test-Path ".\dist\genesis-engine-v2-validation\command-runner.js"
    promotionPresent    = Test-Path ".\dist\genesis-engine-v2-validation\promotion-engine.js"
    orchestratorPresent = Test-Path ".\dist\genesis-engine-v2-validation\validation-orchestrator.js"
    verifierPresent     = Test-Path ".\dist\genesis-engine-v2-validation\runtime-verifier.js"
    declarationPresent  = Test-Path ".\dist\genesis-engine-v2-validation\validation-orchestrator.d.ts"
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
