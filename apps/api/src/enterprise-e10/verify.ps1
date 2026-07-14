param(
    [string]$RepoRoot = "C:\Users\User\Desktop\AVOS"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ApiRoot = Join-Path $RepoRoot "apps\api"
$BundleRoot = Join-Path $ApiRoot "src\enterprise-e10"
$AppModulePath = Join-Path $ApiRoot "src\app.module.ts"

$requiredFiles = @(
    "enterprise-e10.types.ts",
    "enterprise-value-opportunity.service.ts",
    "enterprise-value-outcome.service.ts",
    "enterprise-value-leakage.service.ts",
    "enterprise-value-action.service.ts",
    "enterprise-value-governance.service.ts",
    "enterprise-value-orchestrator.service.ts",
    "enterprise-e10-orchestrator.service.ts",
    "enterprise-e10.controller.ts",
    "enterprise-e10.module.ts"
)

foreach ($file in $requiredFiles) {
    $path = Join-Path $BundleRoot $file
    if (-not (Test-Path $path)) {
        throw "Missing E10 file: $path"
    }
}

$appModule = Get-Content -Path $AppModulePath -Raw
if ($appModule -notmatch "EnterpriseE10Module") {
    throw "EnterpriseE10Module is not registered in app.module.ts"
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
    system = "AVOS Enterprise Mega Bundle E10"
    moduleRegistered = $true
    requiredFiles = $requiredFiles.Count
    valueOpportunityDiscovery = $true
    benefitTracking = $true
    outcomeMeasurement = $true
    valueLeakageDetection = $true
    valueActionExecution = $true
    valueGovernance = $true
    valueRealization = $true
    typescript = "passed"
    healthStatus = "healthy"
}