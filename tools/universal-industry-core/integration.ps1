[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$modulePath = Join-Path $RepoRoot "apps/api/src/universal-industry-core/universal-industry-core.module.ts"
$appModulePath = Join-Path $RepoRoot "apps/api/src/app.module.ts"
$webPath = Join-Path $RepoRoot "apps/web/src/app/universal-industry-core/page.tsx"
$mobilePath = Join-Path $RepoRoot "apps/mobile/lib/features/universal_industry_core/universal_industry_core_screen.dart"

foreach ($path in @($modulePath, $appModulePath, $webPath, $mobilePath)) {
  if (-not (Test-Path -LiteralPath $path)) {
    throw "Missing integration target: $path"
  }
}

$module = Get-Content -LiteralPath $modulePath -Raw
$appModule = Get-Content -LiteralPath $appModulePath -Raw

$checks = [ordered]@{
  controller = $module -match "UniversalIndustryCoreController"
  service = $module -match "UniversalIndustryCoreService"
  export = $module -match "exports:\s*\[UniversalIndustryCoreService\]"
  appRegistration = $appModule -match "UniversalIndustryCoreModule"
  web = Test-Path -LiteralPath $webPath
  mobile = Test-Path -LiteralPath $mobilePath
}

$failed = @(
  $checks.GetEnumerator() |
    Where-Object { -not $_.Value }
)

if ($failed.Count -gt 0) {
  throw "Integration failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success = $true
  system = "AVOS Universal Industry Core V1"
  integrationTests = "passed"
  checks = $checks.Count
} | Format-List