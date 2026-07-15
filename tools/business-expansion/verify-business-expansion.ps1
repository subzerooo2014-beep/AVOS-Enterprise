param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$s=Get-Content (
  Join-Path $RepoRoot "apps/api/src/business-expansion/business-expansion.service.ts"
) -Raw

$checks=[ordered]@{
  auctions=$s-match"createAuction"
  bids=$s-match"placeBid"
  finance=$s-match"createFinanceApplication"
  insurance=$s-match"createInsuranceQuote"
  inspection=$s-match"createInspection"
  export=$s-match"createShipment"
  dealerSuite=$s-match"createLead"
  monetization=$s-match"recordMonetization"
  dashboard=$s-match"dashboard"
}

$failed=@($checks.GetEnumerator()|Where-Object{-not $_.Value})

if($failed.Count){
  throw "Verification failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success=$true
  verification="passed"
  capabilities=$checks.Count
  businessExpansion=$true
}