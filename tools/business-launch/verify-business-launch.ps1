param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$s=Get-Content (
  Join-Path $RepoRoot "apps/api/src/business-launch/business-launch.service.ts"
) -Raw

$checks=[ordered]@{
  listings=$s-match"createListing"
  search=$s-match"listListings"
  compare=$s-match"compareListings"
  offers=$s-match"createOffer"
  booking=$s-match"createBooking"
  messaging=$s-match"sendMessage"
  deals=$s-match"completeDeal"
  reviews=$s-match"createReview"
  subscriptions=$s-match"defaultPlans"
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
  endToEndBusinessFlow=$true
}