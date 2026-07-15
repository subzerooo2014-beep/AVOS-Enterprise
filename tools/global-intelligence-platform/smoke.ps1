param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$path = Join-Path $RepoRoot `
  "apps/api/src/global-intelligence-platform/global-intelligence-platform.controller.ts"

$content = Get-Content $path -Raw

$routes = @(
  '@Controller("global-intelligence-platform")',
  '@Get()',
  '@Post(":capability/nodes")',
  '@Get("nodes")',
  '@Patch("nodes/:id/activate")',
  '@Post("decisions")',
  '@Patch("decisions/:id/approval")',
  '@Post("decisions/:id/execute")',
  '@Post("scenarios")',
  '@Post("decisions/:id/feedback")',
  '@Get("command-center")'
)

foreach ($route in $routes) {
  if (-not $content.Contains($route)) {
    throw "Missing route: $route"
  }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Global Intelligence Platform — Enterprise Brain V2"
  smokeTests = "passed"
  routes = $routes.Count
} | Format-List