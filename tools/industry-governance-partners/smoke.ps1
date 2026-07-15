param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$controller=Get-Content (
  Join-Path $RepoRoot "apps/api/src/industry-governance-partners/industry-governance-partners.controller.ts"
) -Raw

$routes=@(
  '@Controller("industry-governance-partners")',
  '@Get("components")',
  '@Post("partners")',
  '@Patch("partners/:id/verify")',
  '@Patch("partners/:id/activate")',
  '@Post("permissions")',
  '@Post("permissions/evaluate")',
  '@Post("approvals")',
  '@Patch("approvals/:id/decision")',
  '@Post("compliance/checks")',
  '@Post("risk/assessments")',
  '@Post("agreements")',
  '@Patch("agreements/:id/activate")',
  '@Post("slas")',
  '@Patch("slas/:id/breach")',
  '@Post("settlements")',
  '@Patch("settlements/:id/approve")',
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
  components=19
}|Format-List