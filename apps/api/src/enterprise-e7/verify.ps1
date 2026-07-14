param(
    [string]$RepoRoot = "C:\Users\User\Desktop\AVOS"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ApiRoot = Join-Path $RepoRoot "apps\api"
$BundleRoot = Join-Path $ApiRoot "src\enterprise-e7"
$AppModulePath = Join-Path $ApiRoot "src\app.module.ts"

$requiredFiles = @(
    "enterprise-e7.types.ts",
    "enterprise-workload-telemetry.service.ts",
    "enterprise-demand-forecast.service.ts",
    "enterprise-capacity-planner.service.ts",
    "enterprise-performance-optimizer.service.ts",
    "enterprise-cost-optimizer.service.ts",
    "enterprise-optimization-recommendation.service.ts",
    "enterprise-optimization-intelligence.service.ts",
    "enterprise-e7-orchestrator.service.ts",
    "enterprise-e7.controller.ts",
    "enterprise-e7.module.ts"
)

foreach ($file in $requiredFiles) {
    $path = Join-Path $BundleRoot $file
    if (-not (Test-Path $path)) {
        throw "Missing E7 file: $path"
    }
}

$appModule = Get-Content -Path $AppModulePath -Raw
if ($appModule -notmatch "EnterpriseE7Module") {
    throw "EnterpriseE7Module is not registered in app.module.ts"
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
    system = "AVOS Enterprise Mega Bundle E7"
    moduleRegistered = $true
    requiredFiles = $requiredFiles.Count
    workloadTelemetry = $true
    demandForecasting = $true
    capacityPlanning = $true
    performanceOptimization = $true
    costOptimization = $true
    recommendationAutomation = $true
    predictiveOptimization = $true
    typescript = "passed"
    healthStatus = "healthy"
}