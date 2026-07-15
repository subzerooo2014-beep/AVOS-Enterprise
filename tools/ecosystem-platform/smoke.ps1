param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"

$path = Join-Path $RepoRoot "apps/api/src/ecosystem-platform/ecosystem-platform.controller.ts"
$content = Get-Content $path -Raw

$routes = @(
  '@Controller("ecosystem-platform")',
  '@Get()',
  '@Post(":capability/applications")',
  '@Get("applications")',
  '@Patch("applications/:id/activate")',
  '@Post("applications/:id/credentials")',
  '@Patch("credentials/:id/rotate")',
  '@Post(":capability/execute")',
  '@Get("command-center")'
)

foreach ($route in $routes) {
  if (-not $content.Contains($route)) {
    throw "Missing route: $route"
  }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Ecosystem Platform Pack V1"
  smokeTests = "passed"
  routes = $routes.Count
} | Format-List