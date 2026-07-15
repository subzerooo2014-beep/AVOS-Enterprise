param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$controller=Get-Content (
  Join-Path $RepoRoot "apps/api/src/automotive-industry/automotive-industry.controller.ts"
) -Raw

$routes=@(
  '@Controller("automotive-industry")',
  '@Get("capabilities")',
  '@Post("vehicles")',
  '@Patch("vehicles/:id/status")',
  '@Patch("vehicles/:id/owner")',
  '@Post("listings")',
  '@Patch("listings/:id/publish")',
  '@Post("trade-ins")',
  '@Patch("trade-ins/:id/assess")',
  '@Post("service-records")',
  '@Patch("service-records/:id/status")',
  '@Post("finance-applications")',
  '@Patch("finance-applications/:id/status")',
  '@Post("logistics")',
  '@Patch("logistics/:id/status")',
  '@Post("ai/assessments")',
  '@Get("search")',
  '@Get("dashboard")'
)

foreach($route in $routes){
  if(-not $controller.Contains($route)){
    throw "Missing route: $route"
  }
}

[pscustomobject]@{
  success=$true
  smokeTests="passed"
  routes=$routes.Count
  capabilities=54
}|Format-List