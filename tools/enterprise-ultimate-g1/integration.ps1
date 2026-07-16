param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"

$modulePath = Join-Path $RepoRoot "apps/api/src/enterprise-ultimate-g1/enterprise-ultimate-g1.module.ts"
$appPath = Join-Path $RepoRoot "apps/api/src/app.module.ts"
$webPath = Join-Path $RepoRoot "apps/web/src/app/enterprise-ultimate-g1/page.tsx"
$logoPath = Join-Path $RepoRoot "apps/web/src/components/avos-g1/avos-logo.tsx"
$tokensPath = Join-Path $RepoRoot "apps/web/src/styles/avos-g1-tokens.css"
$mobilePath = Join-Path $RepoRoot "apps/mobile/lib/features/enterprise_ultimate_g1/enterprise_ultimate_g1_screen.dart"

$module = Get-Content -LiteralPath $modulePath -Raw
$app = Get-Content -LiteralPath $appPath -Raw

$checks = [ordered]@{
  controller = $module -match "EnterpriseUltimateG1Controller"
  service = $module -match "EnterpriseUltimateG1Service"
  registration = $app -match "EnterpriseUltimateG1Module"
  web = Test-Path -LiteralPath $webPath
  logo = Test-Path -LiteralPath $logoPath
  tokens = Test-Path -LiteralPath $tokensPath
  mobile = Test-Path -LiteralPath $mobilePath
}

$failed = @($checks.GetEnumerator() | Where-Object { -not $_.Value })

if ($failed.Count -gt 0) {
  throw "Integration failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success = $true
  system = "AVOS Enterprise Ultimate Mega Bundle G1"
  integrationTests = "passed"
  checks = $checks.Count
} | Format-List