$ErrorActionPreference = "Stop"
$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\genesis-engine-v2\contracts.ts",
    ".\src\genesis-engine-v2\system-intent.ts",
    ".\src\genesis-engine-v2\domain-decomposer.ts",
    ".\src\genesis-engine-v2\architecture-selector.ts",
    ".\src\genesis-engine-v2\generation-planner.ts",
    ".\src\genesis-engine-v2\genesis-orchestrator.ts",
    ".\src\genesis-engine-v2\runtime-verifier.ts",
    ".\src\genesis-engine-v2\index.ts",
    ".\manifests\genesis-engine-v2-foundation.manifest.json"
)

$MissingFiles = @($RequiredFiles | Where-Object { -not (Test-Path $_) })
if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\genesis-engine-v2-foundation.manifest.json" `
    -Raw |
ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent     = Test-Path ".\dist\genesis-engine-v2\contracts.js"
    intentPresent        = Test-Path ".\dist\genesis-engine-v2\system-intent.js"
    decompositionPresent = Test-Path ".\dist\genesis-engine-v2\domain-decomposer.js"
    architecturePresent  = Test-Path ".\dist\genesis-engine-v2\architecture-selector.js"
    planningPresent      = Test-Path ".\dist\genesis-engine-v2\generation-planner.js"
    orchestratorPresent  = Test-Path ".\dist\genesis-engine-v2\genesis-orchestrator.js"
    verifierPresent      = Test-Path ".\dist\genesis-engine-v2\runtime-verifier.js"
    declarationPresent   = Test-Path ".\dist\genesis-engine-v2\genesis-orchestrator.d.ts"
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
