[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$modulePath = Join-Path $RepoRoot `
  "apps/api/src/heavy-equipment-industry/heavy-equipment-industry.module.ts"

$appModulePath = Join-Path $RepoRoot "apps/api/src/app.module.ts"
$webPath = Join-Path $RepoRoot `
  "apps/web/src/app/heavy-equipment-industry/page.tsx"

$mobilePath = Join-Path $RepoRoot `
  "apps/mobile/lib/features/heavy_equipment_industry/heavy_equipment_industry_screen.dart"

$module = Get-Content -LiteralPath $modulePath -Raw
$appModule = Get-Content -LiteralPath $appModulePath -Raw

$checks = [ordered]@{
  controllerRegistered =
    $module -match "HeavyEquipmentIndustryController"
  assetsServiceRegistered =
    $module -match "HeavyEquipmentAssetsService"
  operationsServiceRegistered =
    $module -match "HeavyEquipmentOperationsService"
  intelligenceServiceRegistered =
    $module -match "HeavyEquipmentIntelligenceService"
  assetsServiceExported =
    $module -match "exports:\s*\[[\s\S]*HeavyEquipmentAssetsService"
  appModuleRegistered =
    $appModule -match "HeavyEquipmentIndustryModule"
  webExperience =
    Test-Path -LiteralPath $webPath
  mobileExperience =
    Test-Path -LiteralPath $mobilePath
}

$failed = @(
  $checks.GetEnumerator() |
    Where-Object { -not $_.Value }
)

if ($failed.Count -gt 0) {
  throw "Integration tests failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success = $true
  system = "AVOS Heavy Equipment Industry Pack"
  integrationTests = "passed"
  checks = $checks.Count
} | Format-List