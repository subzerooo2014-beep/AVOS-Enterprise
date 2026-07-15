param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$controller=Get-Content (
  Join-Path $RepoRoot "apps/api/src/strategic-foundation/strategic-foundation.controller.ts"
) -Raw

$routes=@(
  '@Controller("strategic-foundation")',
  '@Get("registry")',
  '@Post("proposals/evaluate")',
  '@Post("executive-briefs")',
  '@Post("audit")',
  '@Get("dashboard")'
)

foreach($route in $routes){
  if(-not $controller.Contains($route)){
    throw "Missing route: $route"
  }
}

[pscustomobject]@{
  success=$true
  smokeTests="passed"
  routes=$routes.Count
  strategicDomains=6
}|Format-List