[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$controllerPath = Join-Path $RepoRoot `
  "apps/api/src/brand-foundation/brand-foundation.controller.ts"

$controller = Get-Content -LiteralPath $controllerPath -Raw

$routes = @(
  '@Controller("brand-foundation")',
  '@Get()',
  '@Get("mandatory-order")',
  '@Post("validate-product")',
  '@Post("validate-entry")'
)

foreach ($route in $routes) {
  if (-not $controller.Contains($route)) {
    throw "Smoke test failed. Missing route: $route"
  }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Brand Foundation"
  smokeTests = "passed"
  routes = $routes.Count
} | Format-List