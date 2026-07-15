param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"
$r=Get-Content (Join-Path $RepoRoot "apps/api/src/galaxy-platform/galaxy-bundle-3/galaxy-bundle-3.registry.ts") -Raw
$s=Get-Content (Join-Path $RepoRoot "apps/api/src/galaxy-platform/galaxy-bundle-3/galaxy-bundle-3.service.ts") -Raw
$count=([regex]::Matches($r,'capability:\s*"')).Count
if($count -ne 30){throw "Expected 30 strategic capabilities, found $count"}
if(-not($s-match"execute\\(")){throw "Executable runtime missing"}
[pscustomobject]@{success=$true;verification="passed";capabilities=$count;executableRuntime=$true}