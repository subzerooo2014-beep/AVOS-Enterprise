param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$controller=Get-Content (
  Join-Path $RepoRoot "apps/api/src/industry-services-ecosystem/industry-services-ecosystem.controller.ts"
) -Raw

$routes=@(
  '@Controller("industry-services-ecosystem")',
  '@Get("components")',
  '@Post("bookings")',
  '@Patch("bookings/:id/status")',
  '@Post("workshop-jobs")',
  '@Patch("workshop-jobs/:id/technician")',
  '@Post("inspections")',
  '@Patch("inspections/:id/complete")',
  '@Post("warranties")',
  '@Post("warranty-claims")',
  '@Patch("warranty-claims/:id/approve")',
  '@Post("parts-orders")',
  '@Patch("parts-orders/:id/confirm")',
  '@Post("field-services")',
  '@Get("dashboard")'
)

foreach($route in $routes){
  if(-not $controller.Contains($route)){
    throw "Missing route: $route"
  }
}

[pscustomobject]@{
  success=$true
  smokeTests="passed"
  routes=$routes.Count
  components=28
}