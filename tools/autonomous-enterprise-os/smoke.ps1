[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$controller = Join-Path $RepoRoot "apps/api/src/autonomous-enterprise-os/autonomous-enterprise-os.controller.ts"

if (-not (Test-Path -LiteralPath $controller)) {
  throw "Missing controller."
}

$content = Get-Content -LiteralPath $controller -Raw

$routes = @(
  '@Controller("autonomous-enterprise-os")',
  '@Get()',
  '@Post(":domain/capabilities")',
  '@Patch("capabilities/:id/activate")',
  '@Post("capabilities/:id/missions")',
  '@Post("missions/:id/start")',
  '@Post("missions/:id/complete")',
  '@Post("missions/:id/decisions")',
  '@Patch("decisions/:id/approve")',
  '@Post("decisions/:id/execute")',
  '@Post("policies")',
  '@Post("economy/items")',
  '@Get("capabilities")',
  '@Get("command-center")'
)

foreach ($route in $routes) {
  if (-not $content.Contains($route)) {
    throw "Missing route: $route"
  }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Autonomous Enterprise OS Ultimate V1"
  smokeTests = "passed"
  routes = $routes.Count
} | Format-List