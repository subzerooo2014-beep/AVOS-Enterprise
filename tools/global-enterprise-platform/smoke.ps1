param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"
$path = Join-Path $RepoRoot "apps/api/src/global-enterprise-platform/global-enterprise-platform.controller.ts"
$c = Get-Content $path -Raw

$routes = @(
  '@Controller("global-enterprise-platform")',
  '@Get()',
  '@Post(":capability/entries")',
  '@Get("entries")',
  '@Patch("entries/:id/activate")',
  '@Post(":capability/execute")',
  '@Post(":capability/health")',
  '@Get("command-center")'
)

foreach ($r in $routes) {
  if (-not $c.Contains($r)) { throw "Missing route: $r" }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Global Enterprise Platform Pack V1"
  smokeTests = "passed"
  routes = $routes.Count
} | Format-List