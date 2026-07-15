param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$module=Get-Content (
  Join-Path $RepoRoot "apps/api/src/grand-business-product/grand-business-product.module.ts"
) -Raw

$appModule=Get-Content (
  Join-Path $RepoRoot "apps/api/src/app.module.ts"
) -Raw

$checks=[ordered]@{
  controller=$module-match"GrandBusinessProductController"
  service=$module-match"GrandBusinessProductService"
  exported=$module-match"exports:\s*\[GrandBusinessProductService\]"
  appModule=$appModule-match"GrandBusinessProductModule"
  webPage=Test-Path(Join-Path $RepoRoot "apps/web/src/app/grand-business-product/page.tsx")
  mobileScreen=Test-Path(Join-Path $RepoRoot "apps/mobile/lib/features/grand_business_product/grand_business_product_screen.dart")
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