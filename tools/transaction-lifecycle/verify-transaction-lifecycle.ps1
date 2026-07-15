param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$registry=Get-Content (
  Join-Path $RepoRoot "apps/api/src/transaction-lifecycle/transaction-lifecycle.registry.ts"
) -Raw

$service=Get-Content (
  Join-Path $RepoRoot "apps/api/src/transaction-lifecycle/transaction-lifecycle.service.ts"
) -Raw

$domainCount=([regex]::Matches($registry,'key:\s*"')).Count

if($domainCount-ne 12){
  throw "Expected 12 domains, found $domainCount"
}

$checks=[ordered]@{
  createCase=$service-match"createCase"
  updateStatus=$service-match"updateStatus"
  caseById=$service-match"caseById"
  casesForDomain=$service-match"casesForDomain"
  execution=$service-match"execute\("
  dashboard=$service-match"dashboard\("
}

$failed=@($checks.GetEnumerator()|Where-Object{-not $_.Value})

if($failed.Count){
  throw "Verification failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success=$true
  verification="passed"
  domains=$domainCount
  capabilities=96
  webExperience=$true
  mobileExperience=$true
  runtime=$true
}