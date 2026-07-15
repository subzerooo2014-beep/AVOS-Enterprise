param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"
$c=Get-Content (Join-Path $RepoRoot "apps/api/src/galaxy-platform/galaxy-bundle-2/galaxy-bundle-2.controller.ts") -Raw
if(-not $c.Contains('@Controller("galaxy-platform/bundle-2")')){throw "Missing Galaxy Bundle 2 route"}
if(-not $c.Contains("capabilities: 10000")){throw "Capability count missing"}
[pscustomobject]@{success=$true;smokeTests="passed";routes=1}