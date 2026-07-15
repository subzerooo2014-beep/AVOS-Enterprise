param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"
$path = Join-Path $RepoRoot "apps/api/src/industry-mega-bundle-3/industry-mega-bundle-3.controller.ts"
$c = Get-Content $path -Raw

$routes = @(
  '@Controller("industry-mega-bundle-3")',
  '@Get()',
  '@Post(":industry/entities")',
  '@Get("entities")',
  '@Patch("entities/:id/activate")',
  '@Post(":industry/transactions")',
  '@Patch("transactions/:id/status")',
  '@Post("ai/decisions")',
  '@Get("dashboard")'
)

foreach ($r in $routes) {
  if (-not $c.Contains($r)) { throw "Missing route: $r" }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Industry Mega Bundle 3"
  smokeTests = "passed"
  routes = $routes.Count
} | Format-List