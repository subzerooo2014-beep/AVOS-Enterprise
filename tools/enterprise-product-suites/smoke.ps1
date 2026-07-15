param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$controller=Get-Content (
  Join-Path $RepoRoot "apps/api/src/enterprise-product-suites/enterprise-product-suites.controller.ts"
) -Raw

$routes=@(
  '@Controller("enterprise-product-suites")',
  '@Get("capabilities")',
  '@Post("crm/customers")',
  '@Patch("crm/customers/:id/loyalty")',
  '@Post("erp/records")',
  '@Patch("erp/records/:id/activate")',
  '@Patch("erp/records/:id/complete")',
  '@Post("marketplace/portals")',
  '@Patch("marketplace/portals/:id/capabilities")',
  '@Post("ai/tasks")',
  '@Patch("ai/tasks/:id/complete")',
  '@Post("industry-packs")',
  '@Patch("industry-packs/:id/capabilities")',
  '@Post("saas/tenants")',
  '@Patch("saas/tenants/:id/activate")',
  '@Patch("saas/tenants/:id/plan")',
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
  suites=6
}|Format-List