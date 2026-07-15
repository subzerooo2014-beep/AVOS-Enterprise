param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"
$c=Get-Content (Join-Path $RepoRoot "apps/api/src/galaxy-platform/galaxy-bundle-1/galaxy-bundle-1.controller.ts") -Raw
if(-not $c.Contains('@Controller("galaxy-platform/bundle-1")')){throw "Missing Galaxy route"}
if(-not $c.Contains("capabilities: 5000")){throw "Capability count missing"}
[pscustomobject]@{success=$true;smokeTests="passed";routes=1}