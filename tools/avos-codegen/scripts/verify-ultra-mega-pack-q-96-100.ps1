$ErrorActionPreference = "Stop"
$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\ultra-mega-pack-q\contracts.ts",
    ".\src\ultra-mega-pack-q\enterprise-consciousness.ts",
    ".\src\ultra-mega-pack-q\covenant-arbitration.ts",
    ".\src\ultra-mega-pack-q\multiverse-simulation.ts",
    ".\src\ultra-mega-pack-q\perpetual-knowledge-genesis.ts",
    ".\src\ultra-mega-pack-q\apex-coordination-runtime.ts",
    ".\src\ultra-mega-pack-q\orchestrator-v14.ts",
    ".\src\ultra-mega-pack-q\runtime-verifier.ts",
    ".\src\ultra-mega-pack-q\index.ts",
    ".\manifests\ultra-mega-pack-q-96-100.manifest.json"
)

$MissingFiles = @($RequiredFiles | Where-Object { -not (Test-Path $_) })
if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\ultra-mega-pack-q-96-100.manifest.json" `
    -Raw |
ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent     = Test-Path ".\dist\ultra-mega-pack-q\contracts.js"
    consciousnessPresent = Test-Path ".\dist\ultra-mega-pack-q\enterprise-consciousness.js"
    arbitrationPresent   = Test-Path ".\dist\ultra-mega-pack-q\covenant-arbitration.js"
    multiversePresent    = Test-Path ".\dist\ultra-mega-pack-q\multiverse-simulation.js"
    knowledgePresent     = Test-Path ".\dist\ultra-mega-pack-q\perpetual-knowledge-genesis.js"
    apexPresent          = Test-Path ".\dist\ultra-mega-pack-q\apex-coordination-runtime.js"
    orchestratorPresent  = Test-Path ".\dist\ultra-mega-pack-q\orchestrator-v14.js"
    verifierPresent      = Test-Path ".\dist\ultra-mega-pack-q\runtime-verifier.js"
    declarationPresent   = Test-Path ".\dist\ultra-mega-pack-q\orchestrator-v14.d.ts"
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
