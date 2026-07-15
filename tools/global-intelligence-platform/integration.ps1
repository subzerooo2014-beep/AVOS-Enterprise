[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$modulePath = Join-Path $RepoRoot "apps/api/src/global-intelligence-platform/global-intelligence-platform.module.ts"
$appModulePath = Join-Path $RepoRoot "apps/api/src/app.module.ts"
$webPath = Join-Path $RepoRoot "apps/web/src/app/global-intelligence-platform/page.tsx"
$mobilePath = Join-Path $RepoRoot "apps/mobile/lib/features/global_intelligence_platform/global_intelligence_platform_screen.dart"

foreach ($path in @($modulePath, $appModulePath, $webPath, $mobilePath)) {
    if (-not (Test-Path -LiteralPath $path)) {
        throw "Missing integration target: $path"
    }
}

$module = Get-Content -LiteralPath $modulePath -Raw
$appModule = Get-Content -LiteralPath $appModulePath -Raw

$checks = [ordered]@{
    controllerRegistered = $module -match "GlobalIntelligencePlatformController"
    serviceRegistered = $module -match "GlobalIntelligencePlatformService"
    serviceExported = $module -match "exports:\s*\[GlobalIntelligencePlatformService\]"
    appModuleImport = $appModule -match "GlobalIntelligencePlatformModule"
    webRegistered = Test-Path -LiteralPath $webPath
    mobileRegistered = Test-Path -LiteralPath $mobilePath
}

$failed = @(
    $checks.GetEnumerator() |
        Where-Object { -not $_.Value }
)

if ($failed.Count -gt 0) {
    throw "Integration checks failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
    success = $true
    system = "AVOS Global Intelligence Platform - Enterprise Brain V2"
    integrationTests = "passed"
    checks = $checks.Count
} | Format-List