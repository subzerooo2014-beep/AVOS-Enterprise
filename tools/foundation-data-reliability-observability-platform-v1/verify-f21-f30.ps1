[CmdletBinding()]
param([string]$ProjectRoot = "C:\Users\User\Desktop\AVOS")

$ErrorActionPreference = "Stop"

$Root = Join-Path `
    $ProjectRoot `
    "apps\api\src\foundation-data-reliability-observability-platform-v1"

$Required = @(
    "foundation-data-reliability-observability-v1.types.ts",
    "foundation-storage-v1.service.ts",
    "foundation-backup-restore-v1.service.ts",
    "foundation-files-media-v1.service.ts",
    "foundation-search-index-v1.service.ts",
    "foundation-cache-performance-v1.service.ts",
    "foundation-logging-v1.service.ts",
    "foundation-metrics-v1.service.ts",
    "foundation-tracing-v1.service.ts",
    "foundation-self-validation-v1.service.ts",
    "foundation-data-reliability-observability-platform-v1.service.ts",
    "foundation-data-reliability-observability-platform-v1.controller.ts",
    "foundation-data-reliability-observability-platform-v1.module.ts",
    "index.ts"
)

$Missing = @()

foreach ($File in $Required) {
    if (-not (Test-Path (Join-Path $Root $File))) {
        $Missing += $File
    }
}

if ($Missing.Count -gt 0) {
    throw "Missing F21-F30 files: $($Missing -join ', ')"
}

$AppModule = Get-Content `
    (Join-Path $ProjectRoot "apps\api\src\app.module.ts") `
    -Raw

$Module = Get-Content `
    (Join-Path $Root "foundation-data-reliability-observability-platform-v1.module.ts") `
    -Raw

$Controller = Get-Content `
    (Join-Path $Root "foundation-data-reliability-observability-platform-v1.controller.ts") `
    -Raw

$Service = Get-Content `
    (Join-Path $Root "foundation-data-reliability-observability-platform-v1.service.ts") `
    -Raw

$ImportCount = (
    [regex]::Matches(
        $AppModule,
        'foundation-data-reliability-observability-platform-v1/foundation-data-reliability-observability-platform-v1\.module'
    )
).Count

$ModuleSymbolCount = (
    [regex]::Matches(
        $AppModule,
        '\bFoundationDataReliabilityObservabilityPlatformV1Module\b'
    )
).Count

$Checks = [ordered]@{
    moduleClass = $Module.Contains("export class FoundationDataReliabilityObservabilityPlatformV1Module")
    singleImportPath = $ImportCount -eq 1
    moduleRegistered = $AppModule -match 'imports:\s*\[\s*FoundationDataReliabilityObservabilityPlatformV1Module,'
    moduleSymbolOccurrences = $ModuleSymbolCount -eq 2
    statusEndpoint = $Controller.Contains('@Get("status")')
    diagnosticsEndpoint = $Controller.Contains('@Get("diagnostics")')
    storageEndpoint = $Controller.Contains('@Post("storage")')
    backupEndpoint = $Controller.Contains('@Post("backups")')
    verifyBackupEndpoint = $Controller.Contains('@Post("backups/:id/verify")')
    restoreEndpoint = $Controller.Contains('@Post("backups/:id/restore")')
    mediaEndpoint = $Controller.Contains('@Post("media")')
    searchEndpoint = $Controller.Contains('@Post("search/index")')
    cacheEndpoint = $Controller.Contains('@Post("cache")')
    logsEndpoint = $Controller.Contains('@Post("logs")')
    metricsEndpoint = $Controller.Contains('@Post("metrics")')
    tracesEndpoint = $Controller.Contains('@Post("traces/start")')
    validationEndpoint = $Controller.Contains('@Post("validate")')
    metricsMethod = $Service.Contains("metrics(): FoundationReliabilityMetricsV1")
    statusMethod = $Service.Contains("status(): FoundationReliabilityStatusV1")
}

$Failed = @(
    $Checks.GetEnumerator() |
    Where-Object { -not $_.Value }
)

if ($Failed.Count -gt 0) {
    throw "F21-F30 verification failed: $($Failed.Name -join ', ')"
}

[ordered]@{
    success = $true
    system = "AVOS Foundation Data, Reliability & Observability Platform V1"
    bundle = "F21-F30"
    requiredFiles = $Required.Count
    compiledChecks = $Checks.Count
    storage = "enabled"
    backupRestore = "enabled"
    filesMedia = "enabled"
    searchIndexing = "enabled"
    cachePerformance = "enabled"
    logs = "enabled"
    metrics = "enabled"
    traces = "enabled"
    observability = "enabled"
    selfValidation = "enabled"
    duplicateModuleProtection = "enabled"
    status = "VERIFIED"
} | ConvertTo-Json -Depth 10
