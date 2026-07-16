param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"

$base = Join-Path $RepoRoot "apps/api/src/enterprise-ultimate-f5"
$files = @(
  "enterprise-ultimate-f5.types.ts",
  "enterprise-ultimate-f5.registry.ts",
  "enterprise-ultimate-f5.service.ts",
  "enterprise-ultimate-f5.controller.ts",
  "enterprise-ultimate-f5.module.ts",
  "index.ts"
)

foreach ($file in $files) {
  if (-not (Test-Path (Join-Path $base $file))) {
    throw "Missing file: $file"
  }
}

$registry = Get-Content (Join-Path $base "enterprise-ultimate-f5.registry.ts") -Raw
$service = Get-Content (Join-Path $base "enterprise-ultimate-f5.service.ts") -Raw

$capabilities = @(
  "AVOS_SMART_WORKSPACE","AVOS_LIVE_COMMAND","AVOS_COCKPIT",
  "AVOS_STORY_MODE","AVOS_BUSINESS_PULSE","AVOS_AI_INBOX",
  "AVOS_DAILY_MISSION","AVOS_LIVE_ACTIVITY_FEED","AVOS_OFFICE_VIEW",
  "DIGITAL_EMPLOYEES","SALES_MANAGER_AI","FINANCE_MANAGER_AI",
  "MARKETING_MANAGER_AI","INVENTORY_MANAGER_AI","CEO_ADVISOR_AI",
  "AI_DAILY_BRIEFING","AI_ONE_CLICK","ROLE_BASED_DASHBOARDS",
  "CUSTOMIZABLE_DASHBOARD_LAYOUTS","ADVERTISEMENT_ANALYTICS_WIDGETS",
  "VEHICLE_360_WORKSPACE","CUSTOMER_360_WORKSPACE","DEALER_360_WORKSPACE",
  "MARKET_360_WORKSPACE","AI_360_WORKSPACE","UNIFIED_TIMELINE",
  "MISSION_CONTROL","COMMAND_PALETTE","GLOBAL_SEARCH_WORKSPACE",
  "WORKSPACE_PERSONALIZATION"
)

foreach ($capability in $capabilities) {
  if ($registry -notmatch $capability) {
    throw "Missing capability: $capability"
  }
}

$methods = @(
  "framework","createWorkspace","personalizeWorkspace","createMission",
  "updateMissionProgress","createBriefing","publishActivity",
  "createDigitalEmployee","assignDigitalEmployee",
  "completeDigitalEmployeeTask","commandPalette","cockpit"
)

foreach ($method in $methods) {
  if ($service -notmatch $method) {
    throw "Missing method: $method"
  }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Enterprise Ultimate Mega Bundle F5"
  verification = "passed"
  capabilities = $capabilities.Count
  runtimeMethods = $methods.Count
} | Format-List