[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$controller = Get-Content -LiteralPath (
    Join-Path $RepoRoot "apps/api/src/enterprise-runtime-v1/enterprise-runtime-v1.controller.ts"
) -Raw

$routes = @(
    '@Controller("enterprise-runtime/v1")',
    '@Get("health")',
    '@Get("capabilities")',
    '@Get("executions")',
    '@Get("executions/:id")',
    '@Post("execute")'
)

foreach ($route in $routes) {
    if (-not $controller.Contains($route)) {
        throw "Missing route: $route"
    }
}

[pscustomobject]@{
    success = $true
    smokeTests = "passed"
    routes = $routes.Count
}