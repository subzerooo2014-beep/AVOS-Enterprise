[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$modulePath = Join-Path $RepoRoot `
  "apps/api/src/design-system-foundation/design-system-foundation.module.ts"

$appModulePath = Join-Path $RepoRoot "apps/api/src/app.module.ts"
$webPagePath = Join-Path $RepoRoot `
  "apps/web/src/app/design-system-foundation/page.tsx"
$webTokensPath = Join-Path $RepoRoot `
  "apps/web/src/design-system/tokens.ts"
$mobileThemePath = Join-Path $RepoRoot `
  "apps/mobile/lib/design_system/avos_theme.dart"
$mobileComponentsPath = Join-Path $RepoRoot `
  "apps/mobile/lib/design_system/avos_components.dart"

$module = Get-Content -LiteralPath $modulePath -Raw
$appModule = Get-Content -LiteralPath $appModulePath -Raw

$checks = [ordered]@{
  controllerRegistered =
    $module -match "DesignSystemFoundationController"
  serviceRegistered =
    $module -match "DesignSystemFoundationService"
  serviceExported =
    $module -match "exports:\s*\[DesignSystemFoundationService\]"
  appModuleRegistered =
    $appModule -match "DesignSystemFoundationModule"
  webPage =
    Test-Path -LiteralPath $webPagePath
  webTokens =
    Test-Path -LiteralPath $webTokensPath
  mobileTheme =
    Test-Path -LiteralPath $mobileThemePath
  mobileComponents =
    Test-Path -LiteralPath $mobileComponentsPath
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
  system = "AVOS Design System Foundation V1"
  integrationTests = "passed"
  checks = $checks.Count
} | Format-List