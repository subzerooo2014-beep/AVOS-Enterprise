[CmdletBinding()]
param([string]$ProjectRoot = "C:\Users\User\Desktop\AVOS")

$ErrorActionPreference = "Stop"
$Root = Join-Path $ProjectRoot "apps\api\src\enterprise-data-foundation-platform"

$Required = @(
  "enterprise-data-foundation.types.ts",
  "data-catalog.service.ts",
  "data-lineage.service.ts",
  "data-quality.service.ts",
  "etl-runtime.service.ts",
  "time-series-store.service.ts",
  "event-analytics.service.ts",
  "analytics-engine.service.ts",
  "data-governance.service.ts",
  "enterprise-data-foundation-platform.service.ts",
  "enterprise-data-foundation-platform.controller.ts",
  "enterprise-data-foundation-platform.module.ts",
  "index.ts"
)

$Missing = @()

foreach ($File in $Required) {
  if (-not (Test-Path (Join-Path $Root $File))) {
    $Missing += $File
  }
}

if ($Missing.Count -gt 0) {
  throw "Missing X1.4 files: $($Missing -join ', ')"
}

$AppModule = Get-Content (Join-Path $ProjectRoot "apps\api\src\app.module.ts") -Raw
$Catalog = Get-Content (Join-Path $Root "data-catalog.service.ts") -Raw
$Lineage = Get-Content (Join-Path $Root "data-lineage.service.ts") -Raw
$Quality = Get-Content (Join-Path $Root "data-quality.service.ts") -Raw
$Etl = Get-Content (Join-Path $Root "etl-runtime.service.ts") -Raw
$TimeSeries = Get-Content (Join-Path $Root "time-series-store.service.ts") -Raw
$Events = Get-Content (Join-Path $Root "event-analytics.service.ts") -Raw
$Analytics = Get-Content (Join-Path $Root "analytics-engine.service.ts") -Raw
$Governance = Get-Content (Join-Path $Root "data-governance.service.ts") -Raw
$Platform = Get-Content (Join-Path $Root "enterprise-data-foundation-platform.service.ts") -Raw
$Controller = Get-Content (Join-Path $Root "enterprise-data-foundation-platform.controller.ts") -Raw
$Module = Get-Content (Join-Path $Root "enterprise-data-foundation-platform.module.ts") -Raw

$ImportCount = ([regex]::Matches(
  $AppModule,
  'enterprise-data-foundation-platform/enterprise-data-foundation-platform\.module'
)).Count

$RegistrationCount = ([regex]::Matches(
  $AppModule,
  '\bEnterpriseDataFoundationPlatformModule\b'
)).Count

$Checks = [ordered]@{
  uniqueModuleClass = $Module.Contains("export class EnterpriseDataFoundationPlatformModule")
  singleImportPath = $ImportCount -eq 1
  moduleRegistered = $AppModule -match 'imports:\s*\[\s*EnterpriseDataFoundationPlatformModule,'
  registrationOccurrencesValid = $RegistrationCount -eq 2
  dataCatalog = $Catalog.Contains("private readonly assets")
  dataLineage = $Lineage.Contains("connect(")
  dataQuality = $Quality.Contains("check(")
  etlRuntime = $Etl.Contains("execute(")
  timeSeriesStore = $TimeSeries.Contains("aggregate(metric")
  eventAnalytics = $Events.Contains("ingest(")
  analyticsEngine = $Analytics.Contains("snapshot()")
  dataGovernance = $Governance.Contains("validate()")
  platformHealth = $Platform.Contains("health(): DataFoundationHealth")
  statusEndpoint = $Controller.Contains('@Get("status")')
  diagnosticsEndpoint = $Controller.Contains('@Get("diagnostics")')
  assetEndpoint = $Controller.Contains('@Post("assets")')
  lineageEndpoint = $Controller.Contains('@Post("lineage")')
  qualityEndpoint = $Controller.Contains('@Post("quality-rules")')
  pipelineEndpoint = $Controller.Contains('@Post("pipelines")')
  timeSeriesEndpoint = $Controller.Contains('@Post("time-series")')
  eventEndpoint = $Controller.Contains('@Post("events")')
  analyticsEndpoint = $Controller.Contains('@Get("analytics")')
}

$Failed = @($Checks.GetEnumerator() | Where-Object { -not $_.Value })

if ($Failed.Count -gt 0) {
  throw "X1.4 verification failed: $($Failed.Name -join ', ')"
}

[ordered]@{
  success = $true
  system = "AVOS Enterprise Data Foundation Platform"
  bundle = "X1.4"
  classification = "enterprise-data-foundation-platform"
  requiredFiles = $Required.Count
  compiledChecks = $Checks.Count
  dataCatalog = "enabled"
  dataLineage = "enabled"
  dataQuality = "enabled"
  etlRuntime = "enabled"
  analyticsEngine = "enabled"
  timeSeriesStore = "enabled"
  eventAnalytics = "enabled"
  dataGovernance = "enabled"
  duplicateModuleProtection = "enabled"
  status = "VERIFIED"
} | ConvertTo-Json -Depth 10
