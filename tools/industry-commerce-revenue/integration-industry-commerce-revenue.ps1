param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$module=Get-Content (
  Join-Path $RepoRoot "apps/api/src/industry-commerce-revenue/industry-commerce-revenue.module.ts"
) -Raw

$appModule=Get-Content (
  Join-Path $RepoRoot "apps/api/src/app.module.ts"
) -Raw

$checks=[ordered]@{
  controller=$module-match"IndustryCommerceRevenueController"
  service=$module-match"IndustryCommerceRevenueService"
  exported=$module-match"exports:\s*\[IndustryCommerceRevenueService\]"
  appModule=$appModule-match"IndustryCommerceRevenueModule"
  webPage=Test-Path(Join-Path $RepoRoot "apps/web/src/app/industry-commerce-revenue/page.tsx")
  mobileScreen=Test-Path(Join-Path $RepoRoot "apps/mobile/lib/features/industry_commerce_revenue/industry_commerce_revenue_screen.dart")
}

$failed=@($checks.GetEnumerator()|Where-Object{-not $_.Value})

if($failed.Count){
  throw "Integration failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success=$true
  integrationTests="passed"
  checks=$checks.Count
}