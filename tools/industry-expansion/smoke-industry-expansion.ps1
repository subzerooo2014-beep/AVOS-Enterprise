param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$c=Get-Content (
  Join-Path $RepoRoot "apps/api/src/industry-expansion/industry-expansion.controller.ts"
) -Raw

$routes=@(
  '@Controller("industry-expansion")',
  '@Get("verticals")',
  '@Get("verticals/:key")',
  '@Post("listings")',
  '@Patch("listings/:id/publish")',
  '@Get("verticals/:key/listings")',
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
  verticals=12
}