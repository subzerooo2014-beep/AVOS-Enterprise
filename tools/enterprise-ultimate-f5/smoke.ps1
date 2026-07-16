param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"

$path = Join-Path $RepoRoot "apps/api/src/enterprise-ultimate-f5/enterprise-ultimate-f5.controller.ts"
$content = Get-Content -LiteralPath $path -Raw

$routes = @(
  '@Controller("enterprise-ultimate-f5")',
  '@Get()',
  '@Post("workspaces")',
  '@Patch("workspaces/:id/personalize")',
  '@Post("missions")',
  '@Patch("missions/:id/progress")',
  '@Post("briefings")',
  '@Post("activities")',
  '@Post("digital-employees")',
  '@Post("digital-employees/:id/assign")',
  '@Post("digital-employees/:id/complete-task")',
  '@Get("command-palette")',
  '@Get("cockpit")'
)

foreach ($route in $routes) {
  if (-not $content.Contains($route)) {
    throw "Missing route: $route"
  }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Enterprise Ultimate Mega Bundle F5"
  smokeTests = "passed"
  routes = $routes.Count
} | Format-List