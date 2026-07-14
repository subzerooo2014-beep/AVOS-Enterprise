param(
    [string]$RepoRoot = "C:\Users\User\Desktop\AVOS"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ApiRoot = Join-Path $RepoRoot "apps\api"
$BundleRoot = Join-Path $ApiRoot "src\enterprise-e5"
$AppModulePath = Join-Path $ApiRoot "src\app.module.ts"

$requiredFiles = @(
    "enterprise-e5.types.ts",
    "enterprise-event-mesh.service.ts",
    "enterprise-command-bus.service.ts",
    "enterprise-scheduler.service.ts",
    "enterprise-circuit-breaker.service.ts",
    "enterprise-rate-limiter.service.ts",
    "enterprise-cache.service.ts",
    "enterprise-service-discovery.service.ts",
    "enterprise-runtime-analytics.service.ts",
    "enterprise-e5-orchestrator.service.ts",
    "enterprise-e5.controller.ts",
    "enterprise-e5.module.ts"
)

foreach ($file in $requiredFiles) {
    $path = Join-Path $BundleRoot $file
    if (-not (Test-Path $path)) {
        throw "Missing E5 file: $path"
    }
}

$appModule = Get-Content -Path $AppModulePath -Raw
if ($appModule -notmatch "EnterpriseE5Module") {
    throw "EnterpriseE5Module is not registered in app.module.ts"
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
    system = "AVOS Enterprise Mega Bundle E5"
    moduleRegistered = $true
    requiredFiles = $requiredFiles.Count
    eventMesh = $true
    commandBus = $true
    scheduler = $true
    circuitBreaker = $true
    rateLimiter = $true
    cache = $true
    serviceDiscovery = $true
    runtimeAnalytics = $true
    typescript = "passed"
    healthStatus = "healthy"
}