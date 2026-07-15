param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"
$path = Join-Path $RepoRoot "apps/api/src/genesis-enterprise-v1/genesis-enterprise-v1.controller.ts"
$content = Get-Content -LiteralPath $path -Raw
foreach ($route in @(
  '@Controller("genesis-enterprise-v1")',
  '@Get()',
  '@Post("blueprints")',
  '@Post("executions")',
  '@Get("command-center")'
)) {
  if (-not $content.Contains($route)) { throw "Missing route: $route" }
}
[pscustomobject]@{ success=$true; system="AVOS Genesis Enterprise V1"; smokeTests="passed" } | Format-List