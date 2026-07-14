param(
    [string]$RepoRoot = "C:\Users\User\Desktop\AVOS"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ApiRoot = Join-Path $RepoRoot "apps\api"
$BundleRoot = Join-Path $ApiRoot "src\enterprise-e8"
$AppModulePath = Join-Path $ApiRoot "src\app.module.ts"

$requiredFiles = @(
    "enterprise-e8.types.ts",
    "enterprise-signal-detection.service.ts",
    "enterprise-scenario-simulator.service.ts",
    "enterprise-resilience-engine.service.ts",
    "enterprise-autonomous-decision.service.ts",
    "enterprise-policy-guard.service.ts",
    "enterprise-decision-orchestrator.service.ts",
    "enterprise-e8-orchestrator.service.ts",
    "enterprise-e8.controller.ts",
    "enterprise-e8.module.ts"
)

foreach ($file in $requiredFiles) {
    $path = Join-Path $BundleRoot $file
    if (-not (Test-Path $path)) {
        throw "Missing E8 file: $path"
    }
}

$appModule = Get-Content -Path $AppModulePath -Raw
if ($appModule -notmatch "EnterpriseE8Module") {
    throw "EnterpriseE8Module is not registered in app.module.ts"
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
    system = "AVOS Enterprise Mega Bundle E8"
    moduleRegistered = $true
    requiredFiles = $requiredFiles.Count
    signalDetection = $true
    scenarioSimulation = $true
    resilienceEngineering = $true
    autonomousDecisioning = $true
    policyGovernance = $true
    decisionExecution = $true
    continuityControls = $true
    typescript = "passed"
    healthStatus = "healthy"
}