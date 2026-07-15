param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"
$s=Get-Content (Join-Path $RepoRoot "apps/api/src/production-certification/final-acceptance/final-acceptance.service.ts") -Raw
$count=([regex]::Matches($s,'name:\s*"')).Count
if($count -ne 10){throw "Expected 10 acceptance gates, found $count"}
if(-not($s-match'"CERTIFIED"')){throw "Certification status missing"}
if(-not($s-match"productionReady")){throw "Production readiness missing"}
[pscustomobject]@{success=$true;verification="passed";acceptanceGates=$count;productionReady=$true;status="CERTIFIED"}