param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$c=Get-Content (
  Join-Path $RepoRoot "apps/api/src/business-expansion/business-expansion.controller.ts"
) -Raw

$routes=@(
  '@Controller("business-expansion")',
  '@Post("auctions")',
  '@Patch("auctions/:id/start")',
  '@Post("auctions/bids")',
  '@Patch("auctions/:id/end")',
  '@Post("finance")',
  '@Patch("finance/:id/status")',
  '@Post("insurance")',
  '@Patch("insurance/:id/select")',
  '@Post("inspections")',
  '@Patch("inspections/:id/complete")',
  '@Post("shipments")',
  '@Patch("shipments/:id/status")',
  '@Post("dealer/leads")',
  '@Patch("dealer/leads/:id/status")',
  '@Post("monetization")',
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
  routes=$routes.Count
}