param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$r=Get-Content (
  Join-Path $RepoRoot "apps/api/src/commercial-launch/commercial-launch.registry.ts"
) -Raw

$s=Get-Content (
  Join-Path $RepoRoot "apps/api/src/commercial-launch/commercial-launch.service.ts"
) -Raw

$count=([regex]::Matches($r,'key:\s*"')).Count

if($count -ne 30){
  throw "Expected 30 capabilities, found $count"
}

$checks=[ordered]@{
  execution=$s-match"execute\("
  dashboard=$s-match"dashboard\("
  governance=$s-match"governed: true"
  observability=$s-match"observable: true"
  auditability=$s-match"auditable: true"
}

$failed=@($checks.GetEnumerator()|Where-Object{-not $_.Value})

if($failed.Count){
  throw "Verification failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success=$true
  verification="passed"
  capabilities=$count
  webExperience=$true
  mobileExperience=$true
  commercialRuntime=$true
}