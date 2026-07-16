[CmdletBinding()]
param([string]$ProjectRoot = "C:\Users\User\Desktop\AVOS")

$ErrorActionPreference = "Stop"
$Root = Join-Path $ProjectRoot "apps\api\src\enterprise-reliability-observability-core"

$Required = @(
  "reliability-observability.types.ts",
  "service-health-registry.service.ts",
  "metrics-registry.service.ts",
  "structured-logging.service.ts",
  "distributed-tracing.service.ts",
  "alert-manager.service.ts",
  "incident-manager.service.ts",
  "monitoring-dashboard.service.ts",
  "enterprise-reliability-observability.controller.ts",
  "enterprise-reliability-observability.module.ts",
  "index.ts"
)

$Missing = @()

foreach ($File in $Required) {
  if (-not (Test-Path (Join-Path $Root $File))) {
    $Missing += $File
  }
}

if ($Missing.Count -gt 0) {
  throw "Missing X1.1 files: $($Missing -join ', ')"
}

$AppModule = Get-Content (Join-Path $ProjectRoot "apps\api\src\app.module.ts") -Raw
$Health = Get-Content (Join-Path $Root "service-health-registry.service.ts") -Raw
$Metrics = Get-Content (Join-Path $Root "metrics-registry.service.ts") -Raw
$Logging = Get-Content (Join-Path $Root "structured-logging.service.ts") -Raw
$Tracing = Get-Content (Join-Path $Root "distributed-tracing.service.ts") -Raw
$Alerts = Get-Content (Join-Path $Root "alert-manager.service.ts") -Raw
$Incidents = Get-Content (Join-Path $Root "incident-manager.service.ts") -Raw
$Dashboard = Get-Content (Join-Path $Root "monitoring-dashboard.service.ts") -Raw
$Controller = Get-Content (Join-Path $Root "enterprise-reliability-observability.controller.ts") -Raw

$Checks = [ordered]@{
  appModuleImport = $AppModule.Contains('import { EnterpriseReliabilityObservabilityModule } from "./enterprise-reliability-observability-core/enterprise-reliability-observability.module";')
  appModuleRegistration = $AppModule -match 'imports:\s*\[\s*EnterpriseReliabilityObservabilityModule,'
  serviceHealthRegistry = $Health.Contains("private readonly records")
  healthDashboard = $Dashboard.Contains("health(): ReliabilityObservabilityHealth")
  metricsRegistry = $Metrics.Contains("record(")
  metricsAggregator = $Metrics.Contains("aggregate(name")
  structuredLogging = $Logging.Contains("write(")
  logCorrelation = $Logging.Contains("byCorrelationId")
  distributedTracing = $Tracing.Contains("start(") -and $Tracing.Contains("complete(")
  traceContext = $Tracing.Contains("traceId")
  alertManager = $Alerts.Contains("evaluate(metric")
  alertRules = $Alerts.Contains("registerRule")
  incidentManager = $Incidents.Contains("create(")
  incidentTimeline = $Incidents.Contains("addTimeline")
  monitoringDashboard = $Dashboard.Contains("diagnostics()")
  statusEndpoint = $Controller.Contains('@Get("status")')
  diagnosticsEndpoint = $Controller.Contains('@Get("diagnostics")')
  healthEndpoint = $Controller.Contains('@Post("health")')
  metricEndpoint = $Controller.Contains('@Post("metrics")')
  logEndpoint = $Controller.Contains('@Post("logs")')
  traceEndpoint = $Controller.Contains('@Post("traces/start")')
  alertRuleEndpoint = $Controller.Contains('@Post("alert-rules")')
  incidentEndpoint = $Controller.Contains('@Post("incidents")')
}

$Failed = @($Checks.GetEnumerator() | Where-Object { -not $_.Value })

if ($Failed.Count -gt 0) {
  throw "X1.1 verification failed: $($Failed.Name -join ', ')"
}

[ordered]@{
  success = $true
  system = "AVOS Enterprise Reliability & Observability Core"
  bundle = "X1.1"
  classification = "reliability-observability-core"
  requiredFiles = $Required.Count
  compiledChecks = $Checks.Count
  serviceHealthRegistry = "enabled"
  healthDashboard = "enabled"
  metricsRegistry = "enabled"
  metricsAggregator = "enabled"
  structuredLogging = "enabled"
  logCorrelation = "enabled"
  distributedTracing = "enabled"
  traceContext = "enabled"
  alertManager = "enabled"
  alertRules = "enabled"
  incidentManager = "enabled"
  incidentTimeline = "enabled"
  monitoringDashboard = "enabled"
  status = "VERIFIED"
} | ConvertTo-Json -Depth 10
