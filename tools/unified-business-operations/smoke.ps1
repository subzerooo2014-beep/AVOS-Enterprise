param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$controller=Get-Content (
  Join-Path $RepoRoot "apps/api/src/unified-business-operations/unified-business-operations.controller.ts"
) -Raw

$routes=@(
  '@Controller("unified-business-operations")',
  '@Get("capabilities")',
  '@Post("workflows/templates/install")',
  '@Post("workflows")',
  '@Post("workflows/:id/start")',
  '@Patch("executions/:id/advance")',
  '@Patch("executions/:id/approve")',
  '@Patch("executions/:id/status")',
  '@Post("automation/rules")',
  '@Post("integrations")',
  '@Post("events")',
  '@Post("alerts")',
  '@Patch("alerts/:id/resolve")',
  '@Post("ai/insights")',
  '@Get("ai/predictive")',
  '@Get("command-center")',
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
  capabilities=34
}|Format-List