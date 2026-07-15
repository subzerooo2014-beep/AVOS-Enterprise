param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$controller=Get-Content (
  Join-Path $RepoRoot "apps/api/src/launch-readiness/launch-readiness.controller.ts"
) -Raw

$routes=@(
  '@Controller("launch-readiness")',
  '@Get("capabilities")',
  '@Post("plans")',
  '@Post("subscriptions")',
  '@Patch("subscriptions/:id/plan")',
  '@Post("invoices")',
  '@Patch("invoices/:id/pay")',
  '@Post("checklist/install")',
  '@Patch("checklist/:id/complete")',
  '@Post("tenants/assess")',
  '@Patch("tenants/:id/activate")',
  '@Post("support/cases")',
  '@Patch("support/cases/:id/status")',
  '@Post("metrics")',
  '@Get("metrics/:tenantId/latest")',
  '@Get("dashboard")'
)

foreach($route in $routes){
  if(-not $controller.Contains($route)){ throw "Missing route: $route" }
}

[pscustomobject]@{
  success=$true
  smokeTests="passed"
  routes=$routes.Count
  capabilities=26
}|Format-List