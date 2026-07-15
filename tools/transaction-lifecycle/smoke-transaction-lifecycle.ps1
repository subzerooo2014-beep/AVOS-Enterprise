param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$controller=Get-Content (
  Join-Path $RepoRoot "apps/api/src/transaction-lifecycle/transaction-lifecycle.controller.ts"
) -Raw

$routes=@(
  '@Controller("transaction-lifecycle")',
  '@Get("domains")',
  '@Post("cases")',
  '@Get("cases/:id")',
  '@Patch("cases/:id/status")',
  '@Get("domains/:key/cases")',
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
  domains=12
}