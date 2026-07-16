param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"

$path = Join-Path $RepoRoot "apps/api/src/enterprise-ultimate-g1/enterprise-ultimate-g1.controller.ts"
$content = Get-Content -LiteralPath $path -Raw

$routes = @(
  '@Controller("enterprise-ultimate-g1")',
  '@Get()',
  '@Post("themes")',
  '@Patch("themes/:id/activate")',
  '@Post("navigation")',
  '@Post("experiences")',
  '@Post("components")',
  '@Get("resolve")',
  '@Get("command-center")'
)

foreach ($route in $routes) {
  if (-not $content.Contains($route)) {
    throw "Missing route: $route"
  }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Enterprise Ultimate Mega Bundle G1"
  smokeTests = "passed"
  routes = $routes.Count
} | Format-List