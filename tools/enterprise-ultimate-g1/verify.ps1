param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"

$base = Join-Path $RepoRoot "apps/api/src/enterprise-ultimate-g1"
$files = @(
  "enterprise-ultimate-g1.types.ts",
  "enterprise-ultimate-g1.registry.ts",
  "enterprise-ultimate-g1.service.ts",
  "enterprise-ultimate-g1.controller.ts",
  "enterprise-ultimate-g1.module.ts",
  "index.ts"
)

foreach ($file in $files) {
  if (-not (Test-Path (Join-Path $base $file))) {
    throw "Missing file: $file"
  }
}

$registry = Get-Content (Join-Path $base "enterprise-ultimate-g1.registry.ts") -Raw
$service = Get-Content (Join-Path $base "enterprise-ultimate-g1.service.ts") -Raw

$capabilities = @(
  "GLOBAL_DESIGN_SYSTEM","AVOS_BRAND_RUNTIME","LOGO_SYSTEM",
  "LIGHT_THEME_ENGINE","DARK_THEME_ENGINE","RTL_LTR_ENGINE",
  "ARABIC_LOCALIZATION","ENGLISH_LOCALIZATION","RESPONSIVE_WEB_SHELL",
  "MOBILE_APP_SHELL","ACCESSIBILITY_ENGINE","GLOBAL_NAVIGATION",
  "GLOBAL_SEARCH","NOTIFICATION_CENTER","PROFILE_CENTER",
  "ONBOARDING_ENGINE","AUTHENTICATION_EXPERIENCE","LANDING_EXPERIENCE",
  "MARKETPLACE_EXPERIENCE","VEHICLE_DETAIL_EXPERIENCE","DEAL_EXPERIENCE",
  "AUCTION_EXPERIENCE","CHAT_EXPERIENCE","AI_ASSISTANT_EXPERIENCE",
  "ADMIN_EXPERIENCE","DEALER_EXPERIENCE","PARTNER_EXPERIENCE",
  "DESIGN_TOKENS","UI_COMPONENT_LIBRARY","EXPERIENCE_CONFIGURATION_CENTER"
)

foreach ($capability in $capabilities) {
  if ($registry -notmatch $capability) {
    throw "Missing capability: $capability"
  }
}

$methods = @(
  "framework","createTheme","activateTheme","createNavigation",
  "configureExperience","registerComponent","resolveExperience",
  "commandCenter"
)

foreach ($method in $methods) {
  if ($service -notmatch $method) {
    throw "Missing method: $method"
  }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Enterprise Ultimate Mega Bundle G1"
  verification = "passed"
  capabilities = $capabilities.Count
  runtimeMethods = $methods.Count
} | Format-List