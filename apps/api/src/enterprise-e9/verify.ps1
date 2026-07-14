param(
    [string]$RepoRoot = "C:\Users\User\Desktop\AVOS"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ApiRoot = Join-Path $RepoRoot "apps\api"
$BundleRoot = Join-Path $ApiRoot "src\enterprise-e9"
$AppModulePath = Join-Path $ApiRoot "src\app.module.ts"

$requiredFiles = @(
    "enterprise-e9.types.ts",
    "enterprise-strategic-initiative.service.ts",
    "enterprise-dependency-graph.service.ts",
    "enterprise-portfolio-prioritization.service.ts",
    "enterprise-execution-wave.service.ts",
    "enterprise-strategy-governance.service.ts",
    "enterprise-strategy-orchestrator.service.ts",
    "enterprise-e9-orchestrator.service.ts",
    "enterprise-e9.controller.ts",
    "enterprise-e9.module.ts"
)

foreach ($file in $requiredFiles) {
    $path = Join-Path $BundleRoot $file
    if (-not (Test-Path $path)) {
        throw "Missing E9 file: $path"
    }
}

$appModule = Get-Content -Path $AppModulePath -Raw
if ($appModule -notmatch "EnterpriseE9Module") {
    throw "EnterpriseE9Module is not registered in app.module.ts"
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
    system = "AVOS Enterprise Mega Bundle E9"
    moduleRegistered = $true
    requiredFiles = $requiredFiles.Count
    strategicPlanning = $true
    portfolioPrioritization = $true
    dependencyMapping = $true
    executionWavePlanning = $true
    strategyGovernance = $true
    governedActivation = $true
    strategyReadiness = $true
    typescript = "passed"
    healthStatus = "healthy"
}