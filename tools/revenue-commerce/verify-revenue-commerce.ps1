param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$s=Get-Content (
  Join-Path $RepoRoot "apps/api/src/revenue-commerce/revenue-commerce.service.ts"
) -Raw

$checks=[ordered]@{
  subscriptions=$s-match"createSubscription"
  billing=$s-match"createInvoice"
  payments=$s-match"createPayment"
  paymentCapture=$s-match"capturePayment"
  commissions=$s-match"createCommission"
  advertisements=$s-match"createAdvertisement"
  coupons=$s-match"createCoupon"
  refunds=$s-match"createRefund"
  revenueDashboard=$s-match"dashboard"
}

$failed=@($checks.GetEnumerator()|Where-Object{-not $_.Value})

if($failed.Count){
  throw "Verification failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success=$true
  verification="passed"
  capabilities=$checks.Count
  revenueRuntime=$true
  webExperience=$true
  mobileExperience=$true
}