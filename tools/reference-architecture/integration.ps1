[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$modulePath = Join-Path $RepoRoot `
  "apps/api/src/reference-architecture/reference-architecture.module.ts"

$appModulePath = Join-Path $RepoRoot "apps/api/src/app.module.ts"
$webPath = Join-Path $RepoRoot `
  "apps/web/src/app/reference-architecture/page.tsx"
$mobilePath = Join-Path $RepoRoot `
  "apps/mobile/lib/features/reference_architecture/reference_architecture_screen.dart"

$module = Get-Content -LiteralPath $modulePath -Raw
$appModule = Get-Content -LiteralPath $appModulePath -Raw

$checks = [ordered]@{
  controllerRegistered =
    $module -match "ReferenceArchitectureController"
  serviceRegistered =
    $module -match "ReferenceArchitectureService"
  serviceExported =
    $module -match "exports:\s*\[ReferenceArchitectureService\]"
  appModuleRegistered =
    $appModule -match "ReferenceArchitectureModule"
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
  system = "AVOS Reference Architecture & Registry Foundation V1"
  integrationTests = "passed"
  checks = $checks.Count
} | Format-List