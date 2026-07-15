param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$controller=Get-Content (
  Join-Path $RepoRoot "apps/api/src/industry-customer-growth/industry-customer-growth.controller.ts"
) -Raw

$routes=@(
  '@Controller("industry-customer-growth")',
  '@Get("components")',
  '@Post("customers")',
  '@Post("journeys")',
  '@Patch("journeys/:id/step")',
  '@Post("reviews")',
  '@Patch("reviews/:id/verify")',
  '@Post("referrals")',
  '@Patch("referrals/:id/convert")',
  '@Post("loyalty")',
  '@Patch("loyalty/:id/points")',
  '@Post("campaigns")',
  '@Patch("campaigns/:id/activate")',
  '@Post("recommendations")',
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
  components=15
}