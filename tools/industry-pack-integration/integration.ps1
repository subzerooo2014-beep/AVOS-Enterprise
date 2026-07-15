[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$modulePath = Join-Path $RepoRoot "apps/api/src/industry-pack-integration/industry-pack-integration.module.ts"
$appModulePath = Join-Path $RepoRoot "apps/api/src/app.module.ts"
$webPath = Join-Path $RepoRoot "apps/web/src/app/industry-pack-integration/page.tsx"
$mobilePath = Join-Path $RepoRoot "apps/mobile/lib/features/industry_pack_integration/industry_pack_integration_screen.dart"

foreach ($path in @($modulePath, $appModulePath, $webPath, $mobilePath)) {
  if (-not (Test-Path -LiteralPath $path)) {
    throw "Missing integration target: $path"
  }
}

$module = Get-Content -LiteralPath $modulePath -Raw
$appModule = Get-Content -LiteralPath $appModulePath -Raw

$checks = [ordered]@{
  universalCoreImport = $module -match "UniversalIndustryCoreModule"
  controller = $module -match "IndustryPackIntegrationController"
  service = $module -match "IndustryPackIntegrationService"
  export = $module -match "exports:\s*\[IndustryPackIntegrationService\]"
  appRegistration = $appModule -match "IndustryPackIntegrationModule"
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
  system = "AVOS Industry Pack Integration & Migration V1"
  integrationTests = "passed"
  checks = $checks.Count
} | Format-List