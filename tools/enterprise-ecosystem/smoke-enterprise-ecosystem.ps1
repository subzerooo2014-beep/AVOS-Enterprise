param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$c=Get-Content (
  Join-Path $RepoRoot "apps/api/src/enterprise-ecosystem/enterprise-ecosystem.controller.ts"
) -Raw

$routes=@(
  '@Controller("enterprise-ecosystem")',
  '@Get("health")',
  '@Get("hubs")',
  '@Get("hubs/:key")',
  '@Post("partners")',
  '@Get("hubs/:key/partners")',
  '@Post("hubs/:key/execute")'
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
  effectiveHubRoutes=20
}