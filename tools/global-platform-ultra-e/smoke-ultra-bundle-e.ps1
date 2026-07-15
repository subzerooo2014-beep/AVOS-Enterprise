[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$controller = Get-Content -LiteralPath (
  Join-Path $RepoRoot "apps/api/src/global-platform/global-enterprise-services/global-enterprise-services.controller.ts"
) -Raw

$routes = @(
  '@Controller("global-platform/enterprise")',
  '@Get("dashboard")',
  '@Get("identity-providers")',
  '@Post("identity-providers")',
  '@Get("organizations")',
  '@Post("organizations")',
  '@Get("policies")',
  '@Post("policies")',
  '@Post("access/evaluate")',
  '@Get("events")',
  '@Post("events")'
)

foreach ($route in $routes) {
  if (-not $controller.Contains($route)) {
    throw "Smoke test failed: missing route $route"
  }
}

[pscustomobject]@{
  success = $true
  smokeTests = "passed"
  routes = 10
}