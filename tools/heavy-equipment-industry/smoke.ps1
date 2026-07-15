[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$controllerPath = Join-Path $RepoRoot `
  "apps/api/src/heavy-equipment-industry/heavy-equipment-industry.controller.ts"

$controller = Get-Content -LiteralPath $controllerPath -Raw

$routes = @(
  '@Controller("heavy-equipment-industry")',
  '@Get("capabilities")',
  '@Post("equipment")',
  '@Get("equipment")',
  '@Get("equipment/:id")',
  '@Patch("equipment/:id/status")',
  '@Patch("equipment/:id/owner")',
  '@Patch("equipment/:id/valuation")',
  '@Post("sites")',
  '@Get("sites")',
  '@Post("deployments")',
  '@Patch("deployments/:id/status")',
  '@Post("inspections")',
  '@Post("work-orders")',
  '@Patch("work-orders/:id/status")',
  '@Post("rentals")',
  '@Patch("rentals/:id/status")',
  '@Post("listings")',
  '@Patch("listings/:id/publish")',
  '@Post("spare-parts")',
  '@Patch("spare-parts/:id/quantity")',
  '@Get("spare-parts/low-stock")',
  '@Post("telematics")',
  '@Get("telematics/:equipmentId/latest")',
  '@Post("ai/assessments")',
  '@Get("ai/predictive-maintenance/:equipmentId")',
  '@Get("dashboard")'
)

foreach ($route in $routes) {
  if (-not $controller.Contains($route)) {
    throw "Smoke test failed. Missing route: $route"
  }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Heavy Equipment Industry Pack"
  smokeTests = "passed"
  routes = $routes.Count
} | Format-List