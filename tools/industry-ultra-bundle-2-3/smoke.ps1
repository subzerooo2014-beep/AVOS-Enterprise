[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$base = Join-Path $RepoRoot "apps/api/src/industry-ultra-bundle-2-3"

$controllers = @(
  "energy-utilities.controller.ts",
  "retail-commerce.controller.ts",
  "hospitality-tourism.controller.ts",
  "education.controller.ts",
  "government-public-sector.controller.ts",
  "banking-fintech.controller.ts",
  "insurance.controller.ts",
  "telecommunications.controller.ts",
  "aviation.controller.ts",
  "maritime.controller.ts"
)

$requiredRoutes = @(
  '@Get()',
  '@Post(":capability/records")',
  '@Get("records")',
  '@Patch("records/:id/activate")',
  '@Post("records/:id/workflows")',
  '@Post("workflows/:id/start")',
  '@Post("workflows/:id/complete")',
  '@Post("records/:id/insights")',
  '@Get("command-center")'
)

foreach ($controller in $controllers) {
  $path = Join-Path $base $controller

  if (-not (Test-Path -LiteralPath $path)) {
    throw "Missing controller: $controller"
  }

  $content = Get-Content -LiteralPath $path -Raw

  foreach ($route in $requiredRoutes) {
    if (-not $content.Contains($route)) {
      throw "Missing route $route in $controller"
    }
  }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Industry Ultra Bundle 2-3"
  smokeTests = "passed"
  industries = $controllers.Count
  routesPerIndustry = $requiredRoutes.Count
  totalRouteChecks = $controllers.Count * $requiredRoutes.Count
} | Format-List