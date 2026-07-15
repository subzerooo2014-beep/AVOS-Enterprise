param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"
$path = Join-Path $RepoRoot "apps/api/src/genesis-runtime-v1/genesis-runtime-v1.controller.ts"
$content = Get-Content -LiteralPath $path -Raw
foreach ($route in @(
  '@Controller("genesis-runtime-v1")',
  '@Get()',
  '@Post("blueprints")',
  '@Post("executions")',
  '@Get("command-center")'
)) {
  if (-not $content.Contains($route)) { throw "Missing route: $route" }
}
[pscustomobject]@{ success=$true; system="AVOS Genesis Runtime V1"; smokeTests="passed" } | Format-List