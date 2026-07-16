[CmdletBinding()]
param([string]$ProjectRoot = "C:\Users\User\Desktop\AVOS")

$ErrorActionPreference = "Stop"
$Root = Join-Path $ProjectRoot "apps\api\src\enterprise-intelligence-command-platform"

$Required = @(
  "enterprise-intelligence-command.types.ts",
  "decision-intelligence.service.ts",
  "enterprise-knowledge-graph.service.ts",
  "enterprise-digital-twin.service.ts",
  "autonomous-operations.service.ts",
  "intelligence-command-center.service.ts",
  "enterprise-intelligence-command-platform.controller.ts",
  "enterprise-intelligence-command-platform.module.ts",
  "index.ts"
)

$Missing = @()

foreach ($File in $Required) {
  if (-not (Test-Path (Join-Path $Root $File))) {
    $Missing += $File
  }
}

if ($Missing.Count -gt 0) {
  throw "Missing X1.6-X1.10 files: $($Missing -join ', ')"
}

$AppModule = Get-Content (Join-Path $ProjectRoot "apps\api\src\app.module.ts") -Raw
$Decision = Get-Content (Join-Path $Root "decision-intelligence.service.ts") -Raw
$Knowledge = Get-Content (Join-Path $Root "enterprise-knowledge-graph.service.ts") -Raw
$Twin = Get-Content (Join-Path $Root "enterprise-digital-twin.service.ts") -Raw
$Operations = Get-Content (Join-Path $Root "autonomous-operations.service.ts") -Raw
$Command = Get-Content (Join-Path $Root "intelligence-command-center.service.ts") -Raw
$Controller = Get-Content (Join-Path $Root "enterprise-intelligence-command-platform.controller.ts") -Raw
$Module = Get-Content (Join-Path $Root "enterprise-intelligence-command-platform.module.ts") -Raw

$ImportCount = ([regex]::Matches(
  $AppModule,
  'enterprise-intelligence-command-platform/enterprise-intelligence-command-platform\.module'
)).Count

$ModuleNameCount = ([regex]::Matches(
  $AppModule,
  '\bEnterpriseIntelligenceCommandPlatformModule\b'
)).Count

$Checks = [ordered]@{
  uniqueModuleClass = $Module.Contains("export class EnterpriseIntelligenceCommandPlatformModule")
  singleImportPath = $ImportCount -eq 1
  moduleRegistered = $AppModule -match 'imports:\s*\[\s*EnterpriseIntelligenceCommandPlatformModule,'
  moduleOccurrencesValid = $ModuleNameCount -eq 2
  decisionRegistry = $Decision.Contains("private readonly decisions")
  scenarioPlanner = $Decision.Contains("addScenario(")
  recommendationEngine = $Decision.Contains("recommend(decisionId")
  decisionApproval = $Decision.Contains("approve(")
  knowledgeGraph = $Knowledge.Contains("upsertEntity(") -and $Knowledge.Contains("connect(")
  digitalTwin = $Twin.Contains("upsertTwin(")
  twinSimulation = $Twin.Contains("simulate(")
  autonomousOperations = $Operations.Contains("plan(") -and $Operations.Contains("advance(")
  commandCenter = $Command.Contains("dashboard()")
  commandAlerts = $Command.Contains("raiseAlert(")
  statusEndpoint = $Controller.Contains('@Get("status")')
  dashboardEndpoint = $Controller.Contains('@Get("dashboard")')
  decisionEndpoint = $Controller.Contains('@Post("decisions")')
  scenarioEndpoint = $Controller.Contains('@Post("decisions/:id/scenarios")')
  knowledgeEndpoint = $Controller.Contains('@Post("knowledge/entities")')
  twinEndpoint = $Controller.Contains('@Post("digital-twins")')
  operationEndpoint = $Controller.Contains('@Post("operations")')
  alertEndpoint = $Controller.Contains('@Post("alerts")')
}

$Failed = @($Checks.GetEnumerator() | Where-Object { -not $_.Value })

if ($Failed.Count -gt 0) {
  throw "X1.6-X1.10 verification failed: $($Failed.Name -join ', ')"
}

[ordered]@{
  success = $true
  system = "AVOS Enterprise Intelligence Command Platform"
  bundle = "X1.6-X1.10"
  classification = "enterprise-intelligence-command-platform"
  requiredFiles = $Required.Count
  compiledChecks = $Checks.Count
  decisionIntelligence = "enabled"
  scenarioPlanner = "enabled"
  recommendationEngine = "enabled"
  enterpriseKnowledgeGraph = "enabled"
  digitalTwinPlatform = "enabled"
  autonomousOperations = "enabled"
  intelligenceCommandCenter = "enabled"
  duplicateModuleProtection = "enabled"
  status = "VERIFIED"
} | ConvertTo-Json -Depth 10
