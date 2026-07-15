[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$controllerPath = Join-Path $RepoRoot "apps/api/src/industry-factory/industry-factory.controller.ts"

if (-not (Test-Path -LiteralPath $controllerPath)) {
  throw "Missing controller."
}

$content = Get-Content -LiteralPath $controllerPath -Raw

$routes = @(
  '@Controller("industry-factory")',
  '@Get()',
  '@Post("blueprints")',
  '@Post("blueprints/:id/validate")',
  '@Patch("blueprints/:id/publish")',
  '@Post("blueprints/:id/generation-jobs")',
  '@Post("generation-jobs/:id/execute")',
  '@Post("generation-jobs/:id/installations")',
  '@Post("installations/:id/install")',
  '@Post("installations/:id/rollback")',
  '@Post("blueprints/:id/marketplace")',
  '@Patch("marketplace/:id/publish")',
  '@Get("blueprints")',
  '@Get("generation-jobs")',
  '@Get("command-center")'
)

foreach ($route in $routes) {
  if (-not $content.Contains($route)) {
    throw "Missing route: $route"
  }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Industry Factory & Blueprint Studio V1"
  smokeTests = "passed"
  routes = $routes.Count
} | Format-List