$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$RequiredFiles = @(
    ".\src\genesis-engine-v5-omni-mega-pack-201-400\contracts.ts",
    ".\src\genesis-engine-v5-omni-mega-pack-201-400\enterprise-os-generator.ts",
    ".\src\genesis-engine-v5-omni-mega-pack-201-400\commerce-generator.ts",
    ".\src\genesis-engine-v5-omni-mega-pack-201-400\society-infrastructure-generator.ts",
    ".\src\genesis-engine-v5-omni-mega-pack-201-400\science-generator.ts",
    ".\src\genesis-engine-v5-omni-mega-pack-201-400\legal-policy-generator.ts",
    ".\src\genesis-engine-v5-omni-mega-pack-201-400\planetary-simulation-generator.ts",
    ".\src\genesis-engine-v5-omni-mega-pack-201-400\coordination-generator.ts",
    ".\src\genesis-engine-v5-omni-mega-pack-201-400\evidence-readiness-generator.ts",
    ".\src\genesis-engine-v5-omni-mega-pack-201-400\orchestrator.ts",
    ".\src\genesis-engine-v5-omni-mega-pack-201-400\runtime-verifier.ts",
    ".\src\genesis-engine-v5-omni-mega-pack-201-400\index.ts",
    ".\manifests\genesis-engine-v5-omni-mega-pack-201-400.manifest.json"
)

$MissingFiles = @(
    $RequiredFiles | Where-Object { -not (Test-Path $_) }
)

if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\genesis-engine-v5-omni-mega-pack-201-400.manifest.json" `
    -Raw |
ConvertFrom-Json

$Checks = [ordered]@{
    contractsPresent     = Test-Path ".\dist\genesis-engine-v5-omni-mega-pack-201-400\contracts.js"
    enterpriseOsPresent  = Test-Path ".\dist\genesis-engine-v5-omni-mega-pack-201-400\enterprise-os-generator.js"
    commercePresent      = Test-Path ".\dist\genesis-engine-v5-omni-mega-pack-201-400\commerce-generator.js"
    societyPresent       = Test-Path ".\dist\genesis-engine-v5-omni-mega-pack-201-400\society-infrastructure-generator.js"
    sciencePresent       = Test-Path ".\dist\genesis-engine-v5-omni-mega-pack-201-400\science-generator.js"
    legalPresent         = Test-Path ".\dist\genesis-engine-v5-omni-mega-pack-201-400\legal-policy-generator.js"
    simulationPresent    = Test-Path ".\dist\genesis-engine-v5-omni-mega-pack-201-400\planetary-simulation-generator.js"
    coordinationPresent  = Test-Path ".\dist\genesis-engine-v5-omni-mega-pack-201-400\coordination-generator.js"
    readinessPresent     = Test-Path ".\dist\genesis-engine-v5-omni-mega-pack-201-400\evidence-readiness-generator.js"
    orchestratorPresent  = Test-Path ".\dist\genesis-engine-v5-omni-mega-pack-201-400\orchestrator.js"
    verifierPresent      = Test-Path ".\dist\genesis-engine-v5-omni-mega-pack-201-400\runtime-verifier.js"
    declarationPresent   = Test-Path ".\dist\genesis-engine-v5-omni-mega-pack-201-400\orchestrator.d.ts"
}

$FailedChecks = @(
    $Checks.GetEnumerator() |
        Where-Object { -not $_.Value } |
        ForEach-Object { $_.Key }
)

if ($FailedChecks.Count -gt 0) {
    throw "Build verification failed: $($FailedChecks -join ', ')"
}

node -e "require(process.cwd() + '/dist/genesis-engine-v5-omni-mega-pack-201-400')"

if ($LASTEXITCODE -ne 0) {
    throw "Compiled runtime import verification failed."
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
    compiledChecks = $Checks.Count + 1
    healthStatus   = "healthy"
} | Format-List
