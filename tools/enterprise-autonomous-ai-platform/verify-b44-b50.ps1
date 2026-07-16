[CmdletBinding()]
param([string]$ProjectRoot = "C:\Users\User\Desktop\AVOS")

$ErrorActionPreference = "Stop"
$Root = Join-Path $ProjectRoot "apps\api\src\enterprise-autonomous-ai-platform"

$Required = @(
  "enterprise-autonomous-ai.types.ts",
  "ai-agent-registry.service.ts",
  "ai-skill-registry.service.ts",
  "ai-tool-registry.service.ts",
  "ai-memory-router.service.ts",
  "ai-policy-engine.service.ts",
  "ai-context-engine.service.ts",
  "ai-task-planner.service.ts",
  "ai-execution-orchestrator.service.ts",
  "ai-workflow-bridge.service.ts",
  "enterprise-autonomous-ai-platform.service.ts",
  "enterprise-autonomous-ai-platform.controller.ts",
  "enterprise-autonomous-ai-platform.module.ts",
  "index.ts"
)

$Missing = @()
foreach ($File in $Required) {
  if (-not (Test-Path (Join-Path $Root $File))) { $Missing += $File }
}
if ($Missing.Count -gt 0) { throw "Missing B44-B50 files: $($Missing -join ', ')" }

$AppModule = Get-Content (Join-Path $ProjectRoot "apps\api\src\app.module.ts") -Raw
$Agents = Get-Content (Join-Path $Root "ai-agent-registry.service.ts") -Raw
$Skills = Get-Content (Join-Path $Root "ai-skill-registry.service.ts") -Raw
$Tools = Get-Content (Join-Path $Root "ai-tool-registry.service.ts") -Raw
$Memory = Get-Content (Join-Path $Root "ai-memory-router.service.ts") -Raw
$Policies = Get-Content (Join-Path $Root "ai-policy-engine.service.ts") -Raw
$Context = Get-Content (Join-Path $Root "ai-context-engine.service.ts") -Raw
$Planner = Get-Content (Join-Path $Root "ai-task-planner.service.ts") -Raw
$Executor = Get-Content (Join-Path $Root "ai-execution-orchestrator.service.ts") -Raw
$Workflow = Get-Content (Join-Path $Root "ai-workflow-bridge.service.ts") -Raw
$Platform = Get-Content (Join-Path $Root "enterprise-autonomous-ai-platform.service.ts") -Raw
$Controller = Get-Content (Join-Path $Root "enterprise-autonomous-ai-platform.controller.ts") -Raw

$Checks = [ordered]@{
  appModuleImport = $AppModule.Contains('import { EnterpriseAutonomousAiPlatformModule } from "./enterprise-autonomous-ai-platform/enterprise-autonomous-ai-platform.module";')
  appModuleRegistration = $AppModule -match 'imports:\s*\[\s*EnterpriseAutonomousAiPlatformModule,'
  agentRegistry = $Agents.Contains("private readonly agents")
  skillRegistry = $Skills.Contains("private readonly skills")
  toolRegistry = $Tools.Contains("private readonly tools")
  memoryRouter = $Memory.Contains("private readonly memories")
  safetyPolicyLayer = $Policies.Contains("evaluate(context")
  contextEngine = $Context.Contains("compose(")
  taskPlanner = $Planner.Contains("plan(")
  executionOrchestrator = $Executor.Contains("execute(taskId")
  workflowBridge = $Workflow.Contains("createWorkflowTask")
  observability = $Executor.Contains("private readonly executions")
  existingAiIntegration = $Platform.Contains("existingAiIntegration")
  statusEndpoint = $Controller.Contains('@Get("status")')
  diagnosticsEndpoint = $Controller.Contains('@Get("diagnostics")')
  agentEndpoint = $Controller.Contains('@Post("agents")')
  skillEndpoint = $Controller.Contains('@Post("skills")')
  toolEndpoint = $Controller.Contains('@Post("tools")')
  taskEndpoint = $Controller.Contains('@Post("tasks")')
  executeEndpoint = $Controller.Contains('@Post("tasks/:taskId/execute")')
  workflowTaskEndpoint = $Controller.Contains('@Post("workflow-tasks")')
}

$Failed = @($Checks.GetEnumerator() | Where-Object { -not $_.Value })
if ($Failed.Count -gt 0) { throw "B44-B50 verification failed: $($Failed.Name -join ', ')" }

[ordered]@{
  success = $true
  system = "AVOS Enterprise Autonomous AI Platform"
  bundle = "B44-B50"
  classification = "enterprise-autonomous-ai-platform"
  requiredFiles = $Required.Count
  compiledChecks = $Checks.Count
  agentRegistry = "enabled"
  skillRegistry = "enabled"
  toolRegistry = "enabled"
  memoryRouter = "enabled"
  safetyPolicyLayer = "enabled"
  contextEngine = "enabled"
  taskPlanner = "enabled"
  executionOrchestrator = "enabled"
  workflowBridge = "enabled"
  observability = "enabled"
  existingAiIntegration = "integration-ready"
  status = "VERIFIED"
} | ConvertTo-Json -Depth 10
