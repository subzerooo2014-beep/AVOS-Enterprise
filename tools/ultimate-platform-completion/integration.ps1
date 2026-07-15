[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$modulePath = Join-Path $RepoRoot `
  "apps/api/src/ultimate-platform-completion/ultimate-platform-completion.module.ts"

$appModulePath = Join-Path $RepoRoot "apps/api/src/app.module.ts"

$module = Get-Content -LiteralPath $modulePath -Raw
$appModule = Get-Content -LiteralPath $appModulePath -Raw

$checks = [ordered]@{
  controllerRegistered =
    $module -match "UltimatePlatformCompletionController"
  serviceRegistered =
    $module -match "UltimatePlatformCompletionService"
  serviceExported =
    $module -match "exports:\s*\[UltimatePlatformCompletionService\]"
  appModuleRegistered =
    $appModule -match "UltimatePlatformCompletionModule"
  webExperience =
    Test-Path -LiteralPath (
      Join-Path $RepoRoot "apps/web/src/app/ultimate-platform-completion/page.tsx"
    )
  mobileExperience =
    Test-Path -LiteralPath (
      Join-Path $RepoRoot "apps/mobile/lib/features/ultimate_platform_completion/ultimate_platform_completion_screen.dart"
    )
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
  system = "AVOS Ultimate Platform Completion Bundle V1"
  integrationTests = "passed"
  checks = $checks.Count
} | Format-List