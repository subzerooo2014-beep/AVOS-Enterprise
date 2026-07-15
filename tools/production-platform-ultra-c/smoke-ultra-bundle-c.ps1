[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$controllerPath = Join-Path $RepoRoot "apps/api/src/production-platform/production-launch/production-launch.controller.ts"
$controller = Get-Content -LiteralPath $controllerPath -Raw

$routes = @(
  '@Controller("production-platform/launch")',
  '@Get("readiness")',
  '@Get("gates")',
  '@Post("gates")',
  '@Get("incidents")',
  '@Post("incidents")',
  '@Patch("incidents/:id")',
  '@Get("recovery-drills")',
  '@Post("recovery-drills")',
  '@Patch("recovery-drills/:id/complete")'
)

foreach ($route in $routes) {
  if (-not $controller.Contains($route)) {
    throw "Smoke test failed: missing route declaration $route"
  }
}

[pscustomobject]@{
  success = $true
  smokeTests = "passed"
  routes = 9
}