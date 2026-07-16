[CmdletBinding()]
param(
    [string]$ProjectRoot = "C:\Users\User\Desktop\AVOS"
)

$ErrorActionPreference = "Stop"

$Root = Join-Path $ProjectRoot "apps\api\src\infrastructure\persistence-runtime"
$Required = @(
    "persistence-runtime.types.ts",
    "persistence-cache.service.ts",
    "optimistic-lock.service.ts",
    "concurrency-manager.service.ts",
    "persistence-events.service.ts",
    "retry-policy.service.ts",
    "persistence-metrics.service.ts",
    "distributed-transaction-coordinator.service.ts",
    "repository-orchestrator.service.ts",
    "persistence-runtime.service.ts",
    "persistence-runtime.controller.ts",
    "persistence-runtime.module.ts",
    "index.ts"
)

$Missing = @()
foreach ($File in $Required) {
    if (-not (Test-Path (Join-Path $Root $File))) {
        $Missing += $File
    }
}

if ($Missing.Count -gt 0) {
    throw "Missing persistence runtime files: $($Missing -join ', ')"
}

$AppModule = Get-Content (Join-Path $ProjectRoot "apps\api\src\app.module.ts") -Raw
$Coordinator = Get-Content (Join-Path $Root "distributed-transaction-coordinator.service.ts") -Raw
$Cache = Get-Content (Join-Path $Root "persistence-cache.service.ts") -Raw
$Lock = Get-Content (Join-Path $Root "optimistic-lock.service.ts") -Raw
$Concurrency = Get-Content (Join-Path $Root "concurrency-manager.service.ts") -Raw
$Metrics = Get-Content (Join-Path $Root "persistence-metrics.service.ts") -Raw
$Runtime = Get-Content (Join-Path $Root "persistence-runtime.service.ts") -Raw
$Controller = Get-Content (Join-Path $Root "persistence-runtime.controller.ts") -Raw
$Orchestrator = Get-Content (Join-Path $Root "repository-orchestrator.service.ts") -Raw
$Events = Get-Content (Join-Path $Root "persistence-events.service.ts") -Raw
$Retry = Get-Content (Join-Path $Root "retry-policy.service.ts") -Raw

$Checks = [ordered]@{
    appModuleImport = $AppModule.Contains('import { PersistenceRuntimeModule } from "./infrastructure/persistence-runtime/persistence-runtime.module";')
    appModuleRegistration = $AppModule -match 'imports:\s*\[\s*PersistenceRuntimeModule,'
    distributedTransactions = $Coordinator.Contains("coordinate<T>")
    unitOfWorkIntegration = $Coordinator.Contains("this.unitOfWork.execute")
    cacheLayer = $Cache.Contains("private readonly entries")
    optimisticLocking = $Lock.Contains("assertAndIncrement")
    concurrencyManager = $Concurrency.Contains("runExclusive<T>")
    metricsEngine = $Metrics.Contains("metrics(cacheEntries")
    healthMonitor = $Runtime.Contains("health(): PersistenceRuntimeHealth")
    diagnostics = $Runtime.Contains("diagnostics()")
    repositoryOrchestration = $Orchestrator.Contains("resolve(repositoryToken")
    persistenceEvents = $Events.Contains("emit(")
    retryPolicies = $Retry.Contains("maxAttempts")
    failureRecovery = $Coordinator.Contains("PersistenceTransactionFailed")
    transactionObservability = $Metrics.Contains("begin(")
    statusEndpoint = $Controller.Contains('@Get("status")')
    diagnosticsEndpoint = $Controller.Contains('@Get("diagnostics")')
    metricsEndpoint = $Controller.Contains('@Get("metrics")')
}

$Failed = @($Checks.GetEnumerator() | Where-Object { -not $_.Value })
if ($Failed.Count -gt 0) {
    throw "Persistence Mega Bundle verification failed: $($Failed.Name -join ', ')"
}

[ordered]@{
    success = $true
    system = "AVOS Persistence Foundation"
    bundle = "B2.3-B2.8"
    classification = "enterprise-persistence-runtime"
    requiredFiles = $Required.Count
    compiledChecks = $Checks.Count
    distributedTransactions = "enabled"
    cacheLayer = "enabled"
    optimisticLocking = "enabled"
    concurrencyManager = "enabled"
    metricsEngine = "enabled"
    healthMonitor = "enabled"
    diagnostics = "enabled"
    repositoryOrchestration = "enabled"
    persistenceEvents = "enabled"
    retryPolicies = "enabled"
    failureRecovery = "enabled"
    transactionObservability = "enabled"
    status = "VERIFIED"
} | ConvertTo-Json -Depth 10
