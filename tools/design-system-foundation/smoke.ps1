[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$controllerPath = Join-Path $RepoRoot `
  "apps/api/src/design-system-foundation/design-system-foundation.controller.ts"

$controller = Get-Content -LiteralPath $controllerPath -Raw

$routes = @(
  '@Controller("design-system-foundation")',
  '@Get()',
  '@Get("tokens")',
  '@Get("components")',
  '@Post("validate-product")'
)

foreach ($route in $routes) {
  if (-not $controller.Contains($route)) {
    throw "Smoke test failed. Missing route: $route"
  }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Design System Foundation V1"
  smokeTests = "passed"
  routes = $routes.Count
} | Format-List