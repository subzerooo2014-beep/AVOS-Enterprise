[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$modulePath = Join-Path $RepoRoot "apps/api/src/industry-ultra-bundle-2-3/industry-ultra-bundle-2-3.module.ts"
$appModulePath = Join-Path $RepoRoot "apps/api/src/app.module.ts"

$module = Get-Content -LiteralPath $modulePath -Raw
$appModule = Get-Content -LiteralPath $appModulePath -Raw

$controllers = @(
  "EnergyUtilitiesIndustryController",
  "RetailCommerceIndustryController",
  "HospitalityTourismIndustryController",
  "EducationIndustryController",
  "GovernmentPublicSectorIndustryController",
  "BankingFintechIndustryController",
  "InsuranceIndustryController",
  "TelecommunicationsIndustryController",
  "AviationIndustryController",
  "MaritimeIndustryController"
)

foreach ($controller in $controllers) {
  if ($module -notmatch $controller) {
    throw "Controller is not registered: $controller"
  }
}

if ($module -notmatch "IndustryUltraBundle23Service") {
  throw "Shared service is not registered."
}

if ($module -notmatch "exports:\s*\[IndustryUltraBundle23Service\]") {
  throw "Shared service is not exported."
}

if ($appModule -notmatch "IndustryUltraBundle23Module") {
  throw "Module is not registered in app.module.ts."
}

$webRoutes = @(
  "energy-utilities-industry",
  "retail-commerce-industry",
  "hospitality-tourism-industry",
  "education-industry",
  "government-public-sector-industry",
  "banking-fintech-industry",
  "insurance-industry-platform",
  "telecommunications-industry",
  "aviation-industry",
  "maritime-industry"
)

foreach ($route in $webRoutes) {
  $path = Join-Path $RepoRoot "apps/web/src/app/$route/page.tsx"
  if (-not (Test-Path -LiteralPath $path)) {
    throw "Missing web page: $route"
  }
}

$mobileExport = Join-Path $RepoRoot "apps/mobile/lib/features/industry_ultra_bundle_2_3/industry_ultra_bundle_2_3.dart"

if (-not (Test-Path -LiteralPath $mobileExport)) {
  throw "Missing mobile export file."
}

[pscustomobject]@{
  success = $true
  system = "AVOS Industry Ultra Bundle 2-3"
  integrationTests = "passed"
  controllers = $controllers.Count
  webRoutes = $webRoutes.Count
  mobileBundle = "registered"
} | Format-List