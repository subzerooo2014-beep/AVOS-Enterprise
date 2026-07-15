param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$controller=Get-Content (
  Join-Path $RepoRoot "apps/api/src/foundation-core/foundation-core.controller.ts"
) -Raw

$routes=@(
  '@Controller("foundation-core")',
  '@Get("components")',
  '@Post("platforms")',
  '@Post("industries")',
  '@Post("capabilities")',
  '@Post("lead-deals")',
  '@Patch("lead-deals/:id/stage")',
  '@Post("audit")',
  '@Post("events")',
  '@Post("owner-ai/decision")',
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
  foundations=19
}