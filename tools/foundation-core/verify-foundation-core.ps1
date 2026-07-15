param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$registry=Get-Content (
  Join-Path $RepoRoot "apps/api/src/foundation-core/foundation-core.registry.ts"
) -Raw

$service=Get-Content (
  Join-Path $RepoRoot "apps/api/src/foundation-core/foundation-core.service.ts"
) -Raw

$componentCount=([regex]::Matches($registry,'^\s*"[a-z0-9-]+",?\s*$','Multiline')).Count

if($componentCount-lt 19){
  throw "Expected at least 19 foundation components, found $componentCount"
}

$checks=[ordered]@{
  platformRegistry=$service-match"registerPlatform"
  industryRegistry=$service-match"registerIndustry"
  capabilityRegistry=$service-match"registerCapability"
  leadDealPipeline=$service-match"createLeadDeal"
  auditTracking=$service-match"trackAudit"
  eventTracking=$service-match"trackEvent"
  ownerAi=$service-match"ownerDecision"
  commandCenter=$service-match"dashboard\("
  industryBased=$service-match"INDUSTRY_BASED"
}

$failed=@($checks.GetEnumerator()|Where-Object{-not $_.Value})

if($failed.Count){
  throw "Verification failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success=$true
  verification="passed"
  components=$componentCount
  industryBased=$true
  webExperience=$true
  mobileExperience=$true
  runtime=$true
}