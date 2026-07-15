param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"
$r=Get-Content (Join-Path $RepoRoot "apps/api/src/galaxy-platform/galaxy-bundle-4/galaxy-bundle-4.registry.ts") -Raw
$s=Get-Content (Join-Path $RepoRoot "apps/api/src/galaxy-platform/galaxy-bundle-4/galaxy-bundle-4.service.ts") -Raw
$count=([regex]::Matches($r,'capability:\s*"')).Count
if($count -ne 50){throw "Expected 50 capabilities, found $count"}
if(-not($s-match"autonomous: true")){throw "Autonomous runtime missing"}
if(-not($s-match"auditable: true")){throw "Audit runtime missing"}
[pscustomobject]@{success=$true;verification="passed";capabilities=$count;autonomousRuntime=$true}