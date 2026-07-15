param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"
$path = Join-Path $RepoRoot "apps/api/src/industry-mega-bundle-1/industry-mega-bundle-1.controller.ts"
$c = Get-Content $path -Raw
$routes = @(
  '@Controller("industry-mega-bundle-1")',
  '@Get()',
  '@Post(":industry/records")',
  '@Get("records")',
  '@Patch("records/:id/activate")',
  '@Patch("records/:id/complete")',
  '@Post("metrics")',
  '@Post("ai/insights")',
  '@Get("dashboard")'
)
foreach ($r in $routes) {
  if (-not $c.Contains($r)) { throw "Missing route: $r" }
}
[pscustomobject]@{
  success = $true
  system = "AVOS Industry Mega Bundle 1"
  smokeTests = "passed"
  routes = $routes.Count
} | Format-List