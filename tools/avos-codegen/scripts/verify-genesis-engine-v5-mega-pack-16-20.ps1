$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\genesis-engine-v5-mega-pack-16-20\contracts.ts",
    ".\src\genesis-engine-v5-mega-pack-16-20\slo-generator.ts",
    ".\src\genesis-engine-v5-mega-pack-16-20\incident-generator.ts",
    ".\src\genesis-engine-v5-mega-pack-16-20\runbook-generator.ts",
    ".\src\genesis-engine-v5-mega-pack-16-20\remediation-generator.ts",
    ".\src\genesis-engine-v5-mega-pack-16-20\resilience-generator.ts",
    ".\src\genesis-engine-v5-mega-pack-16-20\operations-evidence-generator.ts",
    ".\src\genesis-engine-v5-mega-pack-16-20\orchestrator.ts",
    ".\src\genesis-engine-v5-mega-pack-16-20\runtime-verifier.ts",
    ".\src\genesis-engine-v5-mega-pack-16-20\index.ts",
    ".\manifests\genesis-engine-v5-mega-pack-16-20.manifest.json"
)

$MissingFiles = @(
    $RequiredFiles | Where-Object { -not (Test-Path $_) }
)

if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\genesis-engine-v5-mega-pack-16-20.manifest.json" `
    -Raw |
ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent    = Test-Path ".\dist\genesis-engine-v5-mega-pack-16-20\contracts.js"
    sloPresent          = Test-Path ".\dist\genesis-engine-v5-mega-pack-16-20\slo-generator.js"
    incidentPresent     = Test-Path ".\dist\genesis-engine-v5-mega-pack-16-20\incident-generator.js"
    runbookPresent      = Test-Path ".\dist\genesis-engine-v5-mega-pack-16-20\runbook-generator.js"
    remediationPresent  = Test-Path ".\dist\genesis-engine-v5-mega-pack-16-20\remediation-generator.js"
    resiliencePresent   = Test-Path ".\dist\genesis-engine-v5-mega-pack-16-20\resilience-generator.js"
    evidencePresent     = Test-Path ".\dist\genesis-engine-v5-mega-pack-16-20\operations-evidence-generator.js"
    orchestratorPresent = Test-Path ".\dist\genesis-engine-v5-mega-pack-16-20\orchestrator.js"
    verifierPresent     = Test-Path ".\dist\genesis-engine-v5-mega-pack-16-20\runtime-verifier.js"
    declarationPresent  = Test-Path ".\dist\genesis-engine-v5-mega-pack-16-20\orchestrator.d.ts"
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
