param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"

$base = Join-Path $RepoRoot "apps/api/src/enterprise-ultimate-f1"
$files = @(
  "enterprise-ultimate-f1.types.ts",
  "enterprise-ultimate-f1.registry.ts",
  "enterprise-ultimate-f1.service.ts",
  "enterprise-ultimate-f1.controller.ts",
  "enterprise-ultimate-f1.module.ts",
  "index.ts"
)

foreach ($file in $files) {
  if (-not (Test-Path (Join-Path $base $file))) { throw "Missing file: $file" }
}

$registry = Get-Content (Join-Path $base "enterprise-ultimate-f1.registry.ts") -Raw
$service = Get-Content (Join-Path $base "enterprise-ultimate-f1.service.ts") -Raw

$capabilities = @(
  "WORKFLOW_ENGINE_V2","UNIVERSAL_NOTIFICATION_CENTER","ENTERPRISE_COMMAND_BUS",
  "GLOBAL_SEARCH_ENGINE","ENTERPRISE_DASHBOARD_ENGINE","WIDGET_FRAMEWORK",
  "DYNAMIC_DASHBOARD_BUILDER","AI_WORKSPACE_ENGINE","ENTERPRISE_TIMELINE_ENGINE",
  "LIVE_ACTIVITY_ENGINE","REAL_TIME_EVENT_STREAM","ENTERPRISE_KPI_ENGINE",
  "CROSS_MODULE_ANALYTICS","DASHBOARD_PERMISSION_ENGINE",
  "ENTERPRISE_COMMAND_CENTER_CORE","BUSINESS_PULSE_ENGINE",
  "AI_RECOMMENDATION_ENGINE_V2","UNIFIED_NAVIGATION_FRAMEWORK",
  "WORKSPACE_PERSONALIZATION","ENTERPRISE_THEME_SYSTEM",
  "MULTI_TENANT_DASHBOARD_PROFILES","DASHBOARD_LAYOUT_MANAGER",
  "ENTERPRISE_LIVE_WIDGETS","ENTERPRISE_ACTIVITY_FEED",
  "DASHBOARD_PERFORMANCE_OPTIMIZER"
)

foreach ($capability in $capabilities) {
  if ($registry -notmatch $capability) { throw "Missing capability: $capability" }
}

$methods = @(
  "framework","createWorkspace","createWidget","attachWidget","publishActivity",
  "dispatchCommand","createRecommendation","acceptRecommendation","search",
  "businessPulse","commandCenter"
)

foreach ($method in $methods) {
  if ($service -notmatch $method) { throw "Missing method: $method" }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Enterprise Ultimate Mega Bundle F1"
  verification = "passed"
  capabilities = $capabilities.Count
  runtimeMethods = $methods.Count
} | Format-List