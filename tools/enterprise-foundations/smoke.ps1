param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$controller=Get-Content (
  Join-Path $RepoRoot "apps/api/src/enterprise-foundations/enterprise-foundations.controller.ts"
) -Raw

$routes=@(
  '@Controller("enterprise-foundations")',
  '@Get("capabilities")',
  '@Post("registrations")',
  '@Post("data-ai/assets")',
  '@Patch("data-ai/assets/:id/quality")',
  '@Post("runtime/jobs")',
  '@Patch("runtime/jobs/:id/status")',
  '@Post("identity/contexts")',
  '@Post("identity/authorize")',
  '@Post("developer/assets")',
  '@Patch("developer/assets/:id/publish")',
  '@Post("legal/policies")',
  '@Post("legal/evaluate")',
  '@Post("security/observations")',
  '@Patch("security/observations/:id/resolve")',
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
  foundations=6
}|Format-List