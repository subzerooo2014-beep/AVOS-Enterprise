[CmdletBinding()]
param([string]$ProjectRoot = "C:\Users\User\Desktop\AVOS")

$ErrorActionPreference = "Stop"
$Root = Join-Path $ProjectRoot "apps\api\src\enterprise-business-operations-control-plane"

$Required = @(
  "enterprise-business-operations.types.ts",
  "business-operations-discovery.service.ts",
  "business-catalog.service.ts",
  "business-kpi-registry.service.ts",
  "business-rules-center.service.ts",
  "business-process-orchestrator.service.ts",
  "business-sla-monitor.service.ts",
  "business-operations-analytics.service.ts",
  "business-operations-governance.service.ts",
  "enterprise-business-operations-control-plane.service.ts",
  "enterprise-business-operations-control-plane.controller.ts",
  "enterprise-business-operations-control-plane.module.ts",
  "index.ts"
)

$Missing = @()
foreach ($File in $Required) {
  if (-not (Test-Path (Join-Path $Root $File))) {
    $Missing += $File
  }
}

if ($Missing.Count -gt 0) {
  throw "Missing B37-B43 files: $($Missing -join ', ')"
}

$AppModule = Get-Content (Join-Path $ProjectRoot "apps\api\src\app.module.ts") -Raw
$Discovery = Get-Content (Join-Path $Root "business-operations-discovery.service.ts") -Raw
$Catalog = Get-Content (Join-Path $Root "business-catalog.service.ts") -Raw
$Kpis = Get-Content (Join-Path $Root "business-kpi-registry.service.ts") -Raw
$Rules = Get-Content (Join-Path $Root "business-rules-center.service.ts") -Raw
$Processes = Get-Content (Join-Path $Root "business-process-orchestrator.service.ts") -Raw
$Sla = Get-Content (Join-Path $Root "business-sla-monitor.service.ts") -Raw
$Analytics = Get-Content (Join-Path $Root "business-operations-analytics.service.ts") -Raw
$Governance = Get-Content (Join-Path $Root "business-operations-governance.service.ts") -Raw
$ControlPlane = Get-Content (Join-Path $Root "enterprise-business-operations-control-plane.service.ts") -Raw
$Controller = Get-Content (Join-Path $Root "enterprise-business-operations-control-plane.controller.ts") -Raw

$Checks = [ordered]@{
  appModuleImport = $AppModule.Contains('import { EnterpriseBusinessOperationsControlPlaneModule } from "./enterprise-business-operations-control-plane/enterprise-business-operations-control-plane.module";')
  appModuleRegistration = $AppModule -match 'imports:\s*\[\s*EnterpriseBusinessOperationsControlPlaneModule,'
  discovery = $Discovery.Contains("discover(sourceRoot")
  catalog = $Catalog.Contains("private readonly components")
  kpiRegistry = $Kpis.Contains("private readonly definitions")
  kpiMeasurements = $Kpis.Contains("measure(")
  businessRulesCenter = $Rules.Contains("evaluate(")
  processOrchestrator = $Processes.Contains("start(") -and $Processes.Contains("advance(")
  slaMonitor = $Sla.Contains("measure(")
  operationalAnalytics = $Analytics.Contains("snapshot()")
  governance = $Governance.Contains("validate()")
  salesIntegration = $ControlPlane.Contains("salesIntegration")
  inventoryIntegration = $ControlPlane.Contains("inventoryIntegration")
  customerIntegration = $ControlPlane.Contains("customerIntegration")
  financeIntegration = $ControlPlane.Contains("financeIntegration")
  orderIntegration = $ControlPlane.Contains("orderIntegration")
  statusEndpoint = $Controller.Contains('@Get("status")')
  diagnosticsEndpoint = $Controller.Contains('@Get("diagnostics")')
  kpiEndpoint = $Controller.Contains('@Post("kpis")')
  processEndpoint = $Controller.Contains('@Post("processes/start")')
  slaEndpoint = $Controller.Contains('@Post("slas")')
}

$Failed = @($Checks.GetEnumerator() | Where-Object { -not $_.Value })

if ($Failed.Count -gt 0) {
  throw "B37-B43 verification failed: $($Failed.Name -join ', ')"
}

[ordered]@{
  success = $true
  system = "AVOS Enterprise Business Operations Control Plane"
  bundle = "B37-B43"
  classification = "enterprise-business-operations-control-plane"
  requiredFiles = $Required.Count
  compiledChecks = $Checks.Count
  discovery = "enabled"
  catalog = "enabled"
  kpiRegistry = "enabled"
  kpiMeasurements = "enabled"
  businessRulesCenter = "enabled"
  processOrchestrator = "enabled"
  slaMonitor = "enabled"
  operationalAnalytics = "enabled"
  governance = "enabled"
  salesIntegration = "integration-ready"
  inventoryIntegration = "integration-ready"
  customerIntegration = "integration-ready"
  financeIntegration = "integration-ready"
  orderIntegration = "integration-ready"
  status = "VERIFIED"
} | ConvertTo-Json -Depth 10
