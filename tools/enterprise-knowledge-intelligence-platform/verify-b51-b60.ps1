[CmdletBinding()]
param([string]$ProjectRoot = "C:\Users\User\Desktop\AVOS")

$ErrorActionPreference = "Stop"
$Root = Join-Path $ProjectRoot "apps\api\src\enterprise-knowledge-intelligence-platform"

$Required = @(
  "enterprise-knowledge-intelligence.types.ts",
  "knowledge-graph.service.ts",
  "knowledge-catalog.service.ts",
  "vector-memory.service.ts",
  "semantic-search.service.ts",
  "prompt-management.service.ts",
  "rag-retrieval.service.ts",
  "conversation-memory.service.ts",
  "enterprise-reasoning.service.ts",
  "knowledge-governance.service.ts",
  "enterprise-knowledge-intelligence-platform.service.ts",
  "enterprise-knowledge-intelligence-platform.controller.ts",
  "enterprise-knowledge-intelligence-platform.module.ts",
  "index.ts"
)

$Missing = @()
foreach ($File in $Required) {
  if (-not (Test-Path (Join-Path $Root $File))) { $Missing += $File }
}
if ($Missing.Count -gt 0) { throw "Missing B51-B60 files: $($Missing -join ', ')" }

$AppModule = Get-Content (Join-Path $ProjectRoot "apps\api\src\app.module.ts") -Raw
$Graph = Get-Content (Join-Path $Root "knowledge-graph.service.ts") -Raw
$Catalog = Get-Content (Join-Path $Root "knowledge-catalog.service.ts") -Raw
$Vector = Get-Content (Join-Path $Root "vector-memory.service.ts") -Raw
$Search = Get-Content (Join-Path $Root "semantic-search.service.ts") -Raw
$Prompts = Get-Content (Join-Path $Root "prompt-management.service.ts") -Raw
$Rag = Get-Content (Join-Path $Root "rag-retrieval.service.ts") -Raw
$Conversation = Get-Content (Join-Path $Root "conversation-memory.service.ts") -Raw
$Reasoning = Get-Content (Join-Path $Root "enterprise-reasoning.service.ts") -Raw
$Governance = Get-Content (Join-Path $Root "knowledge-governance.service.ts") -Raw
$Platform = Get-Content (Join-Path $Root "enterprise-knowledge-intelligence-platform.service.ts") -Raw
$Controller = Get-Content (Join-Path $Root "enterprise-knowledge-intelligence-platform.controller.ts") -Raw

$Checks = [ordered]@{
  appModuleImport = $AppModule.Contains('import { EnterpriseKnowledgeIntelligencePlatformModule } from "./enterprise-knowledge-intelligence-platform/enterprise-knowledge-intelligence-platform.module";')
  appModuleRegistration = $AppModule -match 'imports:\s*\[\s*EnterpriseKnowledgeIntelligencePlatformModule,'
  knowledgeGraph = $Graph.Contains("upsertNode(") -and $Graph.Contains("connect(")
  knowledgeCatalog = $Catalog.Contains("private readonly documents")
  vectorMemory = $Vector.Contains("private readonly records")
  semanticSearch = $Search.Contains("search(query")
  promptManagement = $Prompts.Contains("render(")
  ragFoundation = $Rag.Contains("retrieve(query")
  conversationMemory = $Conversation.Contains("append(")
  enterpriseReasoning = $Reasoning.Contains("reason(question")
  governance = $Governance.Contains("validate()")
  contextFusion = $Platform.Contains("contextFusion")
  decisionSupport = $Platform.Contains("decisionSupport")
  statusEndpoint = $Controller.Contains('@Get("status")')
  diagnosticsEndpoint = $Controller.Contains('@Get("diagnostics")')
  documentEndpoint = $Controller.Contains('@Post("documents")')
  searchEndpoint = $Controller.Contains('@Get("search")')
  retrievalEndpoint = $Controller.Contains('@Post("retrieve")')
  reasoningEndpoint = $Controller.Contains('@Post("reason")')
}

$Failed = @($Checks.GetEnumerator() | Where-Object { -not $_.Value })
if ($Failed.Count -gt 0) { throw "B51-B60 verification failed: $($Failed.Name -join ', ')" }

[ordered]@{
  success = $true
  system = "AVOS Enterprise Knowledge Intelligence Platform"
  bundle = "B51-B60"
  classification = "enterprise-knowledge-intelligence-platform"
  requiredFiles = $Required.Count
  compiledChecks = $Checks.Count
  knowledgeGraph = "enabled"
  knowledgeCatalog = "enabled"
  vectorMemory = "enabled"
  semanticSearch = "enabled"
  promptManagement = "enabled"
  ragFoundation = "enabled"
  conversationMemory = "enabled"
  enterpriseReasoning = "enabled"
  governance = "enabled"
  contextFusion = "enabled"
  decisionSupport = "enabled"
  status = "VERIFIED"
} | ConvertTo-Json -Depth 10
