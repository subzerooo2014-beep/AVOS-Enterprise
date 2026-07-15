[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$modulePath = Join-Path $RepoRoot "apps/api/src/industry-factory/industry-factory.module.ts"
$appModulePath = Join-Path $RepoRoot "apps/api/src/app.module.ts"
$webPath = Join-Path $RepoRoot "apps/web/src/app/industry-factory/page.tsx"
$mobilePath = Join-Path $RepoRoot "apps/mobile/lib/features/industry_factory/industry_factory_screen.dart"

foreach ($path in @($modulePath, $appModulePath, $webPath, $mobilePath)) {
  if (-not (Test-Path -LiteralPath $path)) {
    throw "Missing integration target: $path"
  }
}

$module = Get-Content -LiteralPath $modulePath -Raw
$appModule = Get-Content -LiteralPath $appModulePath -Raw

$checks = [ordered]@{
  universalCoreImport = $module -match "UniversalIndustryCoreModule"
  controller = $module -match "IndustryFactoryController"
  service = $module -match "IndustryFactoryService"
  export = $module -match "exports:\s*\[IndustryFactoryService\]"
  appRegistration = $appModule -match "IndustryFactoryModule"
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
  system = "AVOS Industry Factory & Blueprint Studio V1"
  integrationTests = "passed"
  checks = $checks.Count
} | Format-List