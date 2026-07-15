param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"
$c=Get-Content (Join-Path $RepoRoot "apps/api/src/titan-platform/titan-bundle-2/titan-bundle-2.controller.ts") -Raw
@('@Controller("titan-platform/bundle-2")','@Get("health")','@Get("capabilities")','@Get("executions")','@Post("execute")')|
ForEach-Object{if(-not $c.Contains($_)){throw "Missing route $_"}}
[pscustomobject]@{success=$true;smokeTests="passed";routes=5}