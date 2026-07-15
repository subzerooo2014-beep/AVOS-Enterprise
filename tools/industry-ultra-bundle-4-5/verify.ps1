[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$base = Join-Path $RepoRoot "apps/api/src/industry-ultra-bundle-4-5"

$requiredFiles = @(
  "industry-ultra-bundle-4-5.types.ts",
  "industry-ultra-bundle-4-5.registry.ts",
  "industry-ultra-bundle-4-5.service.ts",
  "industry-ultra-bundle-4-5.module.ts",
  "agriculture-agritech.controller.ts",
  "food-beverage.controller.ts",
  "mining-resources.controller.ts",
  "media-entertainment.controller.ts",
  "sports-events.controller.ts",
  "legal-professional-services.controller.ts",
  "security-emergency-services.controller.ts",
  "environment-waste.controller.ts",
  "space-satellite.controller.ts",
  "nonprofit-humanitarian.controller.ts",
  "index.ts"
)

foreach ($file in $requiredFiles) {
  if (-not (Test-Path -LiteralPath (Join-Path $base $file))) {
    throw "Missing file: $file"
  }
}

$registry = Get-Content -LiteralPath (Join-Path $base "industry-ultra-bundle-4-5.registry.ts") -Raw
$service = Get-Content -LiteralPath (Join-Path $base "industry-ultra-bundle-4-5.service.ts") -Raw

$industries = @(
  "AGRICULTURE_AGRITECH",
  "FOOD_BEVERAGE",
  "MINING_RESOURCES",
  "MEDIA_ENTERTAINMENT",
  "SPORTS_EVENTS",
  "LEGAL_PROFESSIONAL_SERVICES",
  "SECURITY_EMERGENCY_SERVICES",
  "ENVIRONMENT_WASTE",
  "SPACE_SATELLITE",
  "NONPROFIT_HUMANITARIAN"
)

$capabilities = @(
  "CORE_OPERATIONS",
  "ASSET_RESOURCE_MANAGEMENT",
  "CUSTOMER_BENEFICIARY_360",
  "WORKFORCE_VOLUNTEERS",
  "SUPPLY_CHAIN",
  "FINANCE_FUNDING",
  "COMPLIANCE_SAFETY",
  "RISK_RESILIENCE",
  "AI_INTELLIGENCE",
  "AUTOMATION",
  "ECOSYSTEM_MARKETPLACE",
  "ANALYTICS_IMPACT",
  "DOCUMENTS_CASES",
  "NOTIFICATIONS_RESPONSE",
  "COMMAND_CENTER"
)

foreach ($industry in $industries) {
  if ($registry -notmatch "(?m)^\s*$industry\s*:") {
    throw "Missing industry: $industry"
  }
}

foreach ($capability in $capabilities) {
  if ($registry -notmatch $capability) {
    throw "Missing capability: $capability"
  }
}

foreach ($method in @(
  "framework",
  "createRecord",
  "activateRecord",
  "createMission",
  "startMission",
  "completeMission",
  "createInsight",
  "listRecords",
  "commandCenter"
)) {
  if ($service -notmatch $method) {
    throw "Missing runtime method: $method"
  }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Industry Ultra Bundle 4-5"
  verification = "passed"
  requiredFiles = $requiredFiles.Count
  industries = $industries.Count
  capabilitiesPerIndustry = $capabilities.Count
  totalCapabilities = $industries.Count * $capabilities.Count
} | Format-List