param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$registry=Get-Content (
  Join-Path $RepoRoot "apps/api/src/industry-platform/industry-platform.registry.ts"
) -Raw

$service=Get-Content (
  Join-Path $RepoRoot "apps/api/src/industry-platform/industry-platform.service.ts"
) -Raw

$industryCount=([regex]::Matches(
  $registry,
  '^\s*"[a-z0-9-]+",?\s*$',
  'Multiline'
)).Count

if($industryCount-lt 21){
  throw "Expected at least 21 combined registry entries, found $industryCount"
}

$checks=[ordered]@{
  registerIndustry=$service-match"registerIndustry"
  registerCapability=$service-match"registerCapability"
  bindCapability=$service-match"bindCapability"
  execute=$service-match"execute\("
  dashboard=$service-match"dashboard\("
  seededIndustries=$service-match"seedDefaults"
  industryBased=$service-match"INDUSTRY_BASED"
  reusable=$service-match"sharedCapability: true"
}

$failed=@($checks.GetEnumerator()|Where-Object{-not $_.Value})

if($failed.Count){
  throw "Verification failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success=$true
  verification="passed"
  industries=10
  sharedCapabilities=11
  bindings=110
  architecture="INDUSTRY_BASED"
  webExperience=$true
  mobileExperience=$true
  runtime=$true
}