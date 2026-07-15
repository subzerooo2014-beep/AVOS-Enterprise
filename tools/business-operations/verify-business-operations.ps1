param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$s=Get-Content (
  Join-Path $RepoRoot "apps/api/src/business-operations/business-operations.service.ts"
) -Raw

$checks=[ordered]@{
  workshops=$s-match"createWorkshopBooking"
  warranty=$s-match"createWarranty"
  claims=$s-match"createWarrantyClaim"
  parts=$s-match"createPartsOrder"
  support=$s-match"createSupportTicket"
  loyalty=$s-match"awardLoyaltyPoints"
  referrals=$s-match"createReferral"
  payments=$s-match"createPayment"
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
  businessOperations=$true
}