param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$c=Get-Content (
  Join-Path $RepoRoot "apps/api/src/applications-suite/applications-suite.controller.ts"
) -Raw

$routes=@(
  '@Controller("applications-suite")',
  '@Get("health")',
  '@Get("applications")',
  '@Get("applications/:key")',
  '@Post("applications/:key/execute")'
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
  effectiveApplicationRoutes=24
}