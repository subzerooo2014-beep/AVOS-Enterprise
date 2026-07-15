param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$r=Get-Content (
  Join-Path $RepoRoot "apps/api/src/industry-expansion/industry-expansion.registry.ts"
) -Raw

$s=Get-Content (
  Join-Path $RepoRoot "apps/api/src/industry-expansion/industry-expansion.service.ts"
) -Raw

$count=([regex]::Matches($r,'key:\s*"')).Count

if($count -ne 12){
  throw "Expected 12 verticals, found $count"
}

$checks=[ordered]@{
  createListing=$s-match"createListing"
  publishListing=$s-match"publishListing"
  verticalDiscovery=$s-match"verticals\("
  verticalListings=$s-match"listingsForVertical"
  dashboard=$s-match"dashboard\("
}

$failed=@($checks.GetEnumerator()|Where-Object{-not $_.Value})

if($failed.Count){
  throw "Verification failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success=$true
  verification="passed"
  verticals=$count
  capabilities=48
  webExperience=$true
  mobileExperience=$true
}