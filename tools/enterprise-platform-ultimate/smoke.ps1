param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"

$path = Join-Path $RepoRoot "apps/api/src/enterprise-platform-ultimate/enterprise-platform-ultimate.controller.ts"
$content = Get-Content -LiteralPath $path -Raw

$routes = @(
  '@Controller("enterprise-platform-ultimate")',
  '@Get()',
  '@Post(":domain/capabilities")',
  '@Patch("capabilities/:id/activate")',
  '@Post("capabilities/:id/execute")',
  '@Post("policies")',
  '@Post("marketplace/items")',
  '@Get("capabilities")',
  '@Get("command-center")'
)

foreach ($route in $routes) {
  if (-not $content.Contains($route)) {
    throw "Missing route: $route"
  }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Enterprise Platform Ultimate Bundle V1"
  smokeTests = "passed"
  routes = $routes.Count
} | Format-List