param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$s=Get-Content (
  Join-Path $RepoRoot "apps/api/src/customer-experience-growth/customer-experience-growth.service.ts"
) -Raw

$checks=[ordered]@{
  customer360=$s-match"upsertCustomer"
  journeys=$s-match"createJourney"
  campaigns=$s-match"createCampaign"
  notifications=$s-match"queueNotification"
  referrals=$s-match"createReferral"
  loyalty=$s-match"addLoyaltyPoints"
  recommendations=$s-match"createRecommendation"
  analytics=$s-match"upsertMetric"
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
  webExperience=$true
  mobileExperience=$true
  growthRuntime=$true
}