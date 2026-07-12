$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\genesis-engine-v5-mega-pack-11-15\contracts.ts",
    ".\src\genesis-engine-v5-mega-pack-11-15\workflow-generator.ts",
    ".\src\genesis-engine-v5-mega-pack-11-15\agent-generator.ts",
    ".\src\genesis-engine-v5-mega-pack-11-15\tool-contract-generator.ts",
    ".\src\genesis-engine-v5-mega-pack-11-15\guardrail-generator.ts",
    ".\src\genesis-engine-v5-mega-pack-11-15\memory-observability-generator.ts",
    ".\src\genesis-engine-v5-mega-pack-11-15\test-plan-generator.ts",
    ".\src\genesis-engine-v5-mega-pack-11-15\orchestrator.ts",
    ".\src\genesis-engine-v5-mega-pack-11-15\runtime-verifier.ts",
    ".\src\genesis-engine-v5-mega-pack-11-15\index.ts",
    ".\manifests\genesis-engine-v5-mega-pack-11-15.manifest.json"
)

$MissingFiles = @(
    $RequiredFiles | Where-Object { -not (Test-Path $_) }
)

if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\genesis-engine-v5-mega-pack-11-15.manifest.json" `
    -Raw |
ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent    = Test-Path ".\dist\genesis-engine-v5-mega-pack-11-15\contracts.js"
    workflowPresent     = Test-Path ".\dist\genesis-engine-v5-mega-pack-11-15\workflow-generator.js"
    agentPresent        = Test-Path ".\dist\genesis-engine-v5-mega-pack-11-15\agent-generator.js"
    toolPresent         = Test-Path ".\dist\genesis-engine-v5-mega-pack-11-15\tool-contract-generator.js"
    guardrailPresent    = Test-Path ".\dist\genesis-engine-v5-mega-pack-11-15\guardrail-generator.js"
    memoryPresent       = Test-Path ".\dist\genesis-engine-v5-mega-pack-11-15\memory-observability-generator.js"
    testsPresent        = Test-Path ".\dist\genesis-engine-v5-mega-pack-11-15\test-plan-generator.js"
    orchestratorPresent = Test-Path ".\dist\genesis-engine-v5-mega-pack-11-15\orchestrator.js"
    verifierPresent     = Test-Path ".\dist\genesis-engine-v5-mega-pack-11-15\runtime-verifier.js"
    declarationPresent  = Test-Path ".\dist\genesis-engine-v5-mega-pack-11-15\orchestrator.d.ts"
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
