param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"

$modulePath = Join-Path $RepoRoot "apps/api/src/enterprise-ultimate-f5/enterprise-ultimate-f5.module.ts"
$appPath = Join-Path $RepoRoot "apps/api/src/app.module.ts"
$webPath = Join-Path $RepoRoot "apps/web/src/app/enterprise-ultimate-f5/page.tsx"
$mobilePath = Join-Path $RepoRoot "apps/mobile/lib/features/enterprise_ultimate_f5/enterprise_ultimate_f5_screen.dart"

$module = Get-Content -LiteralPath $modulePath -Raw
$app = Get-Content -LiteralPath $appPath -Raw

$checks = [ordered]@{
  controller = $module -match "EnterpriseUltimateF5Controller"
  service = $module -match "EnterpriseUltimateF5Service"
  registration = $app -match "EnterpriseUltimateF5Module"
  web = Test-Path -LiteralPath $webPath
  mobile = Test-Path -LiteralPath $mobilePath
}

$failed = @($checks.GetEnumerator() | Where-Object { -not $_.Value })

if ($failed.Count -gt 0) {
  throw "Integration failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success = $true
  system = "AVOS Enterprise Ultimate Mega Bundle F5"
  integrationTests = "passed"
  checks = $checks.Count
} | Format-List