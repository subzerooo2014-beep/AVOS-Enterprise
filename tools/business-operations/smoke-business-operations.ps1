param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$c=Get-Content (
  Join-Path $RepoRoot "apps/api/src/business-operations/business-operations.controller.ts"
) -Raw

$routes=@(
  '@Controller("business-operations")',
  '@Post("workshops/bookings")',
  '@Patch("workshops/bookings/:id/status")',
  '@Post("warranties")',
  '@Post("warranties/claims")',
  '@Patch("warranties/claims/:id/status")',
  '@Post("parts/orders")',
  '@Post("support/tickets")',
  '@Patch("support/tickets/:id/status")',
  '@Post("loyalty/:customerId/points")',
  '@Post("referrals")',
  '@Post("payments")',
  '@Patch("payments/:id/status")',
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