[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$controller = Get-Content -LiteralPath (
  Join-Path $RepoRoot "apps/api/src/global-platform/data-ai-integration/data-ai-integration.controller.ts"
) -Raw

$routes = @(
  '@Controller("global-platform/data-ai")',
  '@Get("health")',
  '@Get("assets")',
  '@Post("assets")',
  '@Get("models")',
  '@Post("models")',
  '@Patch("models/:id/deploy")',
  '@Get("features")',
  '@Post("features")',
  '@Get("integrations")',
  '@Post("integrations")',
  '@Post("governance/evaluate")',
  '@Get("events")'
)

foreach ($route in $routes) {
  if (-not $controller.Contains($route)) {
    throw "Smoke test failed: missing route $route"
  }
}

[pscustomobject]@{
  success = $true
  smokeTests = "passed"
  routes = 12
}