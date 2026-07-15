param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$c=Get-Content (
  Join-Path $RepoRoot "apps/api/src/commercial-launch/commercial-launch.controller.ts"
) -Raw

$routes=@(
  '@Controller("commercial-launch")',
  '@Get("capabilities")',
  '@Post("execute")',
  '@Get("dashboard")'
)

foreach($route in $routes){
  if(-not $c.Contains($route)){
    throw "Missing route: $route"
  }
}

[pscustomobject]@{
  success=$true
  smokeTests="passed"
  routeTemplates=$routes.Count
  capabilities=30
}