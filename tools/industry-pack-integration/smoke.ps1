[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$controllerPath = Join-Path $RepoRoot "apps/api/src/industry-pack-integration/industry-pack-integration.controller.ts"

if (-not (Test-Path -LiteralPath $controllerPath)) {
  throw "Missing controller."
}

$content = Get-Content -LiteralPath $controllerPath -Raw

$routes = @(
  '@Controller("industry-pack-integration")',
  '@Get()',
  '@Post("packs/:packCode/discover")',
  '@Post("packs/:packCode/compatibility")',
  '@Post("packs/:packCode/adapters")',
  '@Patch("packs/:packCode/adapters/activate")',
  '@Post("packs/:packCode/migrations")',
  '@Post("migrations/:id/execute")',
  '@Get("packs")',
  '@Get("adapters")',
  '@Get("migrations")',
  '@Get("command-center")'
)

foreach ($route in $routes) {
  if (-not $content.Contains($route)) {
    throw "Missing route: $route"
  }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Industry Pack Integration & Migration V1"
  smokeTests = "passed"
  routes = $routes.Count
} | Format-List