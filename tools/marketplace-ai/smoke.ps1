param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$c=Get-Content (
  Join-Path $RepoRoot "apps/api/src/marketplace-ai/marketplace-ai.controller.ts"
) -Raw

$routes=@(
  '@Controller("marketplace-ai")',
  '@Post("items")',
  '@Post("search")',
  '@Post("recommendations")',
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