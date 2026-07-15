param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$module=Get-Content (
  Join-Path $RepoRoot "apps/api/src/industry-customer-growth/industry-customer-growth.module.ts"
) -Raw

$appModule=Get-Content (
  Join-Path $RepoRoot "apps/api/src/app.module.ts"
) -Raw

$checks=[ordered]@{
  controller=$module-match"IndustryCustomerGrowthController"
  service=$module-match"IndustryCustomerGrowthService"
  exported=$module-match"exports:\s*\[IndustryCustomerGrowthService\]"
  appModule=$appModule-match"IndustryCustomerGrowthModule"
  webPage=Test-Path(Join-Path $RepoRoot "apps/web/src/app/industry-customer-growth/page.tsx")
  mobileScreen=Test-Path(Join-Path $RepoRoot "apps/mobile/lib/features/industry_customer_growth/industry_customer_growth_screen.dart")
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