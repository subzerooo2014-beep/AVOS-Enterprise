[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$controllerPath = Join-Path $RepoRoot "apps/api/src/universal-industry-core/universal-industry-core.controller.ts"

if (-not (Test-Path -LiteralPath $controllerPath)) {
  throw "Missing controller."
}

$content = Get-Content -LiteralPath $controllerPath -Raw

$routes = @(
  '@Controller("universal-industry-core")',
  '@Get()',
  '@Post("industries")',
  '@Patch("industries/:id/activate")',
  '@Post("industries/:code/runtimes")',
  '@Patch("runtimes/:id/activate")',
  '@Post("runtimes/:id/workflows")',
  '@Patch("workflows/:id/activate")',
  '@Post("runtimes/:id/assets")',
  '@Post("runtimes/:id/finance")',
  '@Post("runtimes/:id/risks")',
  '@Post("runtimes/:id/insights")',
  '@Post("runtimes/:id/kpis")',
  '@Post("runtimes/:id/documents")',
  '@Post("plugins")',
  '@Post("templates")',
  '@Get("industries")',
  '@Get("command-center")'
)

foreach ($route in $routes) {
  if (-not $content.Contains($route)) {
    throw "Missing route: $route"
  }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Universal Industry Core V1"
  smokeTests = "passed"
  routes = $routes.Count
} | Format-List