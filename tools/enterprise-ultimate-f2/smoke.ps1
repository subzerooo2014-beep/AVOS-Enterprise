param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"

$path = Join-Path $RepoRoot "apps/api/src/enterprise-ultimate-f2/enterprise-ultimate-f2.controller.ts"
$content = Get-Content -LiteralPath $path -Raw

$routes = @(
  '@Controller("enterprise-ultimate-f2")',
  '@Get()',
  '@Post("metrics")',
  '@Post("decisions")',
  '@Patch("decisions/:id/approve")',
  '@Post("decisions/:id/execute")',
  '@Post("tasks")',
  '@Patch("tasks/:id/complete")',
  '@Post("insights")',
  '@Post("goals")',
  '@Get("executive-dashboard")',
  '@Get("business-health/:tenantId")'
)

foreach ($route in $routes) {
  if (-not $content.Contains($route)) { throw "Missing route: $route" }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Enterprise Ultimate Mega Bundle F2"
  smokeTests = "passed"
  routes = $routes.Count
} | Format-List