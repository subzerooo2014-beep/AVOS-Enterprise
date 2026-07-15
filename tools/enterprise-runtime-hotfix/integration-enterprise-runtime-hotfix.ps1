[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$appModule = Get-Content -LiteralPath (
    Join-Path $RepoRoot "apps/api/src/app.module.ts"
) -Raw

$runtimeModule = Get-Content -LiteralPath (
    Join-Path $RepoRoot "apps/api/src/enterprise-runtime-v1/enterprise-runtime-v1.module.ts"
) -Raw

$checks = [ordered]@{
    enterpriseRuntimeRegistered = $appModule -match "EnterpriseRuntimeV1Module"
    runtimeControllerRegistered = $runtimeModule -match "EnterpriseRuntimeV1Controller"
    runtimeServiceRegistered = $runtimeModule -match "EnterpriseRuntimeV1Service"
    runtimeServiceExported = $runtimeModule -match "exports:\s*\[EnterpriseRuntimeV1Service\]"
}

$failed = @($checks.GetEnumerator() | Where-Object { -not $_.Value })

if ($failed.Count -gt 0) {
    throw "Integration failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
    success = $true
    integrationTests = "passed"
    checks = $checks.Count
}