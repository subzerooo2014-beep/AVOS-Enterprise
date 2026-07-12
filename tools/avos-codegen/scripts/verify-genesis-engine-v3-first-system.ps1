$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\genesis-engine-v3-first-system\contracts.ts",
    ".\src\genesis-engine-v3-first-system\name-utils.ts",
    ".\src\genesis-engine-v3-first-system\artifact-factory.ts",
    ".\src\genesis-engine-v3-first-system\backend-generator.ts",
    ".\src\genesis-engine-v3-first-system\prisma-generator.ts",
    ".\src\genesis-engine-v3-first-system\frontend-generator.ts",
    ".\src\genesis-engine-v3-first-system\platform-generator.ts",
    ".\src\genesis-engine-v3-first-system\orchestrator.ts",
    ".\src\genesis-engine-v3-first-system\runtime-verifier.ts",
    ".\src\genesis-engine-v3-first-system\index.ts",
    ".\manifests\genesis-engine-v3-first-system.manifest.json"
)

$MissingFiles = @(
    $RequiredFiles |
        Where-Object { -not (Test-Path $_) }
)

if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\genesis-engine-v3-first-system.manifest.json" `
    -Raw |
ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent    = Test-Path ".\dist\genesis-engine-v3-first-system\contracts.js"
    backendPresent      = Test-Path ".\dist\genesis-engine-v3-first-system\backend-generator.js"
    prismaPresent       = Test-Path ".\dist\genesis-engine-v3-first-system\prisma-generator.js"
    frontendPresent     = Test-Path ".\dist\genesis-engine-v3-first-system\frontend-generator.js"
    platformPresent     = Test-Path ".\dist\genesis-engine-v3-first-system\platform-generator.js"
    orchestratorPresent = Test-Path ".\dist\genesis-engine-v3-first-system\orchestrator.js"
    verifierPresent     = Test-Path ".\dist\genesis-engine-v3-first-system\runtime-verifier.js"
    declarationPresent  = Test-Path ".\dist\genesis-engine-v3-first-system\orchestrator.d.ts"
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
