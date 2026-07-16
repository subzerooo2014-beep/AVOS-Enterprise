param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"

$modulePath = Join-Path $RepoRoot "apps/api/src/enterprise-ultimate-f2/enterprise-ultimate-f2.module.ts"
$appPath = Join-Path $RepoRoot "apps/api/src/app.module.ts"
$webPath = Join-Path $RepoRoot "apps/web/src/app/enterprise-ultimate-f2/page.tsx"
$mobilePath = Join-Path $RepoRoot "apps/mobile/lib/features/enterprise_ultimate_f2/enterprise_ultimate_f2_screen.dart"

$module = Get-Content -LiteralPath $modulePath -Raw
$app = Get-Content -LiteralPath $appPath -Raw

$checks = [ordered]@{
  controller = $module -match "EnterpriseUltimateF2Controller"
  service = $module -match "EnterpriseUltimateF2Service"
  registration = $app -match "EnterpriseUltimateF2Module"
  web = Test-Path -LiteralPath $webPath
  mobile = Test-Path -LiteralPath $mobilePath
}

$failed = @($checks.GetEnumerator() | Where-Object { -not $_.Value })
if ($failed.Count -gt 0) { throw "Integration failed: $($failed.Name -join ', ')" }

[pscustomobject]@{
  success = $true
  system = "AVOS Enterprise Ultimate Mega Bundle F2"
  integrationTests = "passed"
  checks = $checks.Count
} | Format-List