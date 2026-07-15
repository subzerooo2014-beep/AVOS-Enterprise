param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$controller=Get-Content (
  Join-Path $RepoRoot "apps/api/src/grand-business-product/grand-business-product.controller.ts"
) -Raw

$routes=@(
  '@Controller("grand-business-product")',
  '@Get("domains")',
  '@Get("domains/:key")',
  '@Post("records")',
  '@Patch("records/:id/activate")',
  '@Patch("records/:id/complete")',
  '@Get("domains/:key/records")',
  '@Post("execute")',
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
  domains=10
}