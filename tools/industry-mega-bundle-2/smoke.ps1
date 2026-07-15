param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"
$path = Join-Path $RepoRoot "apps/api/src/industry-mega-bundle-2/industry-mega-bundle-2.controller.ts"
$c = Get-Content $path -Raw

$routes = @(
  '@Controller("industry-mega-bundle-2")',
  '@Get()',
  '@Post(":industry/assets")',
  '@Get("assets")',
  '@Patch("assets/:id/activate")',
  '@Post(":industry/operations")',
  '@Patch("operations/:id/status")',
  '@Post("risks")',
  '@Get("dashboard")'
)

foreach ($r in $routes) {
  if (-not $c.Contains($r)) { throw "Missing route: $r" }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Industry Mega Bundle 2"
  smokeTests = "passed"
  routes = $routes.Count
} | Format-List