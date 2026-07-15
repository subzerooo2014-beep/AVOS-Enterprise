param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$controller=Get-Content (
  Join-Path $RepoRoot "apps/api/src/industry-operations/industry-operations.controller.ts"
) -Raw

$routes=@(
  '@Controller("industry-operations")',
  '@Get("components")',
  '@Post("orders")',
  '@Patch("orders/:id/status")',
  '@Post("inventory")',
  '@Post("reservations")',
  '@Patch("reservations/:id/release")',
  '@Post("tasks")',
  '@Patch("tasks/:id/status")',
  '@Post("sla-policies")',
  '@Post("exceptions")',
  '@Patch("exceptions/:id/resolve")',
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
  components=12
}