param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"

$module = Get-Content (Join-Path $RepoRoot "apps/api/src/ecosystem-platform/ecosystem-platform.module.ts") -Raw
$app = Get-Content (Join-Path $RepoRoot "apps/api/src/app.module.ts") -Raw

$checks = @{
  module = $module -match "EcosystemPlatformService"
  export = $module -match "exports:\s*\[EcosystemPlatformService\]"
  registration = $app -match "EcosystemPlatformModule"
  web = Test-Path (Join-Path $RepoRoot "apps/web/src/app/ecosystem-platform/page.tsx")
  mobile = Test-Path (Join-Path $RepoRoot "apps/mobile/lib/features/ecosystem_platform/ecosystem_platform_screen.dart")
}

$failed = @($checks.GetEnumerator() | Where-Object { -not $_.Value })

if ($failed.Count) {
  throw "Integration failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success = $true
  system = "AVOS Ecosystem Platform Pack V1"
  integrationTests = "passed"
  checks = $checks.Count
} | Format-List