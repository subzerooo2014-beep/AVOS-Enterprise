$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\genesis-engine-v4-mega-pack-16-20\contracts.ts",
    ".\src\genesis-engine-v4-mega-pack-16-20\name-utils.ts",
    ".\src\genesis-engine-v4-mega-pack-16-20\api-client-generator.ts",
    ".\src\genesis-engine-v4-mega-pack-16-20\form-generator.ts",
    ".\src\genesis-engine-v4-mega-pack-16-20\table-generator.ts",
    ".\src\genesis-engine-v4-mega-pack-16-20\page-generator.ts",
    ".\src\genesis-engine-v4-mega-pack-16-20\shell-generator.ts",
    ".\src\genesis-engine-v4-mega-pack-16-20\rbac-generator.ts",
    ".\src\genesis-engine-v4-mega-pack-16-20\test-generator.ts",
    ".\src\genesis-engine-v4-mega-pack-16-20\orchestrator.ts",
    ".\src\genesis-engine-v4-mega-pack-16-20\runtime-verifier.ts",
    ".\src\genesis-engine-v4-mega-pack-16-20\index.ts",
    ".\manifests\genesis-engine-v4-mega-pack-16-20.manifest.json"
)

$MissingFiles = @(
    $RequiredFiles | Where-Object { -not (Test-Path $_) }
)

if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\genesis-engine-v4-mega-pack-16-20.manifest.json" `
    -Raw |
ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent    = Test-Path ".\dist\genesis-engine-v4-mega-pack-16-20\contracts.js"
    apiClientPresent    = Test-Path ".\dist\genesis-engine-v4-mega-pack-16-20\api-client-generator.js"
    formPresent         = Test-Path ".\dist\genesis-engine-v4-mega-pack-16-20\form-generator.js"
    tablePresent        = Test-Path ".\dist\genesis-engine-v4-mega-pack-16-20\table-generator.js"
    pagePresent         = Test-Path ".\dist\genesis-engine-v4-mega-pack-16-20\page-generator.js"
    shellPresent        = Test-Path ".\dist\genesis-engine-v4-mega-pack-16-20\shell-generator.js"
    rbacPresent         = Test-Path ".\dist\genesis-engine-v4-mega-pack-16-20\rbac-generator.js"
    testPresent         = Test-Path ".\dist\genesis-engine-v4-mega-pack-16-20\test-generator.js"
    orchestratorPresent = Test-Path ".\dist\genesis-engine-v4-mega-pack-16-20\orchestrator.js"
    verifierPresent     = Test-Path ".\dist\genesis-engine-v4-mega-pack-16-20\runtime-verifier.js"
    declarationPresent  = Test-Path ".\dist\genesis-engine-v4-mega-pack-16-20\orchestrator.d.ts"
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
