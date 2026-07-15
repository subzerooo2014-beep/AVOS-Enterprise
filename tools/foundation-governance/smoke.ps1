[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$controllerPath = Join-Path $RepoRoot `
  "apps/api/src/foundation-governance/foundation-governance.controller.ts"

$controller = Get-Content -LiteralPath $controllerPath -Raw

$routes = @(
  '@Controller("foundation-governance")',
  '@Get()',
  '@Post("products")',
  '@Get("products")',
  '@Get("products/:id")',
  '@Post("products/:id/evidence")',
  '@Post("products/:id/evidence/:evidenceId/verify")',
  '@Post("products/:id/evaluate-gate")',
  '@Post("products/:id/complete-stage")',
  '@Get("products/:id/audit")'
)

foreach ($route in $routes) {
  if (-not $controller.Contains($route)) {
    throw "Smoke test failed. Missing route: $route"
  }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Foundation Governance & Conformance Engine V1"
  smokeTests = "passed"
  routes = $routes.Count
} | Format-List