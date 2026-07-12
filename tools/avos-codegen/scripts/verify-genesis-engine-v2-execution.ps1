$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\genesis-engine-v2-execution\contracts.ts",
    ".\src\genesis-engine-v2-execution\name-utils.ts",
    ".\src\genesis-engine-v2-execution\artifact-factory.ts",
    ".\src\genesis-engine-v2-execution\module-generator.ts",
    ".\src\genesis-engine-v2-execution\system-generator.ts",
    ".\src\genesis-engine-v2-execution\workspace-writer.ts",
    ".\src\genesis-engine-v2-execution\execution-orchestrator.ts",
    ".\src\genesis-engine-v2-execution\runtime-verifier.ts",
    ".\src\genesis-engine-v2-execution\index.ts",
    ".\manifests\genesis-engine-v2-execution.manifest.json"
)

$MissingFiles = @($RequiredFiles | Where-Object { -not (Test-Path $_) })

if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\genesis-engine-v2-execution.manifest.json" `
    -Raw |
ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent     = Test-Path ".\dist\genesis-engine-v2-execution\contracts.js"
    utilitiesPresent     = Test-Path ".\dist\genesis-engine-v2-execution\name-utils.js"
    factoryPresent       = Test-Path ".\dist\genesis-engine-v2-execution\artifact-factory.js"
    modulePresent        = Test-Path ".\dist\genesis-engine-v2-execution\module-generator.js"
    systemPresent        = Test-Path ".\dist\genesis-engine-v2-execution\system-generator.js"
    writerPresent        = Test-Path ".\dist\genesis-engine-v2-execution\workspace-writer.js"
    orchestratorPresent  = Test-Path ".\dist\genesis-engine-v2-execution\execution-orchestrator.js"
    verifierPresent      = Test-Path ".\dist\genesis-engine-v2-execution\runtime-verifier.js"
    declarationPresent   = Test-Path ".\dist\genesis-engine-v2-execution\execution-orchestrator.d.ts"
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
