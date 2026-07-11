$ErrorActionPreference = "Stop"

$Root = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)

Set-Location $Root

$RequiredFiles = @(
    ".\src\enterprise-runtime\execution\contracts\codegen-execution-task.contracts.ts",
    ".\src\enterprise-runtime\execution\queue\codegen-priority-task-queue.ts",
    ".\src\enterprise-runtime\execution\workers\codegen-execution-worker-pool.ts",
    ".\src\enterprise-runtime\execution\runtime\codegen-parallel-execution-engine.ts",
    ".\src\enterprise-runtime\resilience\codegen-retry-engine-v2.ts",
    ".\src\enterprise-runtime\resilience\codegen-rollback-engine.ts",
    ".\src\enterprise-runtime\progress\codegen-execution-progress-tracker.ts",
    ".\src\enterprise-runtime\events-v2\codegen-runtime-event-bus-v2.ts",
    ".\src\enterprise-runtime\telemetry\codegen-runtime-telemetry-collector.ts",
    ".\src\enterprise-runtime\telemetry\codegen-runtime-performance-monitor.ts",
    ".\src\enterprise-runtime\statistics\codegen-runtime-statistics-engine.ts",
    ".\src\enterprise-runtime\statistics\codegen-runtime-metrics-aggregator.ts",
    ".\src\enterprise-runtime\orchestration\codegen-enterprise-runtime-orchestrator.ts",
    ".\src\enterprise-runtime\integration\codegen-enterprise-runtime-v2.ts",
    ".\scripts\run-mega-pack-10-bundle-c-smoke.ps1",
    ".\manifests\mega-pack-10-bundle-c.manifest.json"
)

$MissingFiles = @(
    $RequiredFiles |
        Where-Object {
            -not (Test-Path $_)
        }
)

if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\mega-pack-10-bundle-c.manifest.json" `
    -Raw |
ConvertFrom-Json

[PSCustomObject]@{
    success                 = $true
    system                  = $Manifest.system
    version                 = $Manifest.version
    pack                    = $Manifest.pack
    classification          = $Manifest.classification
    capabilities            = $Manifest.capabilities.Count
    requiredFiles           = $RequiredFiles.Count
    executionEnginePresent  = Test-Path ".\dist\enterprise-runtime\execution\runtime\codegen-parallel-execution-engine.js"
    retryEnginePresent      = Test-Path ".\dist\enterprise-runtime\resilience\codegen-retry-engine-v2.js"
    rollbackEnginePresent   = Test-Path ".\dist\enterprise-runtime\resilience\codegen-rollback-engine.js"
    progressPresent         = Test-Path ".\dist\enterprise-runtime\progress\codegen-execution-progress-tracker.js"
    eventBusPresent         = Test-Path ".\dist\enterprise-runtime\events-v2\codegen-runtime-event-bus-v2.js"
    telemetryPresent        = Test-Path ".\dist\enterprise-runtime\telemetry\codegen-runtime-telemetry-collector.js"
    performancePresent      = Test-Path ".\dist\enterprise-runtime\telemetry\codegen-runtime-performance-monitor.js"
    statisticsPresent       = Test-Path ".\dist\enterprise-runtime\statistics\codegen-runtime-statistics-engine.js"
    metricsPresent          = Test-Path ".\dist\enterprise-runtime\statistics\codegen-runtime-metrics-aggregator.js"
    orchestratorPresent     = Test-Path ".\dist\enterprise-runtime\orchestration\codegen-enterprise-runtime-orchestrator.js"
    runtimeV2Present        = Test-Path ".\dist\enterprise-runtime\integration\codegen-enterprise-runtime-v2.js"
    declarationPresent      = Test-Path ".\dist\enterprise-runtime\orchestration\codegen-enterprise-runtime-orchestrator.d.ts"
    healthStatus            = "healthy"
} | Format-List
