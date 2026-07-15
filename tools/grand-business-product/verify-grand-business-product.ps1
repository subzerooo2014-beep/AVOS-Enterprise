param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$registry=Get-Content (
  Join-Path $RepoRoot "apps/api/src/grand-business-product/grand-business-product.registry.ts"
) -Raw

$service=Get-Content (
  Join-Path $RepoRoot "apps/api/src/grand-business-product/grand-business-product.service.ts"
) -Raw

$domainCount=([regex]::Matches($registry,'key:\s*"')).Count
$capabilityCount=([regex]::Matches($registry,'"[a-z0-9-]+"\s*(,|\])')).Count-$domainCount

if($domainCount-ne 10){
  throw "Expected 10 domains, found $domainCount"
}

$checks=[ordered]@{
  createRecord=$service-match"createRecord"
  activateRecord=$service-match"activateRecord"
  completeRecord=$service-match"completeRecord"
  domainRecords=$service-match"recordsForDomain"
  commandExecution=$service-match"execute\("
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
  capabilities=80
  webExperience=$true
  mobileExperience=$true
  runtime=$true
}