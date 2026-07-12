$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\genesis-engine-v4-mega-pack-11-15\contracts.ts",
    ".\src\genesis-engine-v4-mega-pack-11-15\name-utils.ts",
    ".\src\genesis-engine-v4-mega-pack-11-15\dto-generator.ts",
    ".\src\genesis-engine-v4-mega-pack-11-15\repository-generator.ts",
    ".\src\genesis-engine-v4-mega-pack-11-15\service-generator.ts",
    ".\src\genesis-engine-v4-mega-pack-11-15\controller-generator.ts",
    ".\src\genesis-engine-v4-mega-pack-11-15\module-generator.ts",
    ".\src\genesis-engine-v4-mega-pack-11-15\policy-event-generator.ts",
    ".\src\genesis-engine-v4-mega-pack-11-15\test-generator.ts",
    ".\src\genesis-engine-v4-mega-pack-11-15\orchestrator.ts",
    ".\src\genesis-engine-v4-mega-pack-11-15\runtime-verifier.ts",
    ".\src\genesis-engine-v4-mega-pack-11-15\index.ts",
    ".\manifests\genesis-engine-v4-mega-pack-11-15.manifest.json"
)

$MissingFiles = @(
    $RequiredFiles | Where-Object { -not (Test-Path $_) }
)

if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\genesis-engine-v4-mega-pack-11-15.manifest.json" `
    -Raw |
ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent    = Test-Path ".\dist\genesis-engine-v4-mega-pack-11-15\contracts.js"
    dtoPresent          = Test-Path ".\dist\genesis-engine-v4-mega-pack-11-15\dto-generator.js"
    repositoryPresent   = Test-Path ".\dist\genesis-engine-v4-mega-pack-11-15\repository-generator.js"
    servicePresent      = Test-Path ".\dist\genesis-engine-v4-mega-pack-11-15\service-generator.js"
    controllerPresent   = Test-Path ".\dist\genesis-engine-v4-mega-pack-11-15\controller-generator.js"
    modulePresent       = Test-Path ".\dist\genesis-engine-v4-mega-pack-11-15\module-generator.js"
    policyEventPresent  = Test-Path ".\dist\genesis-engine-v4-mega-pack-11-15\policy-event-generator.js"
    testPresent         = Test-Path ".\dist\genesis-engine-v4-mega-pack-11-15\test-generator.js"
    orchestratorPresent = Test-Path ".\dist\genesis-engine-v4-mega-pack-11-15\orchestrator.js"
    verifierPresent     = Test-Path ".\dist\genesis-engine-v4-mega-pack-11-15\runtime-verifier.js"
    declarationPresent  = Test-Path ".\dist\genesis-engine-v4-mega-pack-11-15\orchestrator.d.ts"
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
    packs          = $Manifest.packs -join ", "
    capabilities   = $Manifest.capabilities.Count
    requiredFiles  = $RequiredFiles.Count
    compiledChecks = $Checks.Count
    healthStatus   = "healthy"
} | Format-List
