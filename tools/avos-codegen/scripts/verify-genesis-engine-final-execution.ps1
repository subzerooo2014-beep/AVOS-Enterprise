$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\genesis-engine-final-execution\contracts.ts",
    ".\src\genesis-engine-final-execution\orchestrator.ts",
    ".\src\genesis-engine-final-execution\runtime-verifier.ts",
    ".\src\genesis-engine-final-execution\index.ts",
    ".\manifests\genesis-engine-final-execution.manifest.json"
)

$MissingFiles = @(
    $RequiredFiles |
        Where-Object { -not (Test-Path $_) }
)

if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\genesis-engine-final-execution.manifest.json" `
    -Raw |
ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent    = Test-Path ".\dist\genesis-engine-final-execution\contracts.js"
    orchestratorPresent = Test-Path ".\dist\genesis-engine-final-execution\orchestrator.js"
    verifierPresent     = Test-Path ".\dist\genesis-engine-final-execution\runtime-verifier.js"
    declarationPresent  = Test-Path ".\dist\genesis-engine-final-execution\orchestrator.d.ts"
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
