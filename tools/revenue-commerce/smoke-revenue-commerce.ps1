param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$c=Get-Content (
  Join-Path $RepoRoot "apps/api/src/revenue-commerce/revenue-commerce.controller.ts"
) -Raw

$routes=@(
  '@Controller("revenue-commerce")',
  '@Get("plans")',
  '@Post("subscriptions")',
  '@Patch("subscriptions/:id/cancel")',
  '@Post("invoices")',
  '@Post("payments")',
  '@Patch("payments/:id/capture")',
  '@Post("commissions")',
  '@Post("advertisements")',
  '@Patch("advertisements/:id/activate")',
  '@Patch("advertisements/:id/spend")',
  '@Post("coupons")',
  '@Post("refunds")',
  '@Patch("refunds/:id/complete")',
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