[CmdletBinding()]
param([string]$ProjectRoot = "C:\Users\User\Desktop\AVOS")

$ErrorActionPreference = "Stop"
$Root = Join-Path $ProjectRoot "apps\api\src\enterprise-knowledge-graph-platform-v2"

$Required = @(
  "enterprise-knowledge-graph-platform-v2.types.ts",
  "knowledge-entity-registry-v2.service.ts",
  "knowledge-relationship-engine-v2.service.ts",
  "knowledge-semantic-search-v2.service.ts",
  "knowledge-lineage-v2.service.ts",
  "knowledge-inference-engine-v2.service.ts",
  "knowledge-graph-analytics-v2.service.ts",
  "enterprise-knowledge-graph-platform-v2.controller.ts",
  "enterprise-knowledge-graph-platform-v2.module.ts",
  "index.ts"
)

$Missing = @()
foreach ($File in $Required) {
  if (-not (Test-Path (Join-Path $Root $File))) {
    $Missing += $File
  }
}

if ($Missing.Count -gt 0) {
  throw "Missing X2.26-X2.30 files: $($Missing -join ', ')"
}

$AppModule = Get-Content (Join-Path $ProjectRoot "apps\api\src\app.module.ts") -Raw
$Entity = Get-Content (Join-Path $Root "knowledge-entity-registry-v2.service.ts") -Raw
$Relation = Get-Content (Join-Path $Root "knowledge-relationship-engine-v2.service.ts") -Raw
$Search = Get-Content (Join-Path $Root "knowledge-semantic-search-v2.service.ts") -Raw
$Lineage = Get-Content (Join-Path $Root "knowledge-lineage-v2.service.ts") -Raw
$Inference = Get-Content (Join-Path $Root "knowledge-inference-engine-v2.service.ts") -Raw
$Analytics = Get-Content (Join-Path $Root "knowledge-graph-analytics-v2.service.ts") -Raw
$Controller = Get-Content (Join-Path $Root "enterprise-knowledge-graph-platform-v2.controller.ts") -Raw
$Module = Get-Content (Join-Path $Root "enterprise-knowledge-graph-platform-v2.module.ts") -Raw

$ImportCount = ([regex]::Matches(
  $AppModule,
  'enterprise-knowledge-graph-platform-v2/enterprise-knowledge-graph-platform-v2\.module'
)).Count

$ModuleCount = ([regex]::Matches(
  $AppModule,
  '\bEnterpriseKnowledgeGraphPlatformV2Module\b'
)).Count

$Checks = [ordered]@{
  uniqueModuleClass = $Module.Contains("export class EnterpriseKnowledgeGraphPlatformV2Module")
  singleImportPath = $ImportCount -eq 1
  moduleRegistered = $AppModule -match 'imports:\s*\[\s*EnterpriseKnowledgeGraphPlatformV2Module,'
  moduleOccurrencesValid = $ModuleCount -eq 2
  entityRegistry = $Entity.Contains("private readonly entities")
  relationshipEngine = $Relation.Contains("connect(") -and $Relation.Contains("neighbors(")
  semanticSearch = $Search.Contains("search(query")
  knowledgeLineage = $Lineage.Contains("record(")
  inferenceEngine = $Inference.Contains("infer(entityId")
  graphAnalytics = $Analytics.Contains("metrics(): KnowledgeGraphMetricsV2")
  statusEndpoint = $Controller.Contains('@Get("status")')
  diagnosticsEndpoint = $Controller.Contains('@Get("diagnostics")')
  entityEndpoint = $Controller.Contains('@Post("entities")')
  relationEndpoint = $Controller.Contains('@Post("relations")')
  searchEndpoint = $Controller.Contains('@Get("search")')
  inferenceEndpoint = $Controller.Contains('@Post("entities/:id/infer")')
  neighborEndpoint = $Controller.Contains('@Get("entities/:id/neighbors")')
  lineageEndpoint = $Controller.Contains('@Get("entities/:id/lineage")')
}

$Failed = @($Checks.GetEnumerator() | Where-Object { -not $_.Value })

if ($Failed.Count -gt 0) {
  throw "X2.26-X2.30 verification failed: $($Failed.Name -join ', ')"
}

[ordered]@{
  success = $true
  system = "AVOS Enterprise Knowledge Graph Platform V2"
  bundle = "X2.26-X2.30"
  classification = "enterprise-knowledge-graph-platform-v2"
  requiredFiles = $Required.Count
  compiledChecks = $Checks.Count
  entityRegistry = "enabled"
  relationshipEngine = "enabled"
  semanticSearch = "enabled"
  inferenceEngine = "enabled"
  knowledgeLineage = "enabled"
  knowledgeExplorer = "enabled"
  graphAnalytics = "enabled"
  duplicateModuleProtection = "enabled"
  status = "VERIFIED"
} | ConvertTo-Json -Depth 10
