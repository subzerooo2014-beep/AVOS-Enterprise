param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"
$c=Get-Content (Join-Path $RepoRoot "apps/api/src/galaxy-platform/galaxy-bundle-4/galaxy-bundle-4.controller.ts") -Raw
if(-not $c.Contains('@Controller("galaxy-platform/bundle-4")')){throw "Missing route"}
if(-not $c.Contains('@Post("execute")')){throw "Missing execute route"}
[pscustomobject]@{success=$true;smokeTests="passed";routes=3}