param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"

$path = Join-Path $RepoRoot "apps/api/src/enterprise-ultimate-f3/enterprise-ultimate-f3.controller.ts"
$content = Get-Content -LiteralPath $path -Raw

$routes = @(
  '@Controller("enterprise-ultimate-f3")',
  '@Get()',
  '@Post("advertisements")',
  '@Patch("advertisements/:id/publish")',
  '@Post("advertisements/:id/engagement")',
  '@Patch("advertisements/:id/price")',
  '@Post("market-signals")',
  '@Post("buyer-intents")',
  '@Get("compare")',
  '@Get("advertisements/:id/360")',
  '@Get("command-center")'
)

foreach ($route in $routes) {
  if (-not $content.Contains($route)) { throw "Missing route: $route" }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Enterprise Ultimate Mega Bundle F3"
  smokeTests = "passed"
  routes = $routes.Count
} | Format-List