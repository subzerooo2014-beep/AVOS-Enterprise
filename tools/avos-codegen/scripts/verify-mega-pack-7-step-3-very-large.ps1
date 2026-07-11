$ErrorActionPreference = "Stop"

$Root = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)

Set-Location $Root

$RequiredFiles = @(
    ".\src\planning\scheduling\codegen-scheduling.contracts.ts",
    ".\src\planning\policies\codegen-concurrency-policy-engine.ts",
    ".\src\planning\retry\codegen-retry-policy-engine.ts",
    ".\src\planning\barriers\codegen-stage-barrier-planner.ts",
    ".\src\planning\scheduling\codegen-artifact-priority-calculator.ts",
    ".\src\planning\parallel\codegen-parallel-group-planner.ts",
    ".\src\planning\scheduling\codegen-execution-schedule-builder.ts",
    ".\src\planning\scheduling\codegen-execution-scheduler.ts",
    ".\src\planning\metrics\codegen-schedule-metrics-engine.ts",
    ".\src\planning\serialization\codegen-execution-schedule-serializer.ts",
    ".\manifests\mega-pack-7-step-3-very-large.manifest.json"
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
    ".\manifests\mega-pack-7-step-3-very-large.manifest.json" `
    -Raw |
ConvertFrom-Json

[PSCustomObject]@{
    success                   = $true
    system                    = $Manifest.system
    version                   = $Manifest.version
    pack                      = $Manifest.pack
    classification            = $Manifest.classification
    capabilities              = $Manifest.capabilities.Count
    requiredFiles             = $RequiredFiles.Count
    contractsPresent          = Test-Path ".\dist\planning\scheduling\codegen-scheduling.contracts.js"
    concurrencyPolicyPresent  = Test-Path ".\dist\planning\policies\codegen-concurrency-policy-engine.js"
    retryPolicyPresent        = Test-Path ".\dist\planning\retry\codegen-retry-policy-engine.js"
    barrierPlannerPresent     = Test-Path ".\dist\planning\barriers\codegen-stage-barrier-planner.js"
    priorityPresent           = Test-Path ".\dist\planning\scheduling\codegen-artifact-priority-calculator.js"
    parallelPlannerPresent    = Test-Path ".\dist\planning\parallel\codegen-parallel-group-planner.js"
    scheduleBuilderPresent    = Test-Path ".\dist\planning\scheduling\codegen-execution-schedule-builder.js"
    schedulerPresent          = Test-Path ".\dist\planning\scheduling\codegen-execution-scheduler.js"
    metricsPresent            = Test-Path ".\dist\planning\metrics\codegen-schedule-metrics-engine.js"
    serializerPresent         = Test-Path ".\dist\planning\serialization\codegen-execution-schedule-serializer.js"
    declarationPresent        = Test-Path ".\dist\planning\scheduling\codegen-execution-scheduler.d.ts"
    healthStatus              = "healthy"
} | Format-List
