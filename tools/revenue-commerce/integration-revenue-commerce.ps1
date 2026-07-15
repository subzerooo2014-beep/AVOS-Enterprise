param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$m=Get-Content (
  Join-Path $RepoRoot "apps/api/src/revenue-commerce/revenue-commerce.module.ts"
) -Raw

$a=Get-Content (
  Join-Path $RepoRoot "apps/api/src/app.module.ts"
) -Raw

$checks=[ordered]@{
  controller=$m-match"RevenueCommerceController"
  service=$m-match"RevenueCommerceService"
  exported=$m-match"exports:\s*\[RevenueCommerceService\]"
  appModule=$a-match"RevenueCommerceModule"
  webPage=Test-Path(Join-Path $RepoRoot "apps/web/src/app/revenue-commerce/page.tsx")
  mobileScreen=Test-Path(Join-Path $RepoRoot "apps/mobile/lib/features/revenue_commerce/revenue_commerce_screen.dart")
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