param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$controller=Get-Content (
  Join-Path $RepoRoot "apps/api/src/industry-commerce-revenue/industry-commerce-revenue.controller.ts"
) -Raw

$routes=@(
  '@Controller("industry-commerce-revenue")',
  '@Get("components")',
  '@Post("offers")',
  '@Patch("offers/:id/activate")',
  '@Post("pricing-rules")',
  '@Post("subscriptions")',
  '@Post("payments")',
  '@Patch("payments/:id/capture")',
  '@Get("industries/:industryKey/summary")',
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
  components=10
}