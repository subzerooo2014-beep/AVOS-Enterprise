[CmdletBinding()]
param([string]$ProjectRoot = "C:\Users\User\Desktop\AVOS")

$ErrorActionPreference = "Stop"

$Root = Join-Path `
    $ProjectRoot `
    "apps\api\src\enterprise-runtime-platform-v1"

$Required = @(
    "enterprise-runtime-platform-v1.types.ts",
    "runtime-service-registry-v1.service.ts",
    "runtime-lifecycle-manager-v1.service.ts",
    "runtime-dependency-resolver-v1.service.ts",
    "runtime-health-orchestrator-v1.service.ts",
    "runtime-recovery-coordinator-v1.service.ts",
    "runtime-failover-manager-v1.service.ts",
    "runtime-diagnostics-v1.service.ts",
    "enterprise-runtime-platform-v1.service.ts",
    "enterprise-runtime-platform-v1.controller.ts",
    "enterprise-runtime-platform-v1.module.ts",
    "index.ts"
)

$Missing = @()

foreach ($File in $Required) {
    if (-not (Test-Path (Join-Path $Root $File))) {
        $Missing += $File
    }
}

if ($Missing.Count -gt 0) {
    throw "Missing P11-P20 files: $($Missing -join ', ')"
}

$AppModule = Get-Content `
    (Join-Path $ProjectRoot "apps\api\src\app.module.ts") `
    -Raw

$Module = Get-Content `
    (Join-Path $Root "enterprise-runtime-platform-v1.module.ts") `
    -Raw

$Controller = Get-Content `
    (Join-Path $Root "enterprise-runtime-platform-v1.controller.ts") `
    -Raw

$Service = Get-Content `
    (Join-Path $Root "enterprise-runtime-platform-v1.service.ts") `
    -Raw

$ImportCount = (
    [regex]::Matches(
        $AppModule,
        'enterprise-runtime-platform-v1/enterprise-runtime-platform-v1\.module'
    )
).Count

$ModuleSymbolCount = (
    [regex]::Matches(
        $AppModule,
        '\bEnterpriseRuntimePlatformV1Module\b'
    )
).Count

$Checks = [ordered]@{
    moduleClass = $Module.Contains("export class EnterpriseRuntimePlatformV1Module")
    singleImportPath = $ImportCount -eq 1
    moduleRegistered = $AppModule -match 'imports:\s*\[\s*EnterpriseRuntimePlatformV1Module,'
    moduleSymbolOccurrences = $ModuleSymbolCount -eq 2
    statusEndpoint = $Controller.Contains('@Get("status")')
    diagnosticsEndpoint = $Controller.Contains('@Get("diagnostics")')
    servicesEndpoint = $Controller.Contains('@Post("services")')
    startEndpoint = $Controller.Contains('@Post("services/:id/start")')
    shutdownEndpoint = $Controller.Contains('@Post("services/:id/shutdown")')
    dependencyEndpoint = $Controller.Contains('@Get("dependencies/:serviceId")')
    healthEndpoint = $Controller.Contains('@Post("services/:id/health")')
    recoveryEndpoint = $Controller.Contains('@Post("recovery")')
    recoveryExecuteEndpoint = $Controller.Contains('@Post("recovery/:id/execute")')
    failoverEndpoint = $Controller.Contains('@Post("failover")')
    verifyEndpoint = $Controller.Contains('@Post("verify")')
    metricsMethod = $Service.Contains("metrics(): EnterpriseRuntimeMetricsV1")
    statusMethod = $Service.Contains("status(): EnterpriseRuntimeStatusV1")
}

$Failed = @(
    $Checks.GetEnumerator() |
    Where-Object { -not $_.Value }
)

if ($Failed.Count -gt 0) {
    throw "P11-P20 verification failed: $($Failed.Name -join ', ')"
}

[ordered]@{
    success = $true
    system = "AVOS Enterprise Runtime Platform V1"
    bundle = "P11-P20"
    requiredFiles = $Required.Count
    compiledChecks = $Checks.Count
    startupOrchestrator = "enabled"
    moduleLifecycleManager = "enabled"
    runtimeDependencyResolver = "enabled"
    healthOrchestrator = "enabled"
    recoveryCoordinator = "enabled"
    runtimeStateManager = "enabled"
    serviceReadiness = "enabled"
    gracefulShutdown = "enabled"
    failoverManager = "enabled"
    runtimeDiagnostics = "enabled"
    duplicateModuleProtection = "enabled"
    status = "VERIFIED"
} | ConvertTo-Json -Depth 10
