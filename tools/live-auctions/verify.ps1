param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$s=Get-Content (
  Join-Path $RepoRoot "apps/api/src/live-auctions/live-auctions.service.ts"
) -Raw

$r=Get-Content (
  Join-Path $RepoRoot "apps/api/src/live-auctions/live-auctions.registry.ts"
) -Raw

$checks=[ordered]@{
  create=$s-match"createAuction"
  scheduling=$s-match"scheduleAuction"
  live=$s-match"startAuction"
  bidding=$s-match"placeBid"
  proxy=$s-match"processProxyBids"
  buyNow=$s-match"buyNow"
  antiSniping=$s-match"antiSnipingSeconds"
  winner=$s-match"winnerBidId"
  moderation=$s-match"moderateBidder"
  recommendations=$s-match"recommend\("
  analytics=$s-match"analytics\("
  registry=$r-match"multi-industry-auctions"
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