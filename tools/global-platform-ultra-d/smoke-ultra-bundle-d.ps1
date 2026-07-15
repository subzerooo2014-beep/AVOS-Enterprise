[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$controller = Get-Content -LiteralPath (
  Join-Path $RepoRoot "apps/api/src/global-platform/global-operations/global-operations.controller.ts"
) -Raw

$routes = @(
  '@Controller("global-platform")',
  '@Get("health")',
  '@Get("countries")',
  '@Post("countries")',
  '@Get("tenants")',
  '@Post("tenants")',
  '@Get("regions")',
  '@Patch("regions/:region")',
  '@Post("currency/convert")',
  '@Get("locale/:countryCode")'
)

foreach ($route in $routes) {
  if (-not $controller.Contains($route)) {
    throw "Smoke test failed: missing route $route"
  }
}

[pscustomobject]@{
  success = $true
  smokeTests = "passed"
  routes = 9
}