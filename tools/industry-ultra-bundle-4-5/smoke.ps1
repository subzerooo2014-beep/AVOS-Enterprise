[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$base = Join-Path $RepoRoot "apps/api/src/industry-ultra-bundle-4-5"

$controllers = @(
  "agriculture-agritech.controller.ts",
  "food-beverage.controller.ts",
  "mining-resources.controller.ts",
  "media-entertainment.controller.ts",
  "sports-events.controller.ts",
  "legal-professional-services.controller.ts",
  "security-emergency-services.controller.ts",
  "environment-waste.controller.ts",
  "space-satellite.controller.ts",
  "nonprofit-humanitarian.controller.ts"
)

$routes = @(
  '@Get()',
  '@Post(":capability/records")',
  '@Get("records")',
  '@Patch("records/:id/activate")',
  '@Post("records/:id/missions")',
  '@Post("missions/:id/start")',
  '@Post("missions/:id/complete")',
  '@Post("records/:id/insights")',
  '@Get("command-center")'
)

foreach ($controller in $controllers) {
  $path = Join-Path $base $controller
  if (-not (Test-Path -LiteralPath $path)) {
    throw "Missing controller: $controller"
  }

  $content = Get-Content -LiteralPath $path -Raw
  foreach ($route in $routes) {
    if (-not $content.Contains($route)) {
      throw "Missing route $route in $controller"
    }
  }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Industry Ultra Bundle 4-5"
  smokeTests = "passed"
  industries = $controllers.Count
  routesPerIndustry = $routes.Count
  totalRouteChecks = $controllers.Count * $routes.Count
} | Format-List