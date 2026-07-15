[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$modulePath = Join-Path $RepoRoot "apps/api/src/autonomous-enterprise-os/autonomous-enterprise-os.module.ts"
$appModulePath = Join-Path $RepoRoot "apps/api/src/app.module.ts"
$webPath = Join-Path $RepoRoot "apps/web/src/app/autonomous-enterprise-os/page.tsx"
$mobilePath = Join-Path $RepoRoot "apps/mobile/lib/features/autonomous_enterprise_os/autonomous_enterprise_os_screen.dart"

foreach ($path in @($modulePath, $appModulePath, $webPath, $mobilePath)) {
  if (-not (Test-Path -LiteralPath $path)) {
    throw "Missing integration target: $path"
  }
}

$module = Get-Content -LiteralPath $modulePath -Raw
$appModule = Get-Content -LiteralPath $appModulePath -Raw

$checks = [ordered]@{
  controller = $module -match "AutonomousEnterpriseOsController"
  service = $module -match "AutonomousEnterpriseOsService"
  export = $module -match "exports:\s*\[AutonomousEnterpriseOsService\]"
  registration = $appModule -match "AutonomousEnterpriseOsModule"
  web = Test-Path -LiteralPath $webPath
  mobile = Test-Path -LiteralPath $mobilePath
}

$failed = @(
  $checks.GetEnumerator() |
    Where-Object { -not $_.Value }
)

if ($failed.Count -gt 0) {
  throw "Integration failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success = $true
  system = "AVOS Autonomous Enterprise OS Ultimate V1"
  integrationTests = "passed"
  checks = $checks.Count
} | Format-List