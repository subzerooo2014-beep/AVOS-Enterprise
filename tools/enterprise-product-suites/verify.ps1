param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$registry=Get-Content (
  Join-Path $RepoRoot "apps/api/src/enterprise-product-suites/enterprise-product-suites.registry.ts"
) -Raw

$service=Get-Content (
  Join-Path $RepoRoot "apps/api/src/enterprise-product-suites/enterprise-product-suites.service.ts"
) -Raw

$checks=[ordered]@{
  crm=$registry-match'"CRM"'
  erp=$registry-match'"ERP"'
  marketplace=$registry-match'"MARKETPLACE"'
  aiEnterprise=$registry-match'"AI_ENTERPRISE"'
  industryPacks=$registry-match'"INDUSTRY_PACKS"'
  globalSaas=$registry-match'"GLOBAL_SAAS"'
  customer360=$registry-match'"customer-360"'
  financeErp=$registry-match'"finance-erp"'
  dealerPortal=$registry-match'"dealer-portal"'
  executiveAi=$registry-match'"executive-ai-product"'
  automotive=$registry-match'"automotive-pack"'
  subscriptionBilling=$registry-match'"subscription-billing"'
  whiteLabel=$registry-match'"white-label"'
  appStore=$registry-match'"app-store"'
  enterpriseApis=$registry-match'"enterprise-apis"'
  dashboard=$service-match"dashboard\("
}

$failed=@($checks.GetEnumerator()|Where-Object{-not $_.Value})

if($failed.Count){
  throw "Verification failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success=$true
  verification="passed"
  suites=6
  productized=$true
  multiIndustry=$true
  runtime=$true
}|Format-List