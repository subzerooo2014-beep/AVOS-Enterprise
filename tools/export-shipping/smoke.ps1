param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$c=Get-Content (
  Join-Path $RepoRoot "apps/api/src/export-shipping/export-shipping.controller.ts"
) -Raw

$routes=@(
  '@Controller("export-shipping")',
  '@Get("capabilities")',
  '@Post("cases")',
  '@Patch("cases/:id/status")',
  '@Post("quotes")',
  '@Patch("quotes/:id/accept")',
  '@Post("documents")',
  '@Patch("documents/:id/verify")',
  '@Post("customs/checks")',
  '@Post("shipments")',
  '@Patch("shipments/:id/track")',
  '@Post("exceptions")',
  '@Patch("exceptions/:id/resolve")',
  '@Get("dashboard")'
)

foreach($route in $routes){
  if(-not $c.Contains($route)){
    throw "Missing route: $route"
  }
}

[pscustomobject]@{
  success=$true
  smokeTests="passed"
  routes=$routes.Count
}|Format-List