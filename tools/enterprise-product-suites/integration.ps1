param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$module=Get-Content (
  Join-Path $RepoRoot "apps/api/src/enterprise-product-suites/enterprise-product-suites.module.ts"
) -Raw

$appModule=Get-Content (
  Join-Path $RepoRoot "apps/api/src/app.module.ts"
) -Raw

$checks=[ordered]@{
  controller=$module-match"EnterpriseProductSuitesController"
  orchestrator=$module-match"EnterpriseProductSuitesService"
  crm=$module-match"EnterpriseCrmSuiteService"
  erp=$module-match"EnterpriseErpSuiteService"
  marketplace=$module-match"MarketplaceSuiteService"
  ai=$module-match"AiEnterpriseSuiteService"
  industryPacks=$module-match"IndustryPacksSuiteService"
  saas=$module-match"GlobalSaasSuiteService"
  appModule=$appModule-match"EnterpriseProductSuitesModule"
  web=Test-Path(Join-Path $RepoRoot "apps/web/src/app/enterprise-product-suites/page.tsx")
  mobile=Test-Path(Join-Path $RepoRoot "apps/mobile/lib/features/enterprise_product_suites/enterprise_product_suites_screen.dart")
}

$failed=@($checks.GetEnumerator()|Where-Object{-not $_.Value})

if($failed.Count){
  throw "Integration failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success=$true
  integrationTests="passed"
  checks=$checks.Count
}|Format-List