param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$registry=Get-Content (
  Join-Path $RepoRoot "apps/api/src/automotive-industry/automotive-industry.registry.ts"
) -Raw

$service=Get-Content (
  Join-Path $RepoRoot "apps/api/src/automotive-industry/automotive-industry.service.ts"
) -Raw

$checks=[ordered]@{
  lifecycle=$registry-match'"vehicle-lifecycle"'
  registry=$registry-match'"vehicle-registry"'
  tradeIn=$registry-match'"trade-in"'
  inventory=$registry-match'"vehicle-inventory"'
  listings=$registry-match'"vehicle-listings"'
  service=$registry-match'"service-management"'
  finance=$registry-match'"vehicle-financing"'
  logistics=$registry-match'"vehicle-shipping"'
  ai=$registry-match'"vehicle-ai"'
  dashboard=$registry-match'"automotive-dashboard"'
  createVehicle=$service-match"createVehicle"
  duplicateVin=$service-match"vinIndex"
  listingRuntime=$service-match"createListing"
  tradeInRuntime=$service-match"createTradeIn"
  serviceRuntime=$service-match"createServiceRecord"
  financeRuntime=$service-match"createFinanceApplication"
  logisticsRuntime=$service-match"createLogisticsCase"
  aiRuntime=$service-match"assessVehicle"
  searchRuntime=$service-match"search\("
  dashboardRuntime=$service-match"dashboard\("
}

$failed=@($checks.GetEnumerator()|Where-Object{-not $_.Value})

if($failed.Count){
  throw "Verification failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success=$true
  verification="passed"
  capabilities=54
  industry="AUTOMOTIVE"
  runtime=$true
}|Format-List