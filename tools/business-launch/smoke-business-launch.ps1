param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$c=Get-Content (
  Join-Path $RepoRoot "apps/api/src/business-launch/business-launch.controller.ts"
) -Raw

$routes=@(
  '@Controller("business-launch")',
  '@Post("listings")',
  '@Patch("listings/:id/publish")',
  '@Get("listings")',
  '@Post("listings/compare")',
  '@Post("offers")',
  '@Patch("offers/:id/accept")',
  '@Post("bookings")',
  '@Patch("bookings/:id/confirm")',
  '@Post("messages")',
  '@Patch("deals/:id/complete")',
  '@Post("reviews")',
  '@Get("subscriptions/plans")',
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