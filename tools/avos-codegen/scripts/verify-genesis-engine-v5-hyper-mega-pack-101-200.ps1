$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\genesis-engine-v5-hyper-mega-pack-101-200\contracts.ts",
    ".\src\genesis-engine-v5-hyper-mega-pack-101-200\civilization-generator.ts",
    ".\src\genesis-engine-v5-hyper-mega-pack-101-200\economy-generator.ts",
    ".\src\genesis-engine-v5-hyper-mega-pack-101-200\knowledge-fabric-generator.ts",
    ".\src\genesis-engine-v5-hyper-mega-pack-101-200\voice-media-generator.ts",
    ".\src\genesis-engine-v5-hyper-mega-pack-101-200\edge-robotics-generator.ts",
    ".\src\genesis-engine-v5-hyper-mega-pack-101-200\quantum-ready-generator.ts",
    ".\src\genesis-engine-v5-hyper-mega-pack-101-200\trust-risk-generator.ts",
    ".\src\genesis-engine-v5-hyper-mega-pack-101-200\simulation-innovation-generator.ts",
    ".\src\genesis-engine-v5-hyper-mega-pack-101-200\readiness-generator.ts",
    ".\src\genesis-engine-v5-hyper-mega-pack-101-200\orchestrator.ts",
    ".\src\genesis-engine-v5-hyper-mega-pack-101-200\runtime-verifier.ts",
    ".\src\genesis-engine-v5-hyper-mega-pack-101-200\index.ts",
    ".\manifests\genesis-engine-v5-hyper-mega-pack-101-200.manifest.json"
)

$MissingFiles = @(
    $RequiredFiles | Where-Object { -not (Test-Path $_) }
)

if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\genesis-engine-v5-hyper-mega-pack-101-200.manifest.json" `
    -Raw |
ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent     = Test-Path ".\dist\genesis-engine-v5-hyper-mega-pack-101-200\contracts.js"
    civilizationPresent  = Test-Path ".\dist\genesis-engine-v5-hyper-mega-pack-101-200\civilization-generator.js"
    economyPresent       = Test-Path ".\dist\genesis-engine-v5-hyper-mega-pack-101-200\economy-generator.js"
    knowledgePresent     = Test-Path ".\dist\genesis-engine-v5-hyper-mega-pack-101-200\knowledge-fabric-generator.js"
    voicePresent         = Test-Path ".\dist\genesis-engine-v5-hyper-mega-pack-101-200\voice-media-generator.js"
    edgePresent          = Test-Path ".\dist\genesis-engine-v5-hyper-mega-pack-101-200\edge-robotics-generator.js"
    quantumPresent       = Test-Path ".\dist\genesis-engine-v5-hyper-mega-pack-101-200\quantum-ready-generator.js"
    trustPresent         = Test-Path ".\dist\genesis-engine-v5-hyper-mega-pack-101-200\trust-risk-generator.js"
    simulationPresent    = Test-Path ".\dist\genesis-engine-v5-hyper-mega-pack-101-200\simulation-innovation-generator.js"
    readinessPresent     = Test-Path ".\dist\genesis-engine-v5-hyper-mega-pack-101-200\readiness-generator.js"
    orchestratorPresent  = Test-Path ".\dist\genesis-engine-v5-hyper-mega-pack-101-200\orchestrator.js"
    verifierPresent      = Test-Path ".\dist\genesis-engine-v5-hyper-mega-pack-101-200\runtime-verifier.js"
    declarationPresent   = Test-Path ".\dist\genesis-engine-v5-hyper-mega-pack-101-200\orchestrator.d.ts"
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
    packs          = "$($Manifest.packs[0])-$($Manifest.packs[-1])"
    capabilities   = $Manifest.capabilities.Count
    requiredFiles  = $RequiredFiles.Count
    compiledChecks = $Checks.Count
    healthStatus   = "healthy"
} | Format-List
