param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$c=Get-Content (
  Join-Path $RepoRoot "apps/api/src/enterprise-runtime-v1/enterprise-runtime-v1.controller.ts"
) -Raw

$routes=@(
  '@Controller("enterprise-runtime/v1")',
  '@Get("health")',
  '@Get("capabilities")',
  '@Get("executions")',
  '@Post("execute")'
)

foreach($route in $routes){
  if(-not $c.Contains($route)){
    throw "Missing route: $route"
  }
}

[pscustomobject]@{
  success=$true
  smokeTests="passed"
  routes=$routes.Count
}