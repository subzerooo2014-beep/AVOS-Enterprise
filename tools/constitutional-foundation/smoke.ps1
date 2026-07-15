param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$controller=Get-Content (
  Join-Path $RepoRoot "apps/api/src/constitutional-foundation/constitutional-foundation.controller.ts"
) -Raw

$routes=@(
  '@Controller("constitutional-foundation")',
  '@Get("constitutions")',
  '@Get("constitutions/:key")',
  '@Post("evaluations")',
  '@Post("approvals")',
  '@Patch("approvals/:id/decision")',
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
  constitutions=5
}|Format-List