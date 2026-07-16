param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"

$base = Join-Path $RepoRoot "apps/api/src/enterprise-ultimate-f3"
$files = @(
  "enterprise-ultimate-f3.types.ts",
  "enterprise-ultimate-f3.registry.ts",
  "enterprise-ultimate-f3.service.ts",
  "enterprise-ultimate-f3.controller.ts",
  "enterprise-ultimate-f3.module.ts",
  "index.ts"
)

foreach ($file in $files) {
  if (-not (Test-Path (Join-Path $base $file))) { throw "Missing file: $file" }
}

$registry = Get-Content (Join-Path $base "enterprise-ultimate-f3.registry.ts") -Raw
$service = Get-Content (Join-Path $base "enterprise-ultimate-f3.service.ts") -Raw

$capabilities = @(
  "ADVERTISEMENT_COMMAND_CENTER","SMART_ADVERTISEMENT_CENTER",
  "ADVERTISEMENT_INTELLIGENCE","ADVERTISEMENT_HEALTH_MONITOR",
  "SALES_PROBABILITY_ENGINE","AI_PRICE_TIMELINE","AI_PHOTOGRAPHER",
  "BUYER_RADAR","ADVERTISEMENT_BATTLE_MODE","ADVERTISEMENT_LIFECYCLE",
  "MARKETPLACE_INTELLIGENCE","MARKET_HEATMAP","MARKET_PULSE",
  "OPPORTUNITY_RADAR","TRUST_SCORE_ENGINE","DEAL_HEALTH_SCORE",
  "VEHICLE_360","CUSTOMER_360","DEALER_360","MARKET_360","AI_360",
  "VEHICLE_TIMELINE","CUSTOMER_TIMELINE","DEAL_TIMELINE",
  "SMART_LISTING_RANKING","COMPETITOR_COMPARISON",
  "ADVERTISEMENT_AUDIENCE_ANALYTICS","PROMOTION_OPTIMIZER",
  "LEAD_INTENT_ENGINE","MARKETPLACE_COMMAND_CENTER"
)

foreach ($capability in $capabilities) {
  if ($registry -notmatch $capability) { throw "Missing capability: $capability" }
}

$methods = @(
  "framework","createAdvertisement","publishAdvertisement","recordEngagement",
  "updatePrice","createMarketSignal","createBuyerIntent",
  "compareAdvertisements","advertisement360","marketplaceCommandCenter"
)

foreach ($method in $methods) {
  if ($service -notmatch $method) { throw "Missing method: $method" }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Enterprise Ultimate Mega Bundle F3"
  verification = "passed"
  capabilities = $capabilities.Count
  runtimeMethods = $methods.Count
} | Format-List