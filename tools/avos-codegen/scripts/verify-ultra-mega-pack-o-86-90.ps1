$ErrorActionPreference = "Stop"
$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\ultra-mega-pack-o\contracts.ts",
    ".\src\ultra-mega-pack-o\reality-model.ts",
    ".\src\ultra-mega-pack-o\autonomous-treaty-engine.ts",
    ".\src\ultra-mega-pack-o\civilization-planner.ts",
    ".\src\ultra-mega-pack-o\eternal-knowledge-continuum.ts",
    ".\src\ultra-mega-pack-o\omni-coordination-core.ts",
    ".\src\ultra-mega-pack-o\orchestrator-v12.ts",
    ".\src\ultra-mega-pack-o\runtime-verifier.ts",
    ".\src\ultra-mega-pack-o\index.ts",
    ".\manifests\ultra-mega-pack-o-86-90.manifest.json"
)

$MissingFiles = @($RequiredFiles | Where-Object { -not (Test-Path $_) })
if ($MissingFiles.Count -gt 0) { throw "Missing files: $($MissingFiles -join ', ')" }

$Manifest = Get-Content ".\manifests\ultra-mega-pack-o-86-90.manifest.json" -Raw | ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent    = Test-Path ".\dist\ultra-mega-pack-o\contracts.js"
    realityPresent      = Test-Path ".\dist\ultra-mega-pack-o\reality-model.js"
    treatyPresent       = Test-Path ".\dist\ultra-mega-pack-o\autonomous-treaty-engine.js"
    planningPresent     = Test-Path ".\dist\ultra-mega-pack-o\civilization-planner.js"
    knowledgePresent    = Test-Path ".\dist\ultra-mega-pack-o\eternal-knowledge-continuum.js"
    omniPresent         = Test-Path ".\dist\ultra-mega-pack-o\omni-coordination-core.js"
    orchestratorPresent = Test-Path ".\dist\ultra-mega-pack-o\orchestrator-v12.js"
    verifierPresent     = Test-Path ".\dist\ultra-mega-pack-o\runtime-verifier.js"
    declarationPresent  = Test-Path ".\dist\ultra-mega-pack-o\orchestrator-v12.d.ts"
}

$FailedChecks = @($Checks.GetEnumerator() | Where-Object { -not $_.Value } | ForEach-Object { $_.Key })
if ($FailedChecks.Count -gt 0) { throw "Build verification failed: $($FailedChecks -join ', ')" }

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
