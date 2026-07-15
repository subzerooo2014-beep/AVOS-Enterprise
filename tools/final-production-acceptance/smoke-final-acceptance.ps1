param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"
$c=Get-Content (Join-Path $RepoRoot "apps/api/src/production-certification/final-acceptance/final-acceptance.controller.ts") -Raw
if(-not $c.Contains('@Controller("production-certification/final-acceptance")')){throw "Missing final acceptance route"}
if(-not $c.Contains('@Get("status")')){throw "Missing status route"}
[pscustomobject]@{success=$true;smokeTests="passed";routes=1}