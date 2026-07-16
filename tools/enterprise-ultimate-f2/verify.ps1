param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"

$base = Join-Path $RepoRoot "apps/api/src/enterprise-ultimate-f2"
$files = @(
  "enterprise-ultimate-f2.types.ts",
  "enterprise-ultimate-f2.registry.ts",
  "enterprise-ultimate-f2.service.ts",
  "enterprise-ultimate-f2.controller.ts",
  "enterprise-ultimate-f2.module.ts",
  "index.ts"
)

foreach ($file in $files) {
  if (-not (Test-Path (Join-Path $base $file))) { throw "Missing file: $file" }
}

$registry = Get-Content (Join-Path $base "enterprise-ultimate-f2.registry.ts") -Raw
$service = Get-Content (Join-Path $base "enterprise-ultimate-f2.service.ts") -Raw

$capabilities = @(
  "AI_COMMAND_CENTER_V2","ENTERPRISE_DECISION_CENTER","EXECUTIVE_DASHBOARD",
  "CEO_WORKSPACE","AI_MISSION_CENTER","SMART_NOTIFICATION_ENGINE_V2",
  "ENTERPRISE_KPI_DASHBOARD","ENTERPRISE_LIVE_TIMELINE","BUSINESS_HEALTH_MONITOR",
  "REVENUE_INTELLIGENCE","COST_INTELLIGENCE","PROFIT_INTELLIGENCE",
  "CUSTOMER_INTELLIGENCE","VEHICLE_INTELLIGENCE_DASHBOARD",
  "SALES_INTELLIGENCE_DASHBOARD","MARKETING_INTELLIGENCE_DASHBOARD",
  "FINANCE_INTELLIGENCE_DASHBOARD","OPERATIONS_INTELLIGENCE_DASHBOARD",
  "INVENTORY_INTELLIGENCE_DASHBOARD","RISK_INTELLIGENCE_DASHBOARD",
  "ENTERPRISE_AI_INBOX","ENTERPRISE_AI_TASKS","ENTERPRISE_ACTION_CENTER",
  "EXECUTIVE_REPORTS_ENGINE","ENTERPRISE_INSIGHTS_ENGINE","STRATEGY_DASHBOARD",
  "GOAL_TRACKING_ENGINE","OKR_DASHBOARD","EXECUTIVE_ANALYTICS",
  "LIVE_ENTERPRISE_METRICS"
)

foreach ($capability in $capabilities) {
  if ($registry -notmatch $capability) { throw "Missing capability: $capability" }
}

$methods = @(
  "framework","recordMetric","createDecision","approveDecision","executeDecision",
  "createTask","completeTask","createInsight","createGoal","executiveDashboard",
  "businessHealth"
)

foreach ($method in $methods) {
  if ($service -notmatch $method) { throw "Missing method: $method" }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Enterprise Ultimate Mega Bundle F2"
  verification = "passed"
  capabilities = $capabilities.Count
  runtimeMethods = $methods.Count
} | Format-List