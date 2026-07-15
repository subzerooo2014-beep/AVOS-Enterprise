param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$path = Join-Path $RepoRoot `
  "apps/api/src/autonomous-enterprise-execution/autonomous-enterprise-execution.controller.ts"

$content = Get-Content $path -Raw

$routes = @(
  '@Controller("autonomous-enterprise-execution")',
  '@Get()',
  '@Post("plans")',
  '@Get("plans")',
  '@Post("plans/:id/evaluate")',
  '@Post("plans/:id/validate")',
  '@Patch("plans/:id/approval")',
  '@Post("plans/:id/runs")',
  '@Post("runs/:id/complete-step")',
  '@Post("runs/:id/fail")',
  '@Post("runs/:id/rollback")',
  '@Get("command-center")'
)

foreach ($route in $routes) {
  if (-not $content.Contains($route)) {
    throw "Missing route: $route"
  }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Autonomous Enterprise Execution Platform V1"
  smokeTests = "passed"
  routes = $routes.Count
} | Format-List