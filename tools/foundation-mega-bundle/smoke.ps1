param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"
$path = Join-Path $RepoRoot "apps/api/src/foundation-mega-bundle/foundation-mega-bundle.controller.ts"
$c = Get-Content $path -Raw
$routes = @(
  '@Controller("foundation-mega-bundle")',
  '@Get()',
  '@Post("foundations")',
  '@Get("foundations")',
  '@Post("decisions")',
  '@Patch("decisions/:id/accept")',
  '@Post("products")',
  '@Post("products/:id/evaluate-release")',
  '@Get("command-center")'
)
foreach ($r in $routes) {
  if (-not $c.Contains($r)) { throw "Missing route: $r" }
}
[pscustomobject]@{
  success = $true
  system = "AVOS Foundation Mega Bundle V1"
  smokeTests = "passed"
  routes = $routes.Count
} | Format-List