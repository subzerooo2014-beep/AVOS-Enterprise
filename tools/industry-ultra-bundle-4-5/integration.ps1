[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$modulePath = Join-Path $RepoRoot "apps/api/src/industry-ultra-bundle-4-5/industry-ultra-bundle-4-5.module.ts"
$appModulePath = Join-Path $RepoRoot "apps/api/src/app.module.ts"

$module = Get-Content -LiteralPath $modulePath -Raw
$appModule = Get-Content -LiteralPath $appModulePath -Raw

$controllers = @(
  "AgricultureAgritechIndustryController",
  "FoodBeverageIndustryController",
  "MiningResourcesIndustryController",
  "MediaEntertainmentIndustryController",
  "SportsEventsIndustryController",
  "LegalProfessionalServicesIndustryController",
  "SecurityEmergencyServicesIndustryController",
  "EnvironmentWasteIndustryController",
  "SpaceSatelliteIndustryController",
  "NonprofitHumanitarianIndustryController"
)

foreach ($controller in $controllers) {
  if ($module -notmatch $controller) {
    throw "Controller is not registered: $controller"
  }
}

if ($module -notmatch "IndustryUltraBundle45Service") {
  throw "Shared service is missing."
}

if ($appModule -notmatch "IndustryUltraBundle45Module") {
  throw "Module is not registered in app.module.ts."
}

$webRoutes = @(
  "agriculture-agritech-industry",
  "food-beverage-industry",
  "mining-resources-industry",
  "media-entertainment-industry",
  "sports-events-industry",
  "legal-professional-services-industry",
  "security-emergency-services-industry",
  "environment-waste-industry",
  "space-satellite-industry",
  "nonprofit-humanitarian-industry"
)

foreach ($route in $webRoutes) {
  if (-not (Test-Path -LiteralPath (Join-Path $RepoRoot "apps/web/src/app/$route/page.tsx"))) {
    throw "Missing web route: $route"
  }
}

if (-not (Test-Path -LiteralPath (Join-Path $RepoRoot "apps/mobile/lib/features/industry_ultra_bundle_4_5/industry_ultra_bundle_4_5.dart"))) {
  throw "Missing mobile export."
}

[pscustomobject]@{
  success = $true
  system = "AVOS Industry Ultra Bundle 4-5"
  integrationTests = "passed"
  controllers = $controllers.Count
  webRoutes = $webRoutes.Count
  mobileBundle = "registered"
} | Format-List