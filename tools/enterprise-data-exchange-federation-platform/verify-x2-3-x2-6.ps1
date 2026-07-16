[CmdletBinding()]
param([string]$ProjectRoot = "C:\Users\User\Desktop\AVOS")

$ErrorActionPreference = "Stop"
$Root = Join-Path $ProjectRoot "apps\api\src\enterprise-data-exchange-federation-platform"

$Required = @(
  "enterprise-data-exchange-federation.types.ts",
  "federation-node-registry.service.ts",
  "schema-registry.service.ts",
  "data-contract-registry.service.ts",
  "data-mapping-engine.service.ts",
  "federation-lineage.service.ts",
  "federation-quality-monitor.service.ts",
  "data-exchange-hub.service.ts",
  "data-synchronization.service.ts",
  "federation-analytics.service.ts",
  "enterprise-data-exchange-federation-platform.controller.ts",
  "enterprise-data-exchange-federation-platform.module.ts",
  "index.ts"
)

$Missing = @()

foreach ($File in $Required) {
  if (-not (Test-Path (Join-Path $Root $File))) {
    $Missing += $File
  }
}

if ($Missing.Count -gt 0) {
  throw "Missing X2.3-X2.6 files: $($Missing -join ', ')"
}

$AppModule = Get-Content (Join-Path $ProjectRoot "apps\api\src\app.module.ts") -Raw
$Nodes = Get-Content (Join-Path $Root "federation-node-registry.service.ts") -Raw
$Schemas = Get-Content (Join-Path $Root "schema-registry.service.ts") -Raw
$Contracts = Get-Content (Join-Path $Root "data-contract-registry.service.ts") -Raw
$Mappings = Get-Content (Join-Path $Root "data-mapping-engine.service.ts") -Raw
$Lineage = Get-Content (Join-Path $Root "federation-lineage.service.ts") -Raw
$Quality = Get-Content (Join-Path $Root "federation-quality-monitor.service.ts") -Raw
$Exchange = Get-Content (Join-Path $Root "data-exchange-hub.service.ts") -Raw
$Sync = Get-Content (Join-Path $Root "data-synchronization.service.ts") -Raw
$Analytics = Get-Content (Join-Path $Root "federation-analytics.service.ts") -Raw
$Controller = Get-Content (Join-Path $Root "enterprise-data-exchange-federation-platform.controller.ts") -Raw
$Module = Get-Content (Join-Path $Root "enterprise-data-exchange-federation-platform.module.ts") -Raw

$ImportCount = ([regex]::Matches(
  $AppModule,
  'enterprise-data-exchange-federation-platform/enterprise-data-exchange-federation-platform\.module'
)).Count

$ModuleCount = ([regex]::Matches(
  $AppModule,
  '\bEnterpriseDataExchangeFederationPlatformModule\b'
)).Count

$Checks = [ordered]@{
  uniqueModuleClass = $Module.Contains("export class EnterpriseDataExchangeFederationPlatformModule")
  singleImportPath = $ImportCount -eq 1
  moduleRegistered = $AppModule -match 'imports:\s*\[\s*EnterpriseDataExchangeFederationPlatformModule,'
  moduleOccurrencesValid = $ModuleCount -eq 2
  federationRegistry = $Nodes.Contains("private readonly nodes")
  schemaRegistry = $Schemas.Contains("private readonly schemas")
  dataContracts = $Contracts.Contains("private readonly contracts")
  mappingEngine = $Mappings.Contains("transform(")
  lineage = $Lineage.Contains("record(")
  qualityMonitor = $Quality.Contains("check(")
  dataExchangeHub = $Exchange.Contains("publish(") -and $Exchange.Contains("deliver(")
  dataSynchronization = $Sync.Contains("run(")
  federationAnalytics = $Analytics.Contains("metrics(): FederationMetrics")
  statusEndpoint = $Controller.Contains('@Get("status")')
  diagnosticsEndpoint = $Controller.Contains('@Get("diagnostics")')
  nodeEndpoint = $Controller.Contains('@Post("nodes")')
  schemaEndpoint = $Controller.Contains('@Post("schemas")')
  contractEndpoint = $Controller.Contains('@Post("contracts")')
  mappingEndpoint = $Controller.Contains('@Post("mappings")')
  messageEndpoint = $Controller.Contains('@Post("messages")')
  synchronizationEndpoint = $Controller.Contains('@Post("synchronizations")')
}

$Failed = @($Checks.GetEnumerator() | Where-Object { -not $_.Value })

if ($Failed.Count -gt 0) {
  throw "X2.3-X2.6 verification failed: $($Failed.Name -join ', ')"
}

[ordered]@{
  success = $true
  system = "AVOS Enterprise Data Exchange & Federation Platform"
  bundle = "X2.3-X2.6"
  classification = "enterprise-data-exchange-federation-platform"
  requiredFiles = $Required.Count
  compiledChecks = $Checks.Count
  federationRegistry = "enabled"
  schemaRegistry = "enabled"
  dataContracts = "enabled"
  mappingEngine = "enabled"
  dataExchangeHub = "enabled"
  dataSynchronization = "enabled"
  federationLineage = "enabled"
  qualityMonitor = "enabled"
  federationAnalytics = "enabled"
  duplicateModuleProtection = "enabled"
  status = "VERIFIED"
} | ConvertTo-Json -Depth 10
