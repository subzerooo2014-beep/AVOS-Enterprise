[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$controllerPath = Join-Path $RepoRoot `
  "apps/api/src/reference-architecture/reference-architecture.controller.ts"

$controller = Get-Content -LiteralPath $controllerPath -Raw

$routes = @(
  '@Controller("reference-architecture")',
  '@Get()',
  '@Post("entries")',
  '@Get("entries")',
  '@Get("entries/:id")',
  '@Post("entries/:id/evaluate")',
  '@Patch("entries/:id/activate")',
  '@Patch("entries/:id/deprecate")',
  '@Get("entries/:id/dependency-graph")',
  '@Get("summary")'
)

foreach ($route in $routes) {
  if (-not $controller.Contains($route)) {
    throw "Smoke test failed. Missing route: $route"
  }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Reference Architecture & Registry Foundation V1"
  smokeTests = "passed"
  routes = $routes.Count
} | Format-List