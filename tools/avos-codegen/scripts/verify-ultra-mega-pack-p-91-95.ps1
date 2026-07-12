$ErrorActionPreference = "Stop"
$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\ultra-mega-pack-p\contracts.ts",
    ".\src\ultra-mega-pack-p\intelligence-covenant.ts",
    ".\src\ultra-mega-pack-p\civilization-exchange.ts",
    ".\src\ultra-mega-pack-p\reality-forecasting.ts",
    ".\src\ultra-mega-pack-p\infinite-knowledge-resilience.ts",
    ".\src\ultra-mega-pack-p\transcendent-coordination-runtime.ts",
    ".\src\ultra-mega-pack-p\orchestrator-v13.ts",
    ".\src\ultra-mega-pack-p\runtime-verifier.ts",
    ".\src\ultra-mega-pack-p\index.ts",
    ".\manifests\ultra-mega-pack-p-91-95.manifest.json"
)

$MissingFiles = @($RequiredFiles | Where-Object { -not (Test-Path $_) })
if ($MissingFiles.Count -gt 0) { throw "Missing files: $($MissingFiles -join ', ')" }

$Manifest = Get-Content ".\manifests\ultra-mega-pack-p-91-95.manifest.json" -Raw | ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent     = Test-Path ".\dist\ultra-mega-pack-p\contracts.js"
    covenantPresent      = Test-Path ".\dist\ultra-mega-pack-p\intelligence-covenant.js"
    exchangePresent      = Test-Path ".\dist\ultra-mega-pack-p\civilization-exchange.js"
    forecastingPresent   = Test-Path ".\dist\ultra-mega-pack-p\reality-forecasting.js"
    knowledgePresent     = Test-Path ".\dist\ultra-mega-pack-p\infinite-knowledge-resilience.js"
    transcendentPresent  = Test-Path ".\dist\ultra-mega-pack-p\transcendent-coordination-runtime.js"
    orchestratorPresent  = Test-Path ".\dist\ultra-mega-pack-p\orchestrator-v13.js"
    verifierPresent      = Test-Path ".\dist\ultra-mega-pack-p\runtime-verifier.js"
    declarationPresent   = Test-Path ".\dist\ultra-mega-pack-p\orchestrator-v13.d.ts"
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
