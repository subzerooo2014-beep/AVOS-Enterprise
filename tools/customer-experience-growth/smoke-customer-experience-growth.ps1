param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$c=Get-Content (
  Join-Path $RepoRoot "apps/api/src/customer-experience-growth/customer-experience-growth.controller.ts"
) -Raw

$routes=@(
  '@Controller("customer-experience-growth")',
  '@Post("customers")',
  '@Get("customers/:customerId")',
  '@Post("journeys")',
  '@Patch("journeys/:id/stage")',
  '@Post("campaigns")',
  '@Patch("campaigns/:id/launch")',
  '@Post("notifications")',
  '@Patch("notifications/:id/sent")',
  '@Post("referrals")',
  '@Patch("referrals/:id/qualify")',
  '@Post("loyalty")',
  '@Post("recommendations")',
  '@Get("recommendations/:customerId")',
  '@Post("metrics")',
  '@Get("metrics")',
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