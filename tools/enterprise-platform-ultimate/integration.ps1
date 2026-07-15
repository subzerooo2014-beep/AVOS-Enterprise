param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"

$modulePath = Join-Path $RepoRoot "apps/api/src/enterprise-platform-ultimate/enterprise-platform-ultimate.module.ts"
$appModulePath = Join-Path $RepoRoot "apps/api/src/app.module.ts"
$webPath = Join-Path $RepoRoot "apps/web/src/app/enterprise-platform-ultimate/page.tsx"
$mobilePath = Join-Path $RepoRoot "apps/mobile/lib/features/enterprise_platform_ultimate/enterprise_platform_ultimate_screen.dart"

$module = Get-Content -LiteralPath $modulePath -Raw
$app = Get-Content -LiteralPath $appModulePath -Raw

$checks = @{
  controller = $module -match "EnterprisePlatformUltimateController"
  service = $module -match "EnterprisePlatformUltimateService"
  export = $module -match "exports:\s*\[EnterprisePlatformUltimateService\]"
  registration = $app -match "EnterprisePlatformUltimateModule"
  web = Test-Path -LiteralPath $webPath
  mobile = Test-Path -LiteralPath $mobilePath
}

$failed = @($checks.GetEnumerator() | Where-Object { -not $_.Value })

if ($failed.Count) {
  throw "Integration failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success = $true
  system = "AVOS Enterprise Platform Ultimate Bundle V1"
  integrationTests = "passed"
  checks = $checks.Count
} | Format-List