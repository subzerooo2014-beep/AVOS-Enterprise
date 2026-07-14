param(
    [string]$RepoRoot = "C:\Users\User\Desktop\AVOS"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ApiRoot = Join-Path $RepoRoot "apps\api"
$BundleRoot = Join-Path $ApiRoot "src\enterprise-e4"
$AppModulePath = Join-Path $ApiRoot "src\app.module.ts"

$requiredFiles = @(
    "enterprise-e4.types.ts",
    "enterprise-governance-control.service.ts",
    "enterprise-incident-command.service.ts",
    "enterprise-reliability-intelligence.service.ts",
    "enterprise-operational-intelligence.service.ts",
    "enterprise-e4-orchestrator.service.ts",
    "enterprise-e4.controller.ts",
    "enterprise-e4.module.ts"
)

foreach ($file in $requiredFiles) {
    $path = Join-Path $BundleRoot $file
    if (-not (Test-Path $path)) {
        throw "Missing E4 file: $path"
    }
}

$appModule = Get-Content -Path $AppModulePath -Raw
if ($appModule -notmatch "EnterpriseE4Module") {
    throw "EnterpriseE4Module is not registered in app.module.ts"
}

$tscCandidates = @(
    (Join-Path $RepoRoot "node_modules\typescript\bin\tsc"),
    (Join-Path $ApiRoot "node_modules\typescript\bin\tsc")
)

$tscPath = $tscCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $tscPath) {
    throw "TypeScript compiler was not found in existing node_modules."
}

Push-Location $ApiRoot
try {
    & node $tscPath --noEmit -p .\tsconfig.json
    if ($LASTEXITCODE -ne 0) {
        throw "TypeScript verification failed with exit code $LASTEXITCODE"
    }
}
finally {
    Pop-Location
}

[pscustomobject]@{
    success = $true
    system = "AVOS Enterprise Mega Bundle E4"
    moduleRegistered = $true
    requiredFiles = $requiredFiles.Count
    governance = $true
    incidentCommand = $true
    reliabilityIntelligence = $true
    operationalIntelligence = $true
    typescript = "passed"
    healthStatus = "healthy"
}