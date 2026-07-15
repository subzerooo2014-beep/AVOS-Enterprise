param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$path = Join-Path $RepoRoot `
  "apps/api/src/growth-revenue-expansion/growth-revenue-expansion.controller.ts"

$content = Get-Content $path -Raw

$routes = @(
  '@Controller("growth-revenue-expansion")',
  '@Get()',
  '@Post(":capability/initiatives")',
  '@Get("initiatives")',
  '@Patch("initiatives/:id/activate")',
  '@Patch("initiatives/:id/progress")',
  '@Post("initiatives/:id/experiments")',
  '@Post("experiments/:id/complete")',
  '@Post("revenue-opportunities")',
  '@Patch("revenue-opportunities/:id/status")',
  '@Get("command-center")'
)

foreach ($route in $routes) {
  if (-not $content.Contains($route)) {
    throw "Missing route: $route"
  }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Growth, Revenue & Market Expansion Platform V1"
  smokeTests = "passed"
  routes = $routes.Count
} | Format-List