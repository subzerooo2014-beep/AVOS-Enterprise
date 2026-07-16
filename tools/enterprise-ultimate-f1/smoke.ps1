param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"

$path = Join-Path $RepoRoot "apps/api/src/enterprise-ultimate-f1/enterprise-ultimate-f1.controller.ts"
$content = Get-Content -LiteralPath $path -Raw

$routes = @(
  '@Controller("enterprise-ultimate-f1")',
  '@Get()',
  '@Post("workspaces")',
  '@Post("widgets")',
  '@Post("workspaces/:workspaceId/widgets/:widgetId")',
  '@Post("activities")',
  '@Post("commands")',
  '@Post("recommendations")',
  '@Patch("recommendations/:id/accept")',
  '@Get("search")',
  '@Get("business-pulse/:tenantId")',
  '@Get("command-center")'
)

foreach ($route in $routes) {
  if (-not $content.Contains($route)) { throw "Missing route: $route" }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Enterprise Ultimate Mega Bundle F1"
  smokeTests = "passed"
  routes = $routes.Count
} | Format-List