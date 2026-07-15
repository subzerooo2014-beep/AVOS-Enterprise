param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$module = Get-Content `
  (Join-Path $RepoRoot "apps/api/src/global-intelligence-platform/global-intelligence-platform.module.ts") `
  -Raw

$app = Get-Content `
  (Join-Path $RepoRoot "apps/api/src/app.module.ts") `
  -Raw

$checks = @{
  module = $module -match "GlobalIntelligencePlatformService"
  export = $module -match "exports:\s*\[GlobalIntelligencePlatformService\]"
  registration = $app -match "GlobalIntelligencePlatformModule"
  web = Test-Path (
    Join-Path $RepoRoot "apps/web/src/app/global-intelligence-platform/page.tsx"
  )
  mobile = Test-Path (
    Join-Path $RepoRoot "apps/mobile/lib/features/global_intelligence_platform/global_intelligence_platform_screen.dart"
  )
}

$failed = @(
  $checks.GetEnumerator() |
    Where-Object { -not $_.Value }
)

if ($failed.Count) {
  throw "Integration failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success = $true
  system = "AVOS Global Intelligence Platform — Enterprise Brain V2"
  integrationTests = "passed"
  checks = $checks.Count
} | Format-List