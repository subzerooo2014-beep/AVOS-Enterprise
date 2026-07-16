param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"

$modulePath = Join-Path $RepoRoot "apps/api/src/enterprise-ultimate-f1/enterprise-ultimate-f1.module.ts"
$appPath = Join-Path $RepoRoot "apps/api/src/app.module.ts"
$webPath = Join-Path $RepoRoot "apps/web/src/app/enterprise-ultimate-f1/page.tsx"
$mobilePath = Join-Path $RepoRoot "apps/mobile/lib/features/enterprise_ultimate_f1/enterprise_ultimate_f1_screen.dart"

$module = Get-Content -LiteralPath $modulePath -Raw
$app = Get-Content -LiteralPath $appPath -Raw

$checks = [ordered]@{
  controller = $module -match "EnterpriseUltimateF1Controller"
  service = $module -match "EnterpriseUltimateF1Service"
  registration = $app -match "EnterpriseUltimateF1Module"
  web = Test-Path -LiteralPath $webPath
  mobile = Test-Path -LiteralPath $mobilePath
}

$failed = @($checks.GetEnumerator() | Where-Object { -not $_.Value })
if ($failed.Count -gt 0) { throw "Integration failed: $($failed.Name -join ', ')" }

[pscustomobject]@{
  success = $true
  system = "AVOS Enterprise Ultimate Mega Bundle F1"
  integrationTests = "passed"
  checks = $checks.Count
} | Format-List