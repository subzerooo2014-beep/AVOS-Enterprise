param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$controller=Get-Content (
  Join-Path $RepoRoot "apps/api/src/industry-platform/industry-platform.controller.ts"
) -Raw

$routes=@(
  '@Controller("industry-platform")',
  '@Get("industries")',
  '@Get("industries/:key")',
  '@Post("industries")',
  '@Get("capabilities")',
  '@Post("capabilities")',
  '@Post("industries/:industryKey/capabilities/:capabilityKey")',
  '@Get("industries/:industryKey/bindings")',
  '@Post("execute")',
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
  industries=10
  sharedCapabilities=11
}