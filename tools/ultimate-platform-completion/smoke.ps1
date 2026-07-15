[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$controllerPath = Join-Path $RepoRoot `
  "apps/api/src/ultimate-platform-completion/ultimate-platform-completion.controller.ts"

$content = Get-Content -LiteralPath $controllerPath -Raw

$routes = @(
  '@Controller("ultimate-platform-completion")',
  '@Get()',
  '@Post(":capability/portfolio")',
  '@Get("portfolio")',
  '@Patch("portfolio/:id/activate")',
  '@Post("portfolio/:id/scenarios")',
  '@Post("portfolio/:id/scorecards")',
  '@Post("portfolio/:id/complete")',
  '@Get("command-center")'
)

foreach ($route in $routes) {
  if (-not $content.Contains($route)) {
    throw "Smoke test failed. Missing route: $route"
  }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Ultimate Platform Completion Bundle V1"
  smokeTests = "passed"
  routes = $routes.Count
} | Format-List