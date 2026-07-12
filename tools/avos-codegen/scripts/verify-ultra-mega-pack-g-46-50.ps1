$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\ultra-mega-pack-g\contracts.ts",
    ".\src\ultra-mega-pack-g\autonomous-operations.ts",
    ".\src\ultra-mega-pack-g\self-healing-runtime.ts",
    ".\src\ultra-mega-pack-g\enterprise-simulation.ts",
    ".\src\ultra-mega-pack-g\multi-agent-coordination.ts",
    ".\src\ultra-mega-pack-g\continuous-innovation.ts",
    ".\src\ultra-mega-pack-g\orchestrator-v4.ts",
    ".\src\ultra-mega-pack-g\runtime-verifier.ts",
    ".\src\ultra-mega-pack-g\index.ts",
    ".\manifests\ultra-mega-pack-g-46-50.manifest.json"
)

$MissingFiles = @($RequiredFiles | Where-Object { -not (Test-Path $_) })
if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\ultra-mega-pack-g-46-50.manifest.json" `
    -Raw |
ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent       = Test-Path ".\dist\ultra-mega-pack-g\contracts.js"
    operationsPresent      = Test-Path ".\dist\ultra-mega-pack-g\autonomous-operations.js"
    healingPresent         = Test-Path ".\dist\ultra-mega-pack-g\self-healing-runtime.js"
    simulationPresent      = Test-Path ".\dist\ultra-mega-pack-g\enterprise-simulation.js"
    coordinationPresent    = Test-Path ".\dist\ultra-mega-pack-g\multi-agent-coordination.js"
    innovationPresent      = Test-Path ".\dist\ultra-mega-pack-g\continuous-innovation.js"
    orchestratorPresent    = Test-Path ".\dist\ultra-mega-pack-g\orchestrator-v4.js"
    verifierPresent        = Test-Path ".\dist\ultra-mega-pack-g\runtime-verifier.js"
    declarationPresent     = Test-Path ".\dist\ultra-mega-pack-g\orchestrator-v4.d.ts"
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
    success          = $true
    system           = $Manifest.system
    bundle           = $Manifest.bundle
    version          = $Manifest.version
    classification   = $Manifest.classification
    packs            = $Manifest.packs -join ", "
    capabilities     = $Manifest.capabilities.Count
    requiredFiles    = $RequiredFiles.Count
    compiledChecks   = $Checks.Count
    healthStatus     = "healthy"
} | Format-List
