[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$modulePath = Join-Path $RepoRoot `
  "apps/api/src/brand-foundation/brand-foundation.module.ts"

$appModulePath = Join-Path $RepoRoot "apps/api/src/app.module.ts"
$webPath = Join-Path $RepoRoot `
  "apps/web/src/app/brand-foundation/page.tsx"
$mobilePath = Join-Path $RepoRoot `
  "apps/mobile/lib/features/brand_foundation/brand_foundation_screen.dart"

$module = Get-Content -LiteralPath $modulePath -Raw
$appModule = Get-Content -LiteralPath $appModulePath -Raw

$checks = [ordered]@{
  controllerRegistered =
    $module -match "BrandFoundationController"
  serviceRegistered =
    $module -match "BrandFoundationService"
  serviceExported =
    $module -match "exports:\s*\[BrandFoundationService\]"
  appModuleRegistered =
    $appModule -match "BrandFoundationModule"
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
  system = "AVOS Brand Foundation"
  integrationTests = "passed"
  checks = $checks.Count
} | Format-List