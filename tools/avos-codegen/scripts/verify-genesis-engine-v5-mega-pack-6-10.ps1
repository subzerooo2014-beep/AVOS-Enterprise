$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\genesis-engine-v5-mega-pack-6-10\contracts.ts",
    ".\src\genesis-engine-v5-mega-pack-6-10\tenant-generator.ts",
    ".\src\genesis-engine-v5-mega-pack-6-10\access-policy-generator.ts",
    ".\src\genesis-engine-v5-mega-pack-6-10\zero-trust-generator.ts",
    ".\src\genesis-engine-v5-mega-pack-6-10\policy-runtime-generator.ts",
    ".\src\genesis-engine-v5-mega-pack-6-10\security-audit-generator.ts",
    ".\src\genesis-engine-v5-mega-pack-6-10\orchestrator.ts",
    ".\src\genesis-engine-v5-mega-pack-6-10\runtime-verifier.ts",
    ".\src\genesis-engine-v5-mega-pack-6-10\index.ts",
    ".\manifests\genesis-engine-v5-mega-pack-6-10.manifest.json"
)

$MissingFiles = @(
    $RequiredFiles | Where-Object { -not (Test-Path $_) }
)

if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\genesis-engine-v5-mega-pack-6-10.manifest.json" `
    -Raw |
ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent    = Test-Path ".\dist\genesis-engine-v5-mega-pack-6-10\contracts.js"
    tenantPresent       = Test-Path ".\dist\genesis-engine-v5-mega-pack-6-10\tenant-generator.js"
    accessPresent       = Test-Path ".\dist\genesis-engine-v5-mega-pack-6-10\access-policy-generator.js"
    zeroTrustPresent    = Test-Path ".\dist\genesis-engine-v5-mega-pack-6-10\zero-trust-generator.js"
    policyPresent       = Test-Path ".\dist\genesis-engine-v5-mega-pack-6-10\policy-runtime-generator.js"
    auditPresent        = Test-Path ".\dist\genesis-engine-v5-mega-pack-6-10\security-audit-generator.js"
    orchestratorPresent = Test-Path ".\dist\genesis-engine-v5-mega-pack-6-10\orchestrator.js"
    verifierPresent     = Test-Path ".\dist\genesis-engine-v5-mega-pack-6-10\runtime-verifier.js"
    declarationPresent  = Test-Path ".\dist\genesis-engine-v5-mega-pack-6-10\orchestrator.d.ts"
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
