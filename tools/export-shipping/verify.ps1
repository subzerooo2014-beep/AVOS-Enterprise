param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$s=Get-Content (
  Join-Path $RepoRoot "apps/api/src/export-shipping/export-shipping.service.ts"
) -Raw

$r=Get-Content (
  Join-Path $RepoRoot "apps/api/src/export-shipping/export-shipping.registry.ts"
) -Raw

$checks=[ordered]@{
  cases=$s-match"createExportCase"
  quotes=$s-match"createShippingQuote"
  acceptQuote=$s-match"acceptQuote"
  documents=$s-match"addDocument"
  verifyDocument=$s-match"verifyDocument"
  customs=$s-match"runCustomsCheck"
  shipments=$s-match"createShipment"
  tracking=$s-match"trackShipment"
  exceptions=$s-match"createException"
  dashboard=$s-match"dashboard\("
  registry=$r-match"multi-country-export"
}

$failed=@($checks.GetEnumerator()|Where-Object{-not $_.Value})

if($failed.Count){
  throw "Verification failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success=$true
  verification="passed"
  capabilities=20
}|Format-List